import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    type: { type: 'string', required: true },
    kishanId: { type: 'string', unique: true },
    name: { type: String, required: true },
    address: { type: String },
    phone: { type: String, required: true, unique: true },
});

const User = mongoose.model('User', userSchema);

export default User;
