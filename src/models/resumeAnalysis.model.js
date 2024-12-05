const mongoose = require('mongoose');

const resumeAnalysisSchema = new mongoose.Schema({
  score: { type: Number, required: true },
  keySuggestions: { type: [String], required: true },
  areasForImprovement: { type: [String], required: true },
  grammarErrors: { type: [String], required: true },
  repetitiveWords: { type: [String], required: true },
  improvementSuggestions: { type: [String], required: true },
  sectionFeedback: [
    {
      section: { type: String, required: true },
      score: { type: Number, required: true },
      feedback: { type: String, required: true },
      keyImprovements: { type: [String], required: true },
    },
  ],
});

module.exports = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
