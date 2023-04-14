const Review = require("../models/review");
const Purchased = require("../models/purchased");
const createReview = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.id;

    // finding if the user had already reviewed the course and if even bought that course

    const findingReview = Review.findOne({ reviewUser: userId });
    // if (findingReview) {
    //   return res.status(400).json({
    //     message: "Already reviewed the course can't do it again",
    //   });
    // }

    const findingPurchased = await Purchased.findOne({
      customer: req.user.id,
      coursesPurchased: courseId,
    });
    if (!findingPurchased) {
      return res.status(400).json({
        message: "Please purchase the course to review it",
      });
    }
    console.log(findingPurchased);
    const newReview = new Review({
      reviewUser: userId,
      courseReview: courseId,
      author: findingPurchased.author,
      rating: req.body.rating,
    });
    console.log(newReview);

    await newReview.save();
    return res.status(201).json(newReview);
  } catch (err) {
    return res.status(500).json({
      responseStatus: 500,
      message: "Internal Server Error",
    });
  }
};

const updateReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user.id;
    const changeRating = req.body.rating;
    const findingReview = await Review.findById(reviewId);

    if (userId !== findingReview.reviewUser) {
      // return unauthorized access to edit the review
      return res.status(404).json({
        responseStatus: 404,
        message: "Unauthorised access to edit the review",
      });
    }

    const updatingReview = await Review.findByIdAndUpdate(
      reviewId,
      { rating: changeRating },
      { new: true }
    );

    return res.status(200).json({
      updatingReview,
      message: "Successfully updated the review",
    });
  } catch (err) {
    return res.status(500).json({
      responseStatus: 500,
      message: "Internal Server Error",
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;

    const deletingReview = await Review.findByIdAndDelete(reviewId);

    if (!deletingReview) {
      return res.status(404).json({
        responseStatus: 404,
        message: "Review doesn't exist",
      });
    }

    return res.status(200).json({
      message: "Successfully deleted the view",
    });
  } catch (err) {
    return res.status(500).json({
      responseStatus: 500,
      message: "Internal Server Error",
    });
  }
};

const getReviews = async (req, res) => {
  try {
    const getAllReviews = await Review.find();

    return res.status(200).json(getAllReviews);
  } catch (err) {
    return res.status(500).json({
      responseStatus: 500,
      message: "Internal Server Error",
    });
  }
};

const getReview = async (req, res) => {
  try {
    const reviewId = req.params.id;

    const getSpecificReview = await Review.findById(reviewId);

    return res.status(200).json(getSpecificReview);
  } catch (err) {
    return res.status(500).json({
      responseStatus: 500,
      message: "Internal Server Error",
    });
  }
};

const getReviewAvgByCourseId = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const findingReviews = await Review.find({
      courseReview: courseId,
    });

    const countReviews = findingReviews.length;

    let totalRatings = 0;
    // using forEach to loop
    findingReviews.forEach((item) => {
      totalRatings = totalRatings + item.rating;
    });
    const avgRating = (totalRatings / countReviews).toFixed(1);
    // saving avg in course controller

    return res.status(200).json({ average: avgRating });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      responseStatus: 500,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createReview,
  updateReview,
  deleteReview,
  getReviews,
  getReview,
  getReviewAvgByCourseId,
};
