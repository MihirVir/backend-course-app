const Cart = require('../models/cart');
const Course = require('../models/course');
const Coupon = require('../models/coupon')
const createNewCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const courseId = req.params.id;
        const discountCoupon = req.body.discountCoupon;

        // findingCourse 
        const courseAdded = await Course.findOne({
            _id: courseId
        });
        // finding if cart already exists
        const findExistingCart = await Cart.findOne({
            userId: userId
        })
        
        if (findExistingCart) {
            return res
                    .status(200)
                    .json(findExistingCart)
        }
        const findDiscountCoupon = await Coupon.findOne({code: discountCoupon});
        if (findDiscountCoupon.courseId != courseId) {
            return res
                    .status(400)
                    .json({
                        message: "Invalid Discount Coupon"
                    });
        }
        let initPrice = courseAdded.price;
        let discPerc = findDiscountCoupon.discountPercent;
        console.log(initPrice, discPerc);

        const priceAfterDiscount = initPrice - (initPrice * discPerc / 100);
        console.log(priceAfterDiscount);

        const addNewCart = new Cart({
            userId: userId,
            courseId: courseId,
            totalPrice: initPrice,
            priceAfterDiscount: priceAfterDiscount
        })

        const savingCart = await addNewCart.save();
        return res
                .status(201)
                .json(savingCart);
    } catch (err) {
        console.log(err);
        return res
                .status(500)
                .json({
                    message: "Internal Server Error"
                })
    }
}

const clearCart = async (req, res) => {
    try {
        //TODO Later
        const cartId = req.params.id;

        const userId = req.user.id;

        // finding cart exists or not
        const isCart = await Cart.findOne({
            cartId: id
        })

        if (!isCart) {
            return res
                    .status(404)
                    .send({
                        message: "cart not found"
                    })
        }

        if (isCart.userId !== userId) {
            return res
                    .status(401)
                    .send({
                        message: "Unauthorized access"
                    });
        }

        await Cart.findByIdAndDelete({
            cartId: id
        })
        console.log(cartId);
        return res
                .status(200)
                .send({
                    message: "Cart deleted successfully"
                })
    } catch (err) {
        return res
                .status(500)
                .json({
                    message: "Internal Server Error"
                })
    }
}
module.exports = {
    createNewCart,
    clearCart
}