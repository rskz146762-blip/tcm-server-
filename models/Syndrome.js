import mongoose from 'mongoose';

const syndromeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  treatment_principle: { type: String },
  lifestyle_advice: { type: String },
  rules: [{
    field: { type: String, required: true },
    value: { type: String, required: true }
  }],
  prescriptions: [{
    name: { type: String, required: true },
    usage_instructions: { type: String }
  }]
}, { timestamps: true });

const Syndrome = mongoose.model('Syndrome', syndromeSchema);

export default Syndrome;
