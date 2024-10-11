const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  title: { 
    type: String,
    required: true
 },
  questions: [
    {
      questionText: { 
        type: String,
         required: true },
      options: [{ text: String
        , correct: Boolean }],
    },
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Quiz", quizSchema);
