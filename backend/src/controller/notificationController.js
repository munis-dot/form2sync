import Notification from '../models/Notification.js';

export const createNotification = async ({
    message,
    type = 'info',
    recipientId,
    senderId,
    orderId = null,
}) => {
    return await Notification.create({
        message,
        type,
        recipientId,
        senderId,
        orderId,
    });
};

export const getNotificationsByUser = async (req, res) => {
    const { userId } = req.params;
    try {

        const notifications = await Notification.find({ recipientId: userId })
            .sort({ createdAt: -1 }); // newest first
            console.log(notifications)
        res.json(notifications);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to fetch notifications');
    }
};