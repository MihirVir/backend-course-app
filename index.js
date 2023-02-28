// imports
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path')
const cors = require('cors');
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/course');
const purchaseRoutes = require('./routes/purchase');
const adminRoutes = require('./routes/admin');
const reviewRoutes = require('./routes/review');
const couponRoutes = require('./routes/coupon');
const cartRoutes = require('./routes/cart');

require('dotenv').config();

// middlewares
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
let allowList = ["http://localhost:3000/", "https://www.mihir-major-project.netlify.app/", "https://www.mihir-major-project-course.netlify.app/"];
var corsOption = {
    origin: function(origin, cb) {
        var originIsWhitelisted = allowList.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    },
}

app.use(cors({corsOption, credentials: true, methods: "GET, POST, PUT, PATCH, DELETE"}));
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'uploads')))
app.use(express.static(path.join(__dirname, 'templates')))

// setting up routes
app.use('/auth', authRoutes);
app.use('/course', courseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/admin', adminRoutes);
app.use('/review', reviewRoutes);
app.use('/coupon', couponRoutes);
app.use('/cart', cartRoutes);

// database config
const PORT = process.env.PORT || 9000;
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL, {}, () => {
    console.log('Yo we are connected to the database')
})

// starting the server
app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
})