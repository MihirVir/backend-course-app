const mongoose = require('mongoose');

const PurchasedSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    coursesPurchased: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test"
    }
}, {
    timestamps: true
})

module.exports = new mongoose.model('Purchased', PurchasedSchema);