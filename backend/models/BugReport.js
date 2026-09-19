import mongoose from 'mongoose';

const bugReportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    summary: String,
    stepsPerformed: String,
    actualResult: String,
    expectedResult: String,
    environment: String,
    result: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true },
);

const BugReport = mongoose.model('BugReport', bugReportSchema);

export default BugReport;
