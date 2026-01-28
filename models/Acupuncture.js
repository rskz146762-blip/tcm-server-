import mongoose from 'mongoose';

const acupunctureSchema = new mongoose.Schema({
  name: { type: String, required: true },
  meridian: { type: String },
  location: { type: String },
  function: { type: String },
  indication: { type: String },
  method: { type: String },
  caution: { type: String }
}, { timestamps: true });

const Acupuncture = mongoose.model('Acupuncture', acupunctureSchema);

export default Acupuncture;
