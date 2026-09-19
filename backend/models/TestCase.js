import mongoose from 'mongoose';

const testCaseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    requirement: String,
    userStory: String,
    featureDescription: String,
    result: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true },
);

const TestCase = mongoose.model('TestCase', testCaseSchema);

export default TestCase;
