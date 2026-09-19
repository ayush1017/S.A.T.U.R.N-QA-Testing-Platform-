import { Router } from 'express';
import { generateJSON } from '../services/aiService.js';
import TestData from '../models/TestData.js';

const router = Router();

const SYSTEM_PROMPT = `You are SATURN, a test data generator for QA testing.
Generate realistic, diverse test data based on the request.
Return JSON in this exact structure:
{
  "dataType": "the type of data generated",
  "count": number,
  "records": [
    {
      "id": 1,
      "name": "Full Name",
      "email": "email@example.com",
      "phone": "+1-555-0100",
      "address": "123 Main St, City, State ZIP",
      "username": "username123",
      "password": "Test@1234",
      "dateOfBirth": "1990-01-15",
      "company": "Company Name"
    }
  ]
}
Generate realistic but fake data. Include only relevant fields for the requested type.
For password fields, use strong test passwords. For emails, use example.com domain.`;

router.post('/generate', async (req, res, next) => {
  try {
    const { dataType, count = 5, locale = 'US' } = req.body;

    if (!dataType) {
      return res.status(400).json({ error: 'dataType is required' });
    }

    const validTypes = ['names', 'emails', 'phones', 'addresses', 'full', 'login', 'custom'];
    if (!validTypes.includes(dataType)) {
      return res.status(400).json({
        error: `Invalid dataType. Must be one of: ${validTypes.join(', ')}`,
      });
    }

    const clampedCount = Math.min(Math.max(parseInt(count) || 5, 1), 20);

    const fieldMap = {
      names: 'names only (first and last name)',
      emails: 'email addresses only',
      phones: 'phone/mobile numbers only',
      addresses: 'full addresses only',
      full: 'complete user profiles with all fields',
      login: 'login credentials (username, email, password)',
      custom: 'custom data as specified',
    };

    const input = `Generate ${clampedCount} ${fieldMap[dataType]} records for locale: ${locale}.`;
    const result = await generateJSON(SYSTEM_PROMPT, input);

    await TestData.create({
      user: req.user.userId,
      dataType,
      locale,
      count: clampedCount,
      result,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/history', async (req, res, next) => {
  try {
    const records = await TestData.find({ user: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('dataType locale count result createdAt');

    res.json({ history: records });
  } catch (err) {
    next(err);
  }
});

export default router;
