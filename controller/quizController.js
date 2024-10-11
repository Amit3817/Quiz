const Quiz = require("../model/quiz.js");
const User=require("../model/user.js")
const mongoose=require('mongoose')

const createQuiz = async (req, res,next) => {
  try {
    const { title, questions } = req.body;
    const quiz = new Quiz({ title, questions, createdBy: req.user._id });
    await quiz.save();
   return res.status(201).json({ message: "Quiz created successfully" });
  } catch (error) {
    next(error);
  }
};

const getQuizzes = async (req, res,next) => {
  try {
    const quizzes = await Quiz.find();
    if (!quizzes) return res.status(404).json({ message: "No Quiz found" });
    return res.status(200).json(quizzes);
  } catch (err) {
    next(err);
  }
};

const getQuizDetails = async (req, res,next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
   return res.status(200).json(quiz);
  } catch (err) {
    next(err);
  }
};

const submitQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const userAnswers = req.body.answers; 
    let score = 0;

    if (userAnswers.length !== quiz.questions.length) {
      return res.status(400).json({ message: "Invalid number of answers" });
    }

    quiz.questions.forEach((question, index) => {
      const correctOption = question.options.find(option => option.correct);
      
      console.log("User Answer:", userAnswers[index]);
      console.log("Correct Option:", correctOption.text);
      if (correctOption && userAnswers[index] === correctOption.text) {
        score++;
        console.log("Correct! Score incremented to:", score);
      } else {
        console.log("Incorrect answer");
      }
    });

    const update = await User.findByIdAndUpdate(req.user._id, {
      $push: { quizAttempts: { quizId: quiz._id, score: score } },
    });

    if (update)
      return res.status(200).json({ success: true, msg: "Score updated successfully", score: score });
  } catch (err) {
    next(err);
  }
};

const deleteQuiz = async (req, res, next) => {
  try {
    const quizId = req.params.id;
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    if (!quiz.createdBy.equals(new mongoose.Types.ObjectId(req.user._id))) {
      return res.status(403).json({ message: "Unauthorized User" });
    }
    const quizdel = await Quiz.findByIdAndDelete(quizId);
    
    if (!quizdel) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
      deletedQuizId: quiz._id
    });
  } catch (err) {
    next(err);
  }
};




module.exports = {
  createQuiz,
  getQuizzes,
  getQuizDetails,
  submitQuiz,
  deleteQuiz
};
