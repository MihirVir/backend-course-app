const Test = require("../models/test");
const Video = require("../models/video");
const Purchased = require("../models/purchased");
const createTestCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    const title = req.body.title.split(",");
    const tags = req.body.tags.split(",");
    const { courseName, price, security } = req.body;
    const template = req.file.filename;
    const newCourse = await Test({
      courseName,
      price,
      security,
      tags,
      title,
      template,
      author: userId,
    });

    const savedCourse = await newCourse.save();

    return res
      .status(201)
      .json(savedCourse?._id, savedCourse?.id, { savedCourse });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const deleteTestCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.id;
    const isCourse = await Test.findOneAndDelete({
      _id: courseId,
      author: userId,
    });

    const deleteVideos = await Video.deleteMany({ courseId: courseId });
    return res.status(200).json(
      (successObj = {
        isCourse,
        deleteVideos,
        message: "Successfully deleted the course",
      })
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getSpecificCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.id;
    // searching course
    const isCourse = await Test.findById(courseId).populate("author");
    if (!isCourse) {
      return res.status(404).json({
        message: "Internal Server Error",
      });
    }

    // finding if course is purchased
    const isPurchased = await Purchased.findOne({
      customer: userId,
      coursesPurchased: courseId,
    });

    if (!isPurchased) {
      return res.status(200).json(isCourse);
    }

    // sending videos
    const courseVideos = await Video.findOne({ courseId: courseId });

    return res.status(200).json(
      (response = {
        isCourse,
        courseVideos,
        purchased: true,
      })
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const findCourse = await Test.find({ security: false });
    return res.status(200).json(findCourse);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getCourseRecommendation = async (req, res) => {
  try {
    const courseRec = await Test.find({ security: false }).limit(5);
    return res.status(200).json(courseRec);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
const searchCourseUsingRegExp = async (req, res) => {
  try {
    const query = req.query.q;

    const findCourse = await Test.find({
      courseName: { $regex: query, $options: "i" },
    }).limit(5);

    return res.status(200).json(findCourse);
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
const getAllCourseCreatedByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const getCourses = await Test.find({ author: userId });
    if (!getCourses) {
      return res.status(404).json({
        message: "no course available",
      });
    }
    return res.status(200).json(getCourses);
  } catch (err) {
    console.log(err);
  }
};
const updateCourseTitle = async (req, res) => {
  try {
    const { courseName } = req.body;
    console.log(courseName);
    const courseId = req.params.id;
    const userId = req.user.id;
    const findCourse = await Test.findById(courseId);
    if (!findCourse) {
      return res.status(404).json({
        message: "Course Not Found",
      });
    }
    if (findCourse.author != userId) {
      return res.status(401).json({
        message: "Unauthorized Access isnt allowed",
      });
    }
    const updatingCourse = await Test.findByIdAndUpdate(
      courseId,
      {
        courseName: courseName,
      },
      { new: true }
    );

    return res.status(200).json(updatingCourse);
  } catch (err) {
    console.error(err);
  }
};
module.exports = {
  createTestCourse,
  deleteTestCourse,
  getSpecificCourse,
  getAllCourses,
  getCourseRecommendation,
  searchCourseUsingRegExp,
  getAllCourseCreatedByUser,
  updateCourseTitle,
};
