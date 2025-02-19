import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    type: { type: String, required: true },
    kishanId: { type: String, sparse: true  },
    farmName: { type: String },
    userName: { type: String, required: true },
    address: { type: Object, required: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
