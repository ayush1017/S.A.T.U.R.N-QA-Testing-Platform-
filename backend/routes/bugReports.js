import { Router } from 'express';
import { generateJSON } from '../services/aiService.js';
import BugReport from '../models/BugReport.js';

const router = Router();

const SYSTEM_PROMPT = `You are SATURN, an expert QA engineer specializing in bug reporting.
Generate a professional, structured bug report based on the provided information.
Return JSON in this exact structure:
{
  "bugId": "BUG-XXXX (generate a random 4-digit number)",
  "summary": "Clear, concise bug summary",
  "environment": {
    "os": "Operating system",
    "browser": "Browser and version",
    "appVersion": "Application version",
    "device": "Device type if applicable"
  },
  "stepsToReproduce": ["Step 1", "Step 2", "Step 3"],
  "expectedResult": "What should happen",
  "actualResult": "What actually happened",
  "severity": "Critical|Major|Minor|Trivial",
  "priority": "High|Medium|Low",
  "attachments": "Suggested screenshots or logs to attach",
  "additionalNotes": "Any extra context or workaround"
}
Be specific and professional. Infer reasonable environment details if not provided.`;

router.post('/generate', async (req, res, next) => {
  try {
    const { summary, stepsPerformed, actualResult, expectedResult, environment } = req.body;

    if (!summary || !stepsPerformed || !actualResult) {
      return res.status(400).json({
        error: 'Please provide summary, stepsPerformed, and actualResult',
      });
    }

    const input = [
      `Bug Summary: ${summary}`,
      `Steps Performed: ${stepsPerformed}`,
      `Actual Result: ${actualResult}`,
      expectedResult && `Expected Result: ${expectedResult}`,
      environment && `Environment: ${environment}`,
    ]
      .filter(Boolean)
      .join('\n');

    const result = await generateJSON(SYSTEM_PROMPT, input);

    await BugReport.create({
      user: req.user.userId,
      summary,
      stepsPerformed,
      actualResult,
      expectedResult,
      environment,
      result,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/history', async (req, res, next) => {
  try {
    const records = await BugReport.find({ user: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('summary result createdAt');

    res.json({ history: records });
  } catch (err) {
    next(err);
  }
});

export default router;
