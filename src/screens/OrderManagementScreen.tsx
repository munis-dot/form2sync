import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView, TextInput, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import axios from 'axios';
import { Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import Icon2 from 'react-native-vector-icons/Ionicons'

interface OrderItem {
  id: string;
  customerName: string;
  orderNumber: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  deliveryAddress: string;
  paymentMethod: string;
}

const DUMMY_ORDERS: OrderItem[] = [
  {
    id: '1',
    customerName: 'John Doe',
    orderNumber: 'ORD-2024-001',
    items: [
      { name: 'Tomatoes', quantity: 2, price: 40 },
      { name: 'Potatoes', quantity: 1, price: 30 }
    ],
    totalAmount: 110,
    status: 'pending',
    orderDate: '2024-03-10T10:30:00',
    deliveryAddress: '123 Farm Street, Agricultural Zone, 600001',
    paymentMethod: 'Cash on Delivery'
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    orderNumber: 'ORD-2024-002',
    items: [
      { name: 'Onions', quantity: 3, price: 25 },
      { name: 'Carrots', quantity: 2, price: 35 }
    ],
    totalAmount: 145,
    status: 'processing',
    orderDate: '2024-03-10T11:45:00',
    deliveryAddress: '456 Harvest Road, Rural District, 600002',
    paymentMethod: 'Online Payment'
  },
]

const OrderManagementScreen = ({ navigation }) => {

  const user = useSelector((state: RootState) => state.auth.user)


  const [orders, setOrders] = useState<OrderItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  const statusColors = {
    pending: { bg: '#FFF3E0', text: '#FF9800', icon: 'clock-outline' },
    processing: { bg: '#E3F2FD', text: '#2196F3', icon: 'progress-clock' },
    shipped: { bg: '#E8F5E9', text: '#4CAF50', icon: 'truck-delivery-outline' },
    delivered: { bg: '#E8F5E9', text: '#00A41C', icon: 'check-circle-outline' },
    cancelled: { bg: '#FFEBEE', text: '#F44336', icon: 'close-circle-outline' }
  }

  const statusFilters = [
    { label: 'All Orders', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Processing', value: 'processing' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Cancelled', value: 'cancelled' }
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const updateOrderStatus = (orderId: string, newStatus: OrderItem['status']) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = selectedStatus === 'all' || order.status.toLowerCase() === selectedStatus

    return matchesSearch && matchesStatus
  })

  const getOrders = () => {
    const url = user?.type === 'customer'
      ? `user/${user?._id}`
      : `seller/${user?.farmName}`;

    axios.get(`http://192.168.14.130:5000/orders/${url}`)
      .then(res => {
        // Assuming the response contains the order structure as shown
        const ordersWithFormattedItems = res.data.map((order: any) => ({
          id: order._id,
          customerId: order.userId._id,
          customerName: order.userId.userName,
          orderNumber: order._id,
          items: order.items.map((item: any) => ({
            sellerId: item.id?.userId,
            name: item.id?.productName ?? 'Unknown',  // Ensure to map the product name if it's available
            quantity: item.quantity,
            price: item.id?.price ?? 0,  // Ensure price is pulled if available
          })),
          totalAmount: order.items.reduce((total: number, item: any) => total + item.quantity * (item.id?.price ?? 0), 0),  // Calculate total amount based on quantity and price
          status: order.status,
          orderDate: order.createdAt,
          deliveryAddress: `${order.userId.address.village}, ${order.userId.address.city}, ${order.userId.address.state}, ${order.userId.address.country}`,
          paymentMethod: 'Cash on Delivery',  // Update with actual payment method if applicable
        }));
        console.log(res.data)
        setOrders(ordersWithFormattedItems);
      })
      .catch(err => console.error('Error fetching orders:', err));
  }

  useEffect(() => {
    getOrders()
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      const res = await axios.patch(`http://192.168.14.130:5000/orders/seller/${orderId}/status`, { status, farmName: user?.farmName });
      Alert.alert('Status updated to: ' + res.data.order.status);
      getOrders();
    } catch (err) {
      console.error('Failed to update order status:', err.response?.data?.message || err.message);
    }
  };

  const handleCancel = async (orderId) => {
    if (user?.type === 'customer') {
      try {
        await axios.patch(`http://192.168.14.130:5000/orders/user/${orderId}/cancel?userId=${user?._id}`);
        getOrders();
      } catch (err) {
        console.error('Cancel failed:', err.response?.data?.message || err.message);
      }
    }
    else {
      handleStatusChange(orderId, 'cancelled')
    }

  };

  const renderStatusBadge = (Status: OrderItem['status']) => {
    let status = Status.toLowerCase();
    return (
      <View style={[styles.statusBadge, { backgroundColor: statusColors[status]?.bg }]}>

        <Icon name={statusColors[status].icon} size={16} color={statusColors[status].text} />
        <Text style={[styles.statusText, { color: statusColors[status].text }]}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Text>
      </View>
    )
  }

  const renderOrderItem = ({ item }: { item: OrderItem }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderNumber}>{item.orderNumber}</Text>
          <Text style={styles.customerName}>{item.customerName}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ChatScreen', { selectedUser: { name: item.customerName, _id: item.customerId }, currentUser: user })}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: 60 }}>
              <Icon2 name='chatbubble-ellipses-outline' size={24} color={'#2196F3'} />
              <Text style={{ color: '#2196F3', fontSize: 17 }}>Chat</Text>
            </View>
          </TouchableOpacity>
        </View>
        {renderStatusBadge(item.status)}
      </View>

      <View style={styles.orderDetails}>
        <View style={styles.detailRow}>
          <Icon name="calendar-clock" size={16} color="#666" />
          <Text style={styles.detailText}>{formatDate(item.orderDate)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="currency-inr" size={16} color="#666" />
          <Text style={styles.detailText}>{item.totalAmount}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="map-marker" size={16} color="#666" />
          <Text style={styles.detailText} numberOfLines={1}>{item.deliveryAddress}</Text>
        </View>
      </View>

      <View style={styles.itemsList}>
        {item.items.map((orderItem, index) => (
          <Text key={index} style={styles.itemText}>
            {orderItem.quantity}x {orderItem.name} (₹{orderItem.price})
          </Text>
        ))}
      </View>

      <View style={styles.actionButtons}>
        {user?.type === 'farmer' && item.status !== 'delivered' && item.status !== 'cancelled' && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#E8F5E9' }]}
            onPress={() => {
              const nextStatus: Record<OrderItem['status'], OrderItem['status']> = {
                pending: 'processing',
                processing: 'shipped',
                shipped: 'delivered',
                delivered: 'delivered',
                cancelled: 'cancelled'
              }
              const newStatus = nextStatus[item.status.toLowerCase()]
              if (newStatus && newStatus !== item.status.toLowerCase()) {
                handleStatusChange(item.id, newStatus)
              }
            }}
          >
            <Icon name="arrow-right-circle" size={20} color="#00A41C" />
            <Text style={[styles.actionButtonText, { color: '#00A41C' }]}>
              Move to Next Status
            </Text>
          </TouchableOpacity>
        )}
        {item.status !== 'cancelled' && item.status !== 'delivered' && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#FFEBEE' }]}
            onPress={() => handleCancel(item.id)}
          >
            <Icon name="close-circle" size={20} color="#F44336" />
            <Text style={[styles.actionButtonText, { color: '#F44336' }]}>
              Cancel Order
            </Text>
          </TouchableOpacity>
        )}
        {
          user?.type === 'customer' && item.status == 'delivered' &&
          <TouchableOpacity onPress={() => navigation.navigate('FeedbackScreen', { userId: user._id, from: user.userName, to: item?.items[0]?.sellerId })}>
            <Text style={{ color: '#1196F3', fontSize: 13 }}>Give Feedback</Text>
          </TouchableOpacity>
        }
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order Management</Text>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="magnify" size={24} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search orders by ID or customer name"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
      >
        {statusFilters.map(filter => (
          <TouchableOpacity
            key={filter.value}
            style={[
              styles.filterButton,
              selectedStatus === filter.value && styles.filterButtonActive
            ]}
            onPress={() => setSelectedStatus(filter.value)}
          >
            <Text style={[
              styles.filterButtonText,
              selectedStatus === filter.value && styles.filterButtonTextActive
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.ordersList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}

export default OrderManagementScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#282c3f',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#282c3f',
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
    minHeight: 35,
    maxHeight: 35
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#E8F5E9',
  },
  filterButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#00A41C',
  },
  ordersList: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#282c3f',
  },
  customerName: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  orderDetails: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
    paddingVertical: 12,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  itemsList: {
    marginBottom: 12,
  },
  itemText: {
    fontSize: 14,
    color: '#282c3f',
    marginBottom: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
})