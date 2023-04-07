const Purchased = require("../models/purchased");
const Test = require("../models/test");
const createPurchased = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user.id;

    const findUserPurchasedTheProduct = await Purchased.find({
      customer: userId,
    });
    if (findUserPurchasedTheProduct.coursesPurchased === courseId) {
      return res.status(404).json({
        responseStatus: 404,
        message: "Course Already Purchased",
      });
    }
    // find course
    const findingCourse = await Test.findById(courseId);
    if (!findingCourse) {
      return res.status(404).json({
        message: "No Course Available",
      });
    }
    const creatingPurchase = new Purchased({
      customer: userId,
      coursesPurchased: courseId,
      author: findingCourse.author,
    });

    const savedUserPurchase = await creatingPurchase.save();

    return res.status(201).json({
      savedUserPurchase,
      message: "Successfully created the purchase",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      responseStatus: 500,
      message: "Internal Server Error",
    });
  }
};

const gettingPurchasedProducts = async (req, res) => {
  try {
    const purchaseId = req.params.id;
    const idx = req.body.index;

    const gettingPurchases = await Purchased.findById(purchaseId).populate(
      "coursesPurchased"
    );

    return res.status(200).json(gettingPurchases);

    // TODO Later
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      responseStatus: 500,
      message: "Internal Server Error",
    });
  }
};

const returnPurchasedProduct = async (req, res) => {
  try {
    // get course id
    const purchaseId = req.params.courseId;
    // get user id
    const userId = req.user.id;
    // then find that if the course id is available in the user id purchased thing
    const findUserPurchase = await Purchased.find({ customer: userId });
    // if its available then check if the user has bought the product less than 10 days
    // console.log(findUserPurchase);
    findUserPurchase.forEach((item) => {
      const current = new Date();
      const purchasedYear = item.createdAt.getYear();
      const purchasedMonth = item.createdAt.getMonth();
      const purchasedDate = item.createdAt.getDate();
      const currentDate = current.getDate();
      const currentYear = current.getYear();
      const currentMonth = current.getMonth();

      if (
        currentYear - purchasedYear !== 0 ||
        currentMonth - purchasedMonth !== 0
      ) {
        console.log(currentYear - purchasedYear);
        console.log(currentMonth - purchasedMonth);
        return res.status(404).json({
          responseStatus: 404,
          message: "Invalid Action",
        });
      }
      if (currentDate - purchasedDate > 10 || currentDate - purchasedDate < 0) {
        return res.status(404).json({
          responseStatus: 404,
          message: "Something went wrong",
        });
      }

      // console.log(totalDate);
    });
    const deletePurchase = await Purchased.findByIdAndDelete(purchaseId);

    return res.status(200).json({
      deletePurchase,
      message: "Successfully deleted the purchase",
    });
    // if yes then return else buy
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      responseStatus: 500,
      message: "Internal Server Error",
    });
  }
};

const deleteAllRecords = async (req, res) => {
  try {
    await Purchased.deleteMany();
    return res.status(200).json({
      message: "Successfully deleted all the records",
    });
  } catch (err) {
    return res.status(500).json({
      responseStatus: 500,
      message: "Internal Server Error",
    });
  }
};
const getAllPurchase = async (req, res) => {
  try {
    const purch = await Purchased.find();
    return res.status(200).json(purch);
  } catch (err) {}
};
module.exports = {
  createPurchased,
  gettingPurchasedProducts,
  deleteAllRecords,
  returnPurchasedProduct,
  getAllPurchase,
};
