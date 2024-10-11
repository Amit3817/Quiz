const express = require("express");
const { default: mongoose } = require("mongoose");
const cors = require("cors");
const authRoutes=require("./routes/authRoutes")
const quizRoutes=require('./routes/quizRoutes')

const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.dburl)
  .then((result) => {
    app.listen(process.env.PORT);
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });


  

app.use('/auth',authRoutes);
app.use('/quiz',quizRoutes);
app.use("/", (req, res) => {
  res.json({ msg: "success" });
});

app.use((req, res, next) => {
  const excludedRoutes = ["/auth/resendotp", "/quiz/"]; // Adjust these paths as needed

  if (excludedRoutes.includes(req.path)) {
    return next(); // Skip validation for these routes
  }
  
  // Apply validation to all other routes
  return globalValidationMiddleware(req, res, next);
});

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});