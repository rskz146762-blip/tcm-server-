import mongoose from 'mongoose';

const constitutionRecordSchema = new mongoose.Schema({
  constitution: { type: String, required: true },
  timestamp: { type: Number, default: Date.now }
}, { timestamps: true });

const ConstitutionRecord = mongoose.model('ConstitutionRecord', constitutionRecordSchema);

export default ConstitutionRecord;
