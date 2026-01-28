import mongoose from 'mongoose';

const diagnosisRecordSchema = new mongoose.Schema({
  syndrome: { type: String, required: true },
  timestamp: { type: Number, default: Date.now }
}, { timestamps: true });

const DiagnosisRecord = mongoose.model('DiagnosisRecord', diagnosisRecordSchema);

export default DiagnosisRecord;
