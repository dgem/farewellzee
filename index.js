const express = require('express');
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
console.log("qwe3", process.env.STRIPE_KEY)
const stripe = require("stripe")(process.env.STRIPE_KEY);

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.post("/charge", (req, res) => {
  let amount = 500;
  console.log("req.body", JSON.stringify(req.body))
  stripe.customers.create({
      email: req.body.email,
      card: req.body.id
    })
    .then(customer => {
      console.log("customer", JSON.stringify(customer))
      stripe.charges.create({
        amount,
        description: "Donation to Zee's leaving present",
        currency: "gbp",
        customer: customer.id,
        metadata: req.body.metadata
      }, {
        stripe_account: "acct_1BsLGlJgyyq4pBQv",
      })
    })
    .then(charge => {
      console.log("charge", JSON.stringify(charge))
      res.send(charge)
    })
    .catch(err => {
      console.log("Error:", err);
      res.status(500).send({
        error: "Purchase Failed"
      });
    });
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))
