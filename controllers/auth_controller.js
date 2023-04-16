const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: "User Doesn't Exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(404).json({ message: "invalid username / password" });
    }
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.KEY,
      { expiresIn: "3d" }
    );
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: true,
      expiresIn: "3d",
    });
    return res.status(200).json({ existingUser, token });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      data: {
        message: "Internal Server Error",
      },
    });
  }
};

const registerUser = async (req, res) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const existingUser = User.find({ email: req.body.email });
    if (existingUser === req.body.email) {
      return res.status(401).json({
        message: "Hey bro user already exists",
      });
    }
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hash,
    });
    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.KEY,
      { expiresIn: "3d" }
    );

    return res.status(201).json({ newUser, token });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const deleteUsers = async (req, res) => {
  try {
    await User.deleteMany();
    return res.status(200).json({
      message: "All The Users Are Succeessfully Deleted",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getSpecificUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const specificUser = await User.findById(userId);

    if (!specificUser) {
      return res.status(404).json({
        message: "wrong user id entered",
      });
    }

    return res.status(200).json(specificUser);
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const updateAccount = async (req, res) => {
  try {
    const { username } = req.body;
    const user = req.user.id;
    const findUserAndUpdate = await User.findByIdAndUpdate(
      user,
      {
        username: username,
      },
      {
        new: true,
      }
    );
    return res.status(200).json(findUserAndUpdate);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

const forgotPasswordMail = async (req, res) => {
  const email = req.body.email;
  try {
    // find if the user exists
    const findingUser = await User.findOne({ email: email });
    if (!findingUser) {
      return res.status(200).json({
        message: "invalid email",
      });
    }
    let testAccount = await nodemailer.createTestAccount();
    // connect with smtp server
    let transporter = await nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });
    const token = jwt.sign(
      { email: email, id: findingUser.id },
      process.env.KEY,
      {
        expiresIn: "4m",
      }
    );
    console.log(token);
    let info = await transporter.sendMail({
      from: '"Mihir Course App" <mihirmajorproject@gmail.com>',
      to: `${email}`,
      subject: "Regarding Password Change",
      text: "Hello",
      html: `
        <h1>Hello ${findingUser.username}</h1>
        <p>This is the link you need to click on to change your password </p> <a style = "display: block; margin-top: 1rem;"  href = "http://localhost:3000/changepassword/${findingUser.id}/${token}"> Click here to change password </a>
        <i style = "margin-top: 1rem;" >Sadly, this link will expire in 4 minutes make sure to click the link on time </i>
      `,
    });

    console.log("mesage: ", info.messageId);
    return res.status(200).json({ info, token: token });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "internal server error",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { password } = req.body;
    const user = req.user.id;
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 3);
    const findingUserValid = await User.findById(user);
    if (!findingUserValid) {
      return res.status(200).json({
        message: "Not a valid user",
      });
    }
    // edge cases added
    // 1) if user changed their password few days ago (for example 2 days ago)
    //    they cant change their password anymore
    // if (findingUserValid.updatedAt >= currentDate) {
    //   // the doc was updated withing last 3 days
    //   return res.status(400).json({
    //     message: "can't change password more than 1 time in three days",
    //   });
    // }
    const salt = bcrypt.genSaltSync(10);
    const hashedPass = bcrypt.hashSync(password, salt);

    // changin pass
    const updatedUser = await User.findByIdAndUpdate(
      user,
      { password: hashedPass },
      { new: true }
    );

    return res.status(200).json({
      updatedUser,
      message: "changed password try to login again",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  loginUser,
  registerUser,
  deleteUsers,
  getUsers,
  getSpecificUser,
  updateAccount,
  forgotPasswordMail,
  changePassword,
};
