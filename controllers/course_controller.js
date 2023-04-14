const Video = require("../models/video");
const Test = require("../models/test");
const Purchased = require("../models/purchased");
const createVideo = async (req, res) => {
  try {
    const courseId = req.params.id;
    // search if course exists
    const isCourse = await Test.findById({ _id: courseId });

    if (!isCourse) {
      return res.status(404).json({
        message: "Course Not Found!!",
      });
    }

    let nameArr = [];
    let pathArr = [];
    console.log(req.files);
    req.files.forEach((item) => {
      nameArr.push(item.filename);
      pathArr.push(item.path);
    });

    if (nameArr.length != isCourse.title.length) {
      return res.status(403).json({
        message: "The length of title and videos don't match",
      });
    }

    const createVideos = new Video({
      courseId: courseId,
      videoName: nameArr,
      videoPath: pathArr,
    });

    await createVideos.save();

    return res.status(201).json(createVideos);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    return res.status(200).json(videos);
  } catch (err) {
    console.log(err);
  }
};

const deleteVideo = async (req, res) => {
  try {
    const courseId = req.params.id;
    const isCourse = await Test.findById({ _id: courseId });
    if (req.user.id != isCourse.author) {
      return res.status(400).json({
        message: "You are not the owner of the course",
      });
    }
    const videoIndex = req.body.idx;
    const videos = await Video.findOne({
      courseId,
    });
    console.log(videos);
    let len = videos.videoName.length;
    if (videoIndex > len) {
      return res.status(404).json({
        message: "Video Index Not Found",
      });
    }
    let titleArr = [...isCourse.title];
    let videoNameArr = [...videos.videoName];
    let videoPathArr = [...videos.videoPath];
    videoPathArr.splice(videoIndex, 1);
    videoNameArr.splice(videoIndex, 1);
    titleArr.splice(videoIndex, 1);
    // TODO Later
    const courseUpdated = await Test.findByIdAndUpdate(
      courseId,
      {
        title: titleArr,
      },
      {
        new: true,
      }
    );

    const videosUpdated = await Video.findOneAndUpdate(
      courseId,
      { videoName: videoNameArr, videoPath: videoPathArr },
      { new: true }
    );

    return res.status(200).json(
      (updation = {
        courseUpdated,
        videosUpdated,
      })
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getSpecificCourseVideo = async (req, res) => {
  try {
    const courseId = req.params.id;
    const isCourse = await Test.findById(courseId);
    if (!isCourse) {
      return res.status(404).json({
        message: "Course Not Found",
      });
    }

    // finding videos
    const videos = await Video.findOne({ courseId: courseId });

    return res.status(200).json(videos);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getSpecficVideoUsingIndex = async (req, res) => {
  try {
    const courseId = req.params.id;
    const videoIndex = req.params.idx;

    const isCourse = await Test.findById(courseId);
    if (!isCourse) {
      return res.status(404).json({
        message: "Course Not Found",
      });
    }
    const isPurchased = await Purchased.findOne({
      coursesPurchased: courseId,
      customer: req.user.id,
    });
    console.log(isPurchased);

    if (!isPurchased && isCourse.author != req.user.id) {
      return res.status(400).json({
        message: "Unauthorized access",
      });
    }
    const getVideos = await Video.findOne({ courseId: courseId });

    if (videoIndex > getVideos.videoName.length) {
      return res.status(404).json({
        message: "Invalid Video Index",
      });
    }
    const titleArr = isCourse.title;
    const courseName = isCourse.courseName;
    const videoLen = isCourse.title.length;
    const name = getVideos.videoName[videoIndex];
    const title = isCourse.title[videoIndex];
    const path = getVideos.videoPath[videoIndex];
    console.log(getVideos);

    return res.status(200).json(
      (videoObj = {
        len: videoLen,
        name: name,
        title: title,
        path: path,
        titleArr,
        courseName,
      })
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
const updateVideoTitle = async (req, res) => {
  const idx = parseInt(req.body.idx);
  const newTitle = req.body.title;
  const user = req.user.id;
  try {
    const courseId = req.params.id;
    // finding course
    const findingCourse = await Test.findById({ _id: courseId, author: user });
    const updatingCourse = await Test.findByIdAndUpdate(
      courseId,
      {
        $set: { [`title.${idx}`]: newTitle },
      },
      {
        new: true,
      }
    );
    console.log((findingCourse[idx] = newTitle));
    return res.status(200).json(updatingCourse);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
const updateVideoAtIndex = async (req, res) => {
  const video = req.file.filename;
  console.log(video);
  const idx = req.body.idx;
  const courseId = req.params.id;
  console.log("id", courseId);
  try {
    // finding course
    const findingCourse = await Video.findOne({
      course: courseId,
    }).populate("courseId");
    // if (findingCourse.courseId.author != req.user.id) {
    //   return res.status(400).json({ message: "Error" });
    // }
    const updatingVideos = await Video.findOneAndUpdate(
      { courseId: courseId },
      {
        $set: {
          [`videoName.${idx}`]: video,
          [`videoPath.${idx}`]: req.file.path,
        },
      },
      { new: true }
    );

    // console.log("video: ", updatingVideos);
    return res.status(200).json(updatingVideos);
  } catch (err) {
    console.log("error", err);
    return res.status(500).send({
      message: "internal server error",
    });
  }
};
module.exports = {
  createVideo,
  getAllVideos,
  deleteVideo,
  getSpecificCourseVideo,
  getSpecficVideoUsingIndex,
  updateVideoTitle,
  updateVideoAtIndex,
};
