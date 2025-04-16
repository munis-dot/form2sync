import mongoose from "mongoose";

const StockSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    userId:{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    farmName: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    sales: { type: Number, default: 0 },
    image: { type: String, required: true } // Path to the image file
});

const Stock = mongoose.model('Stock', StockSchema);
export default Stock;
