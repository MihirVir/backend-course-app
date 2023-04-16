const Purchased = require("../models/purchased");
const Review = require("../models/review");
const Course = require("../models/course");
const Test = require("../models/test");
const mongoose = require("mongoose");
const getYearDataPurchase = async (req, res) => {
  try {
    const userId = req.user.id;
    // console.log("user id = ", userId);
    const findAllCourses = await Test.find({ author: userId });

    if (!findAllCourses) {
      return res.status(404).json({
        message: "Couldn't find any courses",
      });
    }
    let arr = [];
    findAllCourses.forEach((item) => {
      arr.push(item.id);
    });

    const coursesPurchasedByOthers = await Purchased.find({
      coursesPurchased: { $in: arr },
    });
    let yearCount = 0;
    let monthCount = 0;
    let janCount = 0;
    let febCount = 0;
    let marchCount = 0;
    let aprilCount = 0;
    let mayCount = 0;
    let juneCount = 0;
    let julyCount = 0;
    let augustCount = 0;
    let septCount = 0;
    let octCount = 0;
    let novCount = 0;
    let decCount = 0;
    coursesPurchasedByOthers.forEach((course) => {
      const current = new Date();
      const currentYear = current.getYear();
      const currentMonth = current.getMonth();

      // getting course details
      const purchaseDetails = course.createdAt.getYear();
      const purchaseMonth = course.createdAt.getMonth();
      // console.log(purchaseDetails);

      if (currentYear - purchaseDetails === 0) {
        // counting
        yearCount++;
      }
      if (currentMonth - purchaseMonth <= 6) {
        monthCount++;
      }
      // setting monthly count for details ig
      // console.log(course.createdAt.getMonth());
      if (
        currentYear - purchaseDetails === 0 &&
        course.createdAt.getMonth() === 0
      ) {
        janCount++;
      }
      if (
        currentYear - purchaseDetails === 0 &&
        course.createdAt.getMonth() === 1
      ) {
        febCount++;
      }
      if (
        currentYear - purchaseDetails === 0 &&
        course.createdAt.getMonth() === 2
      ) {
        marchCount++;
      }
      if (
        currentYear - purchaseDetails === 0 &&
        course.createdAt.getMonth() === 3
      ) {
        aprilCount++;
      }
      if (
        currentYear - purchaseDetails === 0 &&
        course.createdAt.getMonth() === 4
      ) {
        mayCount++;
      }
      if (
        currentYear - purchaseDetails === 0 &&
        course.createdAt.getMonth() === 5
      ) {
        juneCount++;
      }
      if (
        currentYear - purchaseDetails === 0 &&
        course.createdAt.getMonth() === 6
      ) {
        julyCount++;
      }
    });
    return res
      .status(200)
      .json([
        janCount,
        febCount,
        marchCount,
        aprilCount,
        mayCount,
        juneCount,
        julyCount,
        augustCount,
        septCount,
        octCount,
        novCount,
        decCount,
      ]);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// get total number of courses and purchase
const getNumberOfCourses = async (req, res) => {
  try {
    const user = req.user.id;
    const findCoursesBelongToUser = await Test.find({ author: user });
    const findTotalNumberOfCoursesSold = await Purchased.find({
      author: user,
    }).populate("coursesPurchased");
    // money earned by selling courses logic
    if (!findCoursesBelongToUser) {
      return res.status(200).json([]);
    }
    let totalPrice = 0;
    console.log(findTotalNumberOfCoursesSold);
    if (findTotalNumberOfCoursesSold.length === 0) {
      totalPrice = findTotalNumberOfCoursesSold.coursesPurchased.price;
    } else {
      findTotalNumberOfCoursesSold.forEach((course) => {
        totalPrice = parseInt(totalPrice + course.coursesPurchased.price);
      });
    }
    console.log(totalPrice);
    return res.status(200).json({
      course: findCoursesBelongToUser,
      sold: findTotalNumberOfCoursesSold,
      money: totalPrice,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error :(",
    });
  }
};
// get piechart details
const getPieData = async (req, res) => {
  try {
    const userId = req.user.id;

    // get top Four selling courses
    const getTopSellings = await Purchased.aggregate([
      {
        $match: { author: mongoose.Types.ObjectId(userId) },
      },
      {
        $group: {
          _id: "$coursesPurchased",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 3,
      },
    ]);
    const courseIds = getTopSellings.map((course) => course._id);
    const populatedCourses = await Purchased.find({
      coursesPurchased: { $in: courseIds },
    })
      .populate("coursesPurchased")
      .lean();

    const sortedCourses = getTopSellings.map((course) => {
      const populatedCourse = populatedCourses.find(
        (populatedCourse) =>
          String(populatedCourse.coursesPurchased._id) === String(course._id)
      );
      return {
        course: populatedCourse.coursesPurchased,
        count: course.count,
      };
    });
    //TODO LATER:  return total avg reviews and returned courses
    // 6432c544a6e23feaf3d3ee46
    console.log(req.user.id);
    const getAllRatings = await Review.find({
      author: req.user.id,
    });
    let count = 0;
    let avgRating = 0;
    getAllRatings.map((item) => {
      count += item.rating;
    });
    getAllRatings.length > 0
      ? (avgRating = count / getAllRatings.length)
      : (avgRating = 0);
    return res
      .status(200)
      .json({ sortedCourses: sortedCourses, rating: avgRating.toFixed(1) });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getTotalNumberOfStudents = async (req, res) => {
  const perPage = 10;
  const page = req.params.page || 1;
  try {
    const user = req.user.id;
    // finding users who purchased the course
    const findUsers = await Purchased.find({
      author: user,
    })
      .populate({ path: "customer", select: "username email" })
      .populate({ path: "coursesPurchased", select: "courseName" })
      .skip(perPage * page - perPage)
      .limit(perPage);

    const count = await Purchased.countDocuments({
      author: user,
    });
    return res.status(200).json({
      users: findUsers,
      currentPage: page,
      pages: Math.ceil(count / perPage),
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error ",
    });
  }
};

module.exports = {
  getYearDataPurchase,
  getNumberOfCourses,
  getPieData,
  getTotalNumberOfStudents,
};
