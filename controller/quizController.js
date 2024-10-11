const Quiz = require("../models/quiz.js");
const { validationResult } = require("express-validator");

const createQuiz = async (req, res) => {
  try {
    const { title, questions } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      next(error);
    }
    const quiz = new Quiz({ title, questions, createdBy: req.user.userId });
    await quiz.save();
    res.status(201).json({ message: "Quiz created successfully" });
  } catch (error) {
    next(error);
  }
};

const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    if (!quizzes) return res.status(404).json({ message: "No Quiz found" });
    res.json(quizzes);
  } catch (err) {
    next(err);
  }
};

const getQuizDetails = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json(quiz);
  } catch (err) {
    next(err);
  }
};

const submitQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    const userAnswers = req.body.answers;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      next(error);
    }
    let score = 0;

    quiz.questions.forEach((question, index) => {
      if (
        question.options.some(
          (option) => option.correct && userAnswers[index] === option.text
        )
      ) {
        score++;
      }
    });

    const update = await User.findByIdAndUpdate(userId, {
      $push: { quizAttempts: { quizId: quiz._Id, score: score } },
    });
    if (update)
      return res.json({ success: true, msg: "Score updated successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createQuiz,
  getQuizzes,
  getQuizDetails,
  submitQuiz,
};
