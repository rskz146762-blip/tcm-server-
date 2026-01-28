import mongoose from 'mongoose';

const knowledgeSectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true }
});

const knowledgeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  icon: { type: String },
  sections: [knowledgeSectionSchema]
}, { timestamps: true });

const Knowledge = mongoose.model('Knowledge', knowledgeSchema);

export default Knowledge;
