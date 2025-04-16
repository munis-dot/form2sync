import Order from '../models/OrderSchema.js';
import Stock from '../models/StockSchema.js';
import User from '../models/UserSchema.js';
import { createNotification } from './notificationController.js';

// export const getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .populate('userId', 'name email') // select user fields to return
//       .populate('items.productId', 'name price'); // populate item details

//     const formattedOrders = orders.map(order => ({
//       id: order._id,
//       customerName: order.userId?.name || 'Unknown',
//       orderNumber: `ORD-${order.createdAt.getFullYear()}-${order._id.toString().slice(-4)}`,
//       items: order.items.map(item => ({
//         name: item.productId?.name || 'Unknown Product',
//         quantity: item.quantity,
//         price: item.productId?.price || 0,
//       })),
//       totalAmount: order.items.reduce((total, item) => {
//         return total + (item.quantity * (item.productId?.price || 0));
//       }, 0),
//       status: order.status,
//       orderDate: order.createdAt,
//       deliveryAddress: order.deliveryAddress || 'N/A',
//       paymentMethod: order.paymentMethod || 'N/A',
//     }));

//     res.status(200).json(formattedOrders);
//   } catch (error) {
//     console.error('Failed to fetch orders:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

export const placeOrder = async (req, res) => {
  const { userId, items } = req.body;

  try {
    // 1. Create order
    console.log(items)
    const order = await Order.create({ userId, items });

    // 2. Update stock and trigger notifications
    for (const item of items) {
      const stock = await Stock.findOne({ _id: item.id });
        console.log(stock)
      if (!stock || stock.quantity < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${item.productId}` });
      }

      // Update stock quantity
      stock.quantity -= item.quantity;
      await stock.save();

      const farmUser = await User.findOne({ farmName: stock.farmName });
      console.log(farmUser)
      // 3. Notify farm user about order
      if (farmUser) {
        await createNotification({
          message: `New order placed by user ${userId} for product ${stock.productName}`,
          type: 'order',
          recipientId: farmUser._id,
          senderId: userId,
          orderId: order._id,
        });

        // 4. Low stock notification
        if (stock.quantity < 10) {
          await createNotification({
            message: `Low stock alert: ${stock.productName} has only ${stock.quantity} left.`,
            type: 'info',
            recipientId: farmUser._id,
            senderId: userId,
            orderId: order._id,
          });
        }
      }
    }

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error placing order');
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.id })
    .populate('userId') // ✅ now works because of ref
    .populate('items.id') 
    .lean();

  console.log(JSON.stringify(orders, null, 2));
    res.json(orders);
  } catch (err) {
    console.error('Error getting orders:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const cancelOrderByUser = async (req, res) => {
  const { orderId } = req.params;
  const { userId } = req.query;

  try {
    const order = await Order.findOne({ _id: orderId, userId: userId });

    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (['delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({ message: 'Order cannot be cancelled' });
    }

    order.status = 'Cancelled';
    await order.save();
   
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


export const getSellerOrders = async (req, res) => {
  try {
    const { farmName } = req.params;

    if (!farmName) {
      return res.status(400).json({ message: 'Farm name is missing from user data' });
    }

    // Step 1: Get all product IDs for this seller's farm
    const products = await Stock.find({ farmName });
    const productIds = products.map(p => p._id);
    if (productIds.length === 0) {
      return res.json([]); // no orders if seller has no products
    }

    // Step 2: Find all orders that include any of these product IDs
    const orders = await Order.find({ 'items.id': { $in: productIds } }).populate('userId') // ✅ now works because of ref
    .populate('items.id') 
    .lean();;
    console.log(orders)

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching seller orders', error: err.message });
  }
};


export const updateOrderStatusBySeller = async (req, res) => {
  const { orderId } = req.params;
  const { status, farmName } = req.body;
  const validStatuses = ['processing', 'ready', 'delivered', 'cancelled'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status update' });
  }

  try {
    // Find products for this seller
    const products = await Stock.find({ farmName });
    const productIds = products.map(p => p._id);
    const farmUser = await User.findOne({ farmName });

    const order = await Order.findOne({
      _id: orderId,
      'items.id': { $in: productIds },
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found for your farm' });
    }

    // Update status
    order.status = status;
    await order.save();

    await createNotification({
      message: `Your order ${orderId} status has been updated to '${status}'.`,
      type: 'order',
      recipientId: order.userId._id, // customer
      senderId: farmUser._id,        // seller
      orderId: order._id,
    });

    res.json({ message: 'Order status updated', order });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error updating order status', error: err.message });
  }
};

export const getSalesAnalytics = async (req, res) => {
  try {
    const { farmName } = req.params;
    if (!farmName) {
      return res.status(400).json({ message: 'Farm name is missing from user data' });
    }

    // Get all product IDs for this seller's farm
    const products = await Stock.find({ farmName });
    const productIds = products.map(p => p._id);

    if (productIds.length === 0) {
      return res.json({ totalSales: 0, salesByDay: { labels: [], values: [] }, orderStatus: [] });
    }

    // Common match condition
    const baseMatch = {
      status: { $ne: 'cancelled' },
      'items.id': { $in: productIds }
    };

    // 1. Total Sales
    const totalSalesResult = await Order.aggregate([
      { $match: baseMatch },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);
    const totalSales = totalSalesResult[0]?.total || 0;

    // 2. Sales by Day (past 7 days)
    const pastWeek = new Date();
    pastWeek.setDate(pastWeek.getDate() - 6);

    const salesByDayRaw = await Order.aggregate([
      {
        $match: {
          ...baseMatch,
          createdAt: { $gte: pastWeek }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    const dayOrder = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date().getDay();
    const weekDays = Array.from({ length: 7 }, (_, i) => dayOrder[(today - 6 + i + 7) % 7]);

    const salesByDayMap = salesByDayRaw.reduce((acc, curr) => {
      acc[curr._id] = curr.total;
      return acc;
    }, {});

    const salesByDay = {
      labels: weekDays,
      values: weekDays.map(day => salesByDayMap[day] || 0)
    };

    // 3. Order Status Count
    const statusData = await Order.aggregate([
      { $match: baseMatch },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusColors = {
      processing: '#FFCC00',
      ready: '#3399FF',
      delivered: '#00CC66',
      cancelled: '#FF3333'
    };

    const orderStatus = statusData.map(s => ({
      label: s._id.charAt(0).toUpperCase() + s._id.slice(1),
      count: s.count,
      color: statusColors[s._id] || '#999'
    }));

    // ✅ Final Response
    res.json({
      totalSales,
      salesByDay,
      orderStatus
    });
  } catch (error) {
    console.error('Error in getSalesAnalytics:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
