const express = require("express");
const { default: mongoose } = require("mongoose");
const cors = require("cors");

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


app.use("/", (req, res) => {
  res.json({ msg: "success" });
});

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});