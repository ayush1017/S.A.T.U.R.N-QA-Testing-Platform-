import { Router } from 'express';
import Feedback from '../models/Feedback.js';
import User from '../models/User.js';
import { sendFeedbackEmail } from '../services/emailService.js';

const router = Router();

const VALID_CATEGORIES = ['general', 'bug', 'feature', 'ui', 'ai', 'other'];

router.post('/', async (req, res, next) => {
  try {
    const { rating, category = 'general', subject, message } = req.body;

    if (!rating || !subject?.trim() || !message?.trim()) {
      return res.status(400).json({
        error: 'Rating, subject, and message are required',
      });
    }

    const numericRating = Number(rating);
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ error: 'Rating must be an integer between 1 and 5' });
    }

    if (!VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({
        error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`,
      });
    }

    const feedback = await Feedback.create({
      user: req.user.userId,
      rating: numericRating,
      category,
      subject: subject.trim(),
      message: message.trim(),
    });

    const submitter = await User.findById(req.user.userId).select('name username email');

    let emailSent = false;
    let emailWarning = null;

    try {
      await sendFeedbackEmail({ feedback, submitter });
      emailSent = true;
    } catch (emailErr) {
      console.error('Failed to send feedback email:', emailErr.message);
      emailWarning = emailErr.message;
    }

    res.status(201).json({
      feedback: {
        id: feedback._id,
        rating: feedback.rating,
        category: feedback.category,
        subject: feedback.subject,
        message: feedback.message,
        status: feedback.status,
        createdAt: feedback.createdAt,
      },
      emailSent,
      ...(emailWarning && { emailWarning }),
    });
  } catch (err) {
    next(err);
  }
});

router.get('/history', async (req, res, next) => {
  try {
    const records = await Feedback.find({ user: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(30)
      .select('rating category subject message status createdAt');

    res.json({
      history: records.map((item) => ({
        id: item._id,
        rating: item.rating,
        category: item.category,
        subject: item.subject,
        message: item.message,
        status: item.status,
        createdAt: item.createdAt,
      })),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
