import mongoose from "mongoose";

const StockSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    formerName: { type: String, required: true },
    category: { type: String, required: true },
    sales: { type: Number, default: 0 },
    image: { type: String, required: true } // Path to the image file
});

const Stock = mongoose.model('Stock', StockSchema);
export default Stock;
