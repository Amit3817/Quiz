const User = require("../model/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function checkPassword(str) {
  var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return re.test(str);
}

const signUp = async (req, res, next) => {
  try {
    const { email, password, name, type } = req.body;
    const old = await User.findOne({ email: email.toLowerCase() });
    if(old&&old.emailverify) 
      {
        console.log(1)
        return res.json("User already exists");
      }
    else if (!old) {
      if (!checkPassword(password)) {
        return res.json({
          success: false,
          msg: "Please enter a strong password",
        });
      }

      const encpassword = await bcrypt.hash(password, 12);

      await User.create({
        email: email.toLowerCase(),
        password: encpassword,
        name: name,
        type: type,
      });
      next();
    } else {
      if (!old.emailverify) {
        next();
      } else {
        return res.json({ success: false, msg: "User already exists" });
      }
    }
  } catch (error) {
    next(error);
  }
};

const logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.json({ success: false, msg: "User not found" });
    if (user.emailverify == true) {
      const cmp = await bcrypt.compare(password, user.password);
      if (!cmp) return res.json({ success: false, msg: "Wrong password" });
      const token = jwt.sign(
        { email: email.toLowerCase(), user: user._id},
        process.env.secretkey,
        { expiresIn: "1d" }
      );
      if (token) {
        return res.json({ success: true, msg: `Welcome`, token });
      }
    } else {
      return res.json({ success: false, msg: "Email not verified" });
    }
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.json({ success: "false", message: "User not found" });
    }
    const token = jwt.sign(
      { email: email.toLowerCase(), user: user._id },
      process.env.secretkey,
      { expiresIn: "1d" }
    );
    if (token) {
      next();
    }
  } catch (err) {
    next(err);
  }
};

const otpVerify = async (req, res, next) => {
  try {
    const {otp}=req.body;
    const result = await bcrypt.compare(otp, req.user.otp);
    if (result) {
      const updated = await User.updateOne(
        { email: req.user.email.toLowerCase() },
        {
          $set: {
            emailverify: true,
          },
        }
      );
      if (updated) {
        return res.json({ success: true, msg: "OTP verified", token });
      }
    }
    return res.json({ success: false, msg: "Wrong OTP entered" });
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const newpassword = req.body.newpassword;

    if (!checkPassword(newpassword)) {
      return res.json({
        success: false,
        msg: "Please enter a strong password",
      });
    }
    const encpassword = await bcrypt.hash(newpassword, 12);
    const user = await User.findOne({ email: req.user.email });
    const updated = await User.updateOne(
      { email: req.user.email },
      {
        $set: {
          password: encpassword,
        },
      }
    );
    if (updated) {
      return res.json({
        success: true,
        msg: "Password changed",
        token: user.token,
      });
    }

    return res.json({ success: false, msg: "Password change failed" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signUp,
  logIn,
  otpVerify,
  changePassword,
  forgotPassword,
};
