const express=require('express')
const { body, param } = require("express-validator");
const verifytoken  = require("../middleware/isauth.js");
const router = express.Router();
const {
  createQuiz,
  getQuizzes,
  getQuizDetails,
  submitQuiz,
  deleteQuiz
} = require("../controller/quizController");


router.post(
  "/quiz",
  [
    body("title").isString().notEmpty().withMessage("Title is required"),

    body("questions")
      .isArray()
      .notEmpty()
      .withMessage("Questions are required"),

    body("questions.*.questionText")
      .isString()
      .notEmpty()
      .withMessage("Question text is required"),

    body("questions.*.options")
      .isArray()
      .withMessage("Options must be an array"),

    body("questions.*.options.*.text")
      .isString()
      .notEmpty()
      .withMessage("Option text is required"),

    body("questions.*.options.*.correct")
      .isBoolean()
      .withMessage("Correct option must be a boolean"),
  ],
  verifytoken,
  createQuiz
);

router.get("/quiz", getQuizzes);

router.get(
  "/quiz/:id",
  param("id").isMongoId().withMessage("Invalid quiz ID"),
  getQuizDetails
);

router.post(
  "/quiz/:id/submit",
  [
    param("id")
    .isMongoId()
    .withMessage("Invalid quiz ID"),

    body("answers")
    .isArray()
    .notEmpty()
    .withMessage("Answers are required"),

    body("answers.*")
    .isString()
    .withMessage("Each answer must be a string"),
  ],
  verifytoken,
  submitQuiz
);
router.delete('/quiz/:id',verifytoken, deleteQuiz);

module.exports = router;
