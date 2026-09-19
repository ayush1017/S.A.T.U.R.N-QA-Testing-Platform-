import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { seedDefaultUser } from './config/seed.js';
import authRouter from './routes/auth.js';
import testCasesRouter from './routes/testCases.js';
import bugReportsRouter from './routes/bugReports.js';
import chatRouter from './routes/chat.js';
import testDataRouter from './routes/testData.js';
import feedbackRouter from './routes/feedback.js';
import { authMiddleware } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    name: 'SATURN QA Agent API',
    version: '1.0.0',
    aiProvider: process.env.AI_PROVIDER || 'gemini',
    database: 'mongodb',
  });
});

app.use('/api/auth', authRouter);

app.use('/api/test-cases', authMiddleware, testCasesRouter);
app.use('/api/bug-reports', authMiddleware, bugReportsRouter);
app.use('/api/chat', authMiddleware, chatRouter);
app.use('/api/test-data', authMiddleware, testDataRouter);
app.use('/api/feedback', authMiddleware, feedbackRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

async function start() {
  await connectDB();
  await seedDefaultUser();

  app.listen(PORT, () => {
    console.log(`SATURN API running on http://localhost:${PORT}`);
  });
}

start();
