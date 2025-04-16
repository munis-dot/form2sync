import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // ✅ Add ref here
  },
  items: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stock', // ✅ Add ref here
      },
      quantity: Number,
    },
  ],
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Ready', 'Delivered', 'Cancelled', 'pending', 'processing', 'ready', 'delivered', 'cancelled'],
    default: 'Pending',
  },
}, {
  timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
