const express = require('express');
const router = express.Router();
const {createPurchased, gettingPurchasedProducts, deleteAllRecords, returnPurchasedProduct, getAllPurchase} = require('../controllers/purchased_controller');
const {verifyUser} = require('../middlewares/verifyToken');
// POST routes
router.post('/:courseId', verifyUser, createPurchased);

// get purchases
router.get('/:id', gettingPurchasedProducts);
router.get('/', getAllPurchase);
// delete all purchase
router.delete('/', deleteAllRecords);

// update
router.patch('/:courseId', verifyUser,returnPurchasedProduct);
module.exports = router;