import MessageSchema from "../models/MessageSchema.js";
import User from "../models/UserSchema.js";

export const getMessages = async (req, res) => {
    const { recipientId } = req.params;
    const { userId } = req.query;

    try {
        const messages = await MessageSchema.find({
            $or: [
                { senderId: userId, recipientId },
                { senderId: recipientId, recipientId: userId }
            ]
        }).sort({ timestamp: 1 });

        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Failed to load messages' });
    }
};

export const userList = async (req, res) => {
    const { id } = req.params;
    try {
        const users = await User.find({ _id: id }).populate('chatList')
        console.log(users);
        res.json(users)
    }
    catch (err) {
        res.status(500).json({ error: 'failed to fetch' })
    }
}

export const updateChatList = async (req, res) => {
    const { from, to } = req.body;
    try {
        await User.findByIdAndUpdate(
            { _id: from },
            { $addToSet: { chatList: to } }, // prevents duplicates
            { new: true }
        );
        res.status(200)
    } catch (error) {
        res.status(500).json({ error: 'failed to put user' })
    }
}

export const sendMsg = async (req, res) => {
    const { senderId, recipientId, content, timestamp } = req.body;
    console.log(req.body)
    try{
        const message = await MessageSchema.create({ senderId, recipientId, content, timestamp });
        res.status(200).json(message);
    }
    catch(err){
        console.log(err)
        res.status(500).json({ error: 'failed to send message' })
    }
    
}