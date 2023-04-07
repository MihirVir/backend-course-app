const Purchased = require("../models/purchased");
const Review = require("../models/review");
const Course = require("../models/course");
const Test = require("../models/test");
const getYearDataPurchase = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("user id = ", userId);
    const findAllCourses = await Course.find({ author: userId });

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
    coursesPurchasedByOthers.forEach((course) => {
      const current = new Date();
      const currentYear = current.getYear();
      const currentMonth = current.getMonth();

      console.log(currentYear);
      // getting course details
      const purchaseDetails = course.createdAt.getYear();
      const purchaseMonth = course.createdAt.getMonth();
      console.log(purchaseDetails);

      if (currentYear - purchaseDetails === 0) {
        // counting
        yearCount++;
      }
      if (currentMonth - purchaseMonth <= 6) {
        monthCount++;
      }
      // setting monthly count for details ig
      console.log(course.createdAt.getMonth());
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
      return res.status(200).json({
        yearCount,
        monthCount,
        janCount,
        febCount,
        marchCount,
        aprilCount,
        mayCount,
        juneCount,
        julyCount,
      });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// get total number of courses
const getNumberOfCourses = async (req, res) => {
  try {
    const user = req.user.id;
    const findCoursesBelongToUser = await Test.find({ author: user });
    const findTotalNumberOfCoursesSold = await Purchased.find({ author: user });
    if (!findCoursesBelongToUser) {
      return res.status(200).json([]);
    }
    return res
      .status(200)
      .json({
        course: findCoursesBelongToUser,
        sold: findTotalNumberOfCoursesSold,
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error :(",
    });
  }
};

module.exports = {
  getYearDataPurchase,
  getNumberOfCourses,
};
