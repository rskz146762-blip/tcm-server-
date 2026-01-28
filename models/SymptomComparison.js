import mongoose from 'mongoose';

const symptomComparisonSchema = new mongoose.Schema({
  symptomName: { type: String, required: true },
  title: { type: String, required: true },
  feature: { type: String },
  accompanying_signs: { type: String },
  self_observation_tip: { type: String },
  diet_advice: { type: String },
  living_advice: { type: String },
  treatment_suggestion: { type: String }
}, { timestamps: true });

const SymptomComparison = mongoose.model('SymptomComparison', symptomComparisonSchema);

export default SymptomComparison;
