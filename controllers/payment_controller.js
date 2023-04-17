const paypal = require("paypal-rest-sdk");
const Test = require("../models/test");
paypal.configure({
  mode: "sandbox", // testing mode
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

const paymentAction = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = req.user.id;
    const course = await Test.findById(productId);
    const payment = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/failure",
      },
      transactions: [
        {
          amount: {
            total: course.price,
            currency: "USD",
          },
          description: course.courseName,
        },
      ],
    };
    paypal.payment.create(payment, (error, payment) => {
      if (error) {
        console.log(error);
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === "approval_url") {
            res.redirect(payment.links[i].href);
          }
        }
      }
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "internal server error or payment failed" });
  }
};

module.exports = {
  paymentAction,
};
