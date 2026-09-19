import { Router } from 'express';
import User from '../models/User.js';
import { signToken, authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/register', async (req, res, next) => {
  try {
    const { username, password, name, email } = req.body;

    if (!username?.trim() || !password || !name?.trim()) {
      return res.status(400).json({ error: 'Username, password, and name are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ username: username.trim().toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    const user = await User.create({
      username: username.trim(),
      password,
      name: name.trim(),
      email: email?.trim(),
    });

    const token = signToken({
      userId: user._id.toString(),
      username: user.username,
      name: user.name,
    });

    res.status(201).json({ token, user: user.toPublicJSON() });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username?.trim() || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await User.findOne({ username: username.trim().toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = signToken({
      userId: user._id.toString(),
      username: user.username,
      name: user.name,
    });

    res.json({ token, user: user.toPublicJSON() });
  } catch (err) {
    next(err);
  }
});

router.get('/me', authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: user.toPublicJSON() });
  } catch (err) {
    next(err);
  }
});

export default router;
