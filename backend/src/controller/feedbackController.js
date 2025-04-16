import Feedback from '../models/feedbackSchema.js';

export const createFeedback = async (req, res) => {
  try {
    const { userId, userName, message, rating, recieverId } = req.body;
    console.log(userId, userName, message, rating, recieverId)
    const feedback = new Feedback({
      userId,
      userName,
      message,
      rating,
      recieverId
    });

    const savedFeedback = await feedback.save();
    res.status(201).json(savedFeedback);
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ error: 'Failed to create feedback' });
  }
};

export const getFeedbackByUserId = async (req, res) => {
    try {
      const { recieverId } = req.params;
        console.log(recieverId)
      const feedbacks = await Feedback.find({ recieverId }).sort({ createdAt: -1 });
  
      if (!feedbacks || feedbacks.length === 0) {
        return res.status(200).json({ message: 'No feedback found for this user' });
      }
  
      res.status(200).json(feedbacks);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      res.status(500).json({ error: 'Failed to fetch feedback' });
    }
  };
  