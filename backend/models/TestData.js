import mongoose from 'mongoose';

const testDataSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dataType: { type: String, required: true },
    locale: String,
    count: Number,
    result: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true },
);

const TestData = mongoose.model('TestData', testDataSchema);

export default TestData;
