import { Router } from 'express';
import { generateAIResponse } from '../services/aiService.js';
import ChatMessage from '../models/ChatMessage.js';

const router = Router();

const SYSTEM_PROMPT = `You are SATURN, an expert QA assistant with deep knowledge of software testing.
You help testers with:
- Software Testing Life Cycle (STLC)
- Test types (smoke, regression, sanity, UAT, etc.)
- Test design techniques (equivalence partitioning, boundary value analysis, etc.)
- Automation frameworks (Selenium, Playwright, Cypress, etc.)
- Bug reporting best practices
- Agile testing methodologies
- API testing, performance testing, security testing

Provide clear, concise, and practical answers. Use examples when helpful.
Format your responses with markdown for readability (headings, bullet points, code blocks).
When asked to write test scripts, provide complete, runnable code with comments.`;

router.post('/', async (req, res, next) => {
  try {
    const { message, history = [] } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const contextMessages = history
      .slice(-6)
      .map((h) => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`)
      .join('\n');

    const prompt = contextMessages
      ? `Previous conversation:\n${contextMessages}\n\nUser: ${message}`
      : message;

    const response = await generateAIResponse(SYSTEM_PROMPT, prompt);

    await ChatMessage.insertMany([
      { user: req.user.userId, role: 'user', content: message },
      { user: req.user.userId, role: 'assistant', content: response },
    ]);

    res.json({ response });
  } catch (err) {
    next(err);
  }
});

router.get('/history', async (req, res, next) => {
  try {
    const messages = await ChatMessage.find({ user: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .select('role content createdAt');

    res.json({ history: messages.reverse() });
  } catch (err) {
    next(err);
  }
});

export default router;
