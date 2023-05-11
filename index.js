// imports
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
// route imports
const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/course");
const purchaseRoutes = require("./routes/purchase");
const adminRoutes = require("./routes/admin");
const reviewRoutes = require("./routes/review");
const couponRoutes = require("./routes/coupon");
const cartRoutes = require("./routes/cart");
const testRoutes = require("./routes/test");
const videoRoutes = require("./routes/video.js");
const newerRoutes = require("./routes/newer");
const paymentRoutes = require("./routes/payment");
require("dotenv").config();

// middlewares
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://mihir-major-project-course.netlify.app",
      "https://mihir-course-app.vercel.app",
    ],
    credentials: true,
  })
);
// static files
app.use(express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "templates")));
app.use("/templates", express.static("templates"));
app.use("/uploads", express.static("uploads"));
// setting up routes
app.use("/auth", authRoutes);
app.use("/course", courseRoutes);
app.use("/purchase", purchaseRoutes);
app.use("/admin", adminRoutes);
app.use("/review", reviewRoutes);
app.use("/coupon", couponRoutes);
app.use("/cart", cartRoutes);
app.use("/test", testRoutes);
app.use("/payment", paymentRoutes);
app.use("/video", videoRoutes);
app.use("/newer", newerRoutes);
// database config
const PORT = process.env.PORT || 9000;
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL, {}, () => {
  console.log("Yo we are connected to the database");
});

// starting the server
app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
