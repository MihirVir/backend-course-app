const Test = require("../models/test");
const Purchased = require("../models/purchased");

const createNewPurchase = async (req, res) => {
  try {
    const user = req.user.id;
    const courseId = req.params.id;
    const coup = req.body.coupon;
    // finding the course
    const course = await Test.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course Not Found" });
    if (coup !== course.coupon) {
      return res.status(400).json({ message: "Invalid coupon" });
    }
    // finding if alr purchased
    const purchasedAlr = await Purchased.findOne({
      coursesPurchased: courseId,
      customer: user.id,
    });
    if (purchasedAlr) {
      return res.status(400).json({ message: "already purchased the course" });
    }
    const newPurchase = new Purchased({
      customer: user,
      author: course.author,
      coursesPurchased: courseId,
    });
    await newPurchase.save();
    return res.status(201).json({ message: "course purchased" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const listOfCoursesPurchased = async (req, res) => {
  try {
    const user = req.user.id;
    // finding purchases
    const courses = await Purchased.find({ customer: user }).populate(
      "coursesPurchased"
    );
    return res.status(200).json({ course: courses });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const deleteAllPurchase = async (req, res) => {
  try {
    await Purchased.deleteMany();
    return res.status(200).json({ message: "delete all purchase" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  createNewPurchase,
  listOfCoursesPurchased,
  deleteAllPurchase,
};
