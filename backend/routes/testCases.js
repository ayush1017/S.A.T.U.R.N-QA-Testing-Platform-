import { Router } from 'express';
import { generateJSON } from '../services/aiService.js';
import TestCase from '../models/TestCase.js';

const router = Router();

const SYSTEM_PROMPT = `You are SATURN, an expert QA engineer specializing in test case design.
Generate comprehensive, well-structured test cases based on the given requirement.
Return JSON in this exact structure:
{
  "requirement": "the original requirement",
  "scenarios": [
    {
      "id": "TS-001",
      "title": "Scenario title",
      "description": "Brief scenario description"
    }
  ],
  "positiveCases": [
    {
      "id": "TC-P-001",
      "title": "Test case title",
      "preconditions": "Setup required",
      "steps": ["Step 1", "Step 2"],
      "expectedResult": "Expected outcome",
      "priority": "High|Medium|Low"
    }
  ],
  "negativeCases": [
    {
      "id": "TC-N-001",
      "title": "Test case title",
      "preconditions": "Setup required",
      "steps": ["Step 1", "Step 2"],
      "expectedResult": "Expected error/behavior",
      "priority": "High|Medium|Low"
    }
  ],
  "edgeCases": [
    {
      "id": "TC-E-001",
      "title": "Test case title",
      "preconditions": "Setup required",
      "steps": ["Step 1", "Step 2"],
      "expectedResult": "Expected outcome",
      "priority": "High|Medium|Low"
    }
  ]
}
Generate at least 2 scenarios, 3 positive cases, 3 negative cases, and 2 edge cases.`;

router.post('/generate', async (req, res, next) => {
  try {
    const { requirement, userStory, featureDescription } = req.body;

    if (!requirement && !userStory && !featureDescription) {
      return res.status(400).json({
        error: 'Please provide at least one of: requirement, userStory, or featureDescription',
      });
    }

    const input = [
      requirement && `Requirement: ${requirement}`,
      userStory && `User Story: ${userStory}`,
      featureDescription && `Feature Description: ${featureDescription}`,
    ]
      .filter(Boolean)
      .join('\n');

    const result = await generateJSON(SYSTEM_PROMPT, input);

    await TestCase.create({
      user: req.user.userId,
      requirement,
      userStory,
      featureDescription,
      result,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/history', async (req, res, next) => {
  try {
    const records = await TestCase.find({ user: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('requirement userStory featureDescription result createdAt');

    res.json({ history: records });
  } catch (err) {
    next(err);
  }
});

export default router;
