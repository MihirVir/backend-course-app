const Course = require("../models/course");
const Purchased = require("../models/purchased");

const uploadVideo = async (req, res) => {
  try {
    let arr = [];
    let videoNameArr = [];
    console.log(req.files);
    req.files.forEach((file) => {
      // console.log(file);
      arr.push(file.path);
      videoNameArr.push(file.filename);
    });
    const title = req.body.title;
    let titleArr = title.replace(/\s/g, "").split(",");
    let titleArrSize = titleArr.length;
    const lengthOfFiles = arr.length;
    const tags = req.body.tags;
    let tagsArr = tags.split(",");
    let newTags = [];

    tagsArr.forEach((tag) => {
      newTags = tag.trim(" ");
    });
    if (titleArrSize !== lengthOfFiles) {
      return res.status(404).json({
        responseStatus: 404,
        message:
          "Invalid Size Of The Array as title arr and files size don't match",
      });
    }

    const newCourse = new Course({
      title: titleArr,
      video: arr,
      tags: newTags,
      author: req.user.id,
      videoName: videoNameArr,
      courseName: req.body.name,
      price: req.body.price,
    });

    const savedCourse = await newCourse.save();
    return res.status(201).json({
      message: "Successfully uploaded the course",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const removeAllCourses = async (req, res) => {
  try {
    await Course.deleteMany();
    return res.status(200).json({
      message: "Successfully deleted the courses",
    });
  } catch (err) {
    return res.status(500).json({
      responseStatus: 500,
      message: "Internal Server Error",
    });
  }
};

const getAllCourse = async (req, res) => {
  try {
    const getCourses = await Course.find();
    return res.status(200).json(getCourses);
  } catch (err) {
    return res.status(500).json({
      responseStatus: 500,
      message: "Internal Server Error",
    });
  }
};

const removeSpecificCourse = async (req, res) => {
  try {
    const courseId = req.params.course;
    await Course.findByIdAndDelete({ id: courseId });
    return res.status(200).json({
      responseStatus: 200,
      message: "Successfully Deleted The Course",
    });
  } catch (err) {
    return res.status(500).json({
      responseStatus: 500,
      message: "Internal Server Error",
    });
  }
};

const getSpeficCourse = async (req, res) => {
  try {
    const courseId = req.parmas.courseId;

    const course = await Course.findById({ id: courseId });

    if (!course) {
      return res.status(404).json({
        responseStatus: 404,
        message: "Course Not Found :(",
      });
    }

    return res.status(200).json({
      responseStatus: 200,
      course,
    });
  } catch (err) {
    return res.status(500).json({
      responseStatus: 500,
      message: "Internal Server Error",
    });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();

    return res.status(200).json({
      responseStatus: 200,
      courses,
    });
  } catch (err) {
    return res.status(500).json({
      responseStatus: 500,
      message: "Internal Server Error",
    });
  }
};

const deleteSpecificVideo = async (req, res) => {
  try {
    let arr = [];
    let videoName = [];
    const courseId = req.params.id;
    const idx = req.body.index;
    const findCourse = await Course.findById({ _id: courseId });
    if (!findCourse) {
      return res.status(404).json({
        responseStatus: 404,
        message: "Course Not Found :(",
      });
    }
    let titleArr = [];
    titleArr = [...findCourse.title];
    arr = [...findCourse.video];
    videoName = [...findCourse.videoName];

    let deletedVideo = arr.splice(idx, 1);
    let deletedTitle = titleArr.splice(idx, 1);
    let deletedVideoName = videoName.splice(idx, 1);

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { title: titleArr, video: arr, videoName: videoName },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({
        responseStatus: 404,
        message: "Course Not Found or Some Error Occurred",
      });
    }

    return res.status(200).json(updatedCourse);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      responseStatus: 500,
      message: "Internal Server Error",
    });
  }
};

const updateCourse = async (req, res) => {
  try {
    const template = req.file.filename;
    const courseId = req.params.id;
    const title = req.body.title;
    const titleArr = title.split(",");
    const privacy = req.body.privacy;
    const findingCourse = await Course.findById(courseId);

    const lenOldTitle = findingCourse.title.length;
    const lenNewTitle = titleArr.length;

    if (lenOldTitle !== lenNewTitle) {
      return res.status(404).json({
        responseStatus: 404,
        message: "invlaid arr size",
      });
    }
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { template: template, title: titleArr, privacy },
      { new: true }
    );
    if (!updatedCourse) {
      return res.status(404).json({
        responseStatus: 404,
        message: "Internal Server Error",
      });
    }

    return res.status(200).json({
      message:
        "Successfully updated the course and added the template of the course",
    });
  } catch (err) {
    return res.status(500).json({
      responseStatus: 500,
      message: "Internal Server Error",
    });
  }
};

const getVideoByTags = async (req, res) => {
  try {
    const tags = req.query.tags.split(",");

    console.log(tags);

    const videosResult = await Course.find({ tags: { $in: tags } }).limit(5);

    return res.status(200).json(videosResult);
  } catch (err) {
    return res.status(500).json({
      responseStatus: 500,
      message: "Internal Server Error",
    });
  }
};

const searchVideoUsingRegEx = async (req, res) => {
  try {
    const query = req.query.q;

    const findCourse = await Course.find({
      courseName: { $regex: query, $options: "i" },
    }).limit(5);

    return res.status(200).json(findCourse);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      responseStatus: 500,
      message: "Internal Server Error",
    });
  }
};

const getRecommendedCourse = async (req, res) => {
  try {
    const sharingRandomCourse = await Course.find().limit(5);

    return res.status(200).json(sharingRandomCourse);
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getWithoutVideos = async (req, res) => {
  try {
    const courseId = req.params.id;
    const user = req.user.id;

    // if video purchased response will be with videos or author then videos else no video

    // find course with id

    const coursing = await Course.findOne({
      _id: courseId,
    }).populate("author");
    console.log("not suii", coursing);
    if (coursing === null) {
      return res.status(404).json();
    }
    if (coursing.author === user) {
      return res.status(200).json(coursing);
    }
    // customer, coursesPurchased
    const isPurchased = await Purchased.findOne({
      customer: user,
      coursesPurchased: { $in: courseId },
    });

    if (isPurchased) {
      return res.status(200).json(coursing);
    }

    const {
      _id,
      rating,
      courseName,
      price,
      tags,
      title,
      privacy,
      author,
      video,
      videoName,
    } = coursing;

    const rest = {
      _id,
      rating,
      courseName,
      price,
      tags,
      author,
      privacy,
      title,
    };
    console.log(isPurchased);
    return res.status(200).json((purchased = { rest, isPurchased }));
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const sendingVideoIndex = async (req, res) => {
  try {
    const courseId = req.params.id;
    const videoIndex = req.params.videoIndex;

    // searching the course
    const course = await Course.findOne({
      _id: courseId,
    });

    if (!course) {
      return res.status(404).json({
        message: "Course Not Found",
      });
    }
    if (course.videoName[videoIndex] === undefined) {
      return res.status(404).json({
        message: "Video Not Found",
      });
    }

    const videoObj = {
      videoName: course.videoName[videoIndex],
      video: course.video[videoIndex],
      title: course.title[videoIndex],
    };
    return res.status(200).json(videoObj);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  uploadVideo,
  removeAllCourses,
  removeSpecificCourse,
  getSpeficCourse,
  getAllCourses,
  deleteSpecificVideo,
  updateCourse,
  getVideoByTags,
  searchVideoUsingRegEx,
  getRecommendedCourse,
  getWithoutVideos,
  sendingVideoIndex,
};
