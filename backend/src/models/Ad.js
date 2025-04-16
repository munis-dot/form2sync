import mongoose from 'mongoose';

const adSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Optional: link to user who posted
    },
  },
  {
    timestamps: true,
  }
);

const Ad = mongoose.model('Ad', adSchema);
export default Ad;
