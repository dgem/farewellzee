const express = require('express');
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
var MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const app = express();
const stripePrivateKey = process.env.STRIPE_KEY
const stripePublicKey = process.env.STRIPE_PUB
const mongoURI = process.env.MONGODB_URI

if (!stripePrivateKey) {
  console.log("STRIPE_KEY not set")
}
if (!stripePublicKey) {
  console.log("STRIPE_PUB not set")
}
if (!mongoURI) {
  console.log("MONGODB_URI not set")
}

const stripe = require("stripe")(stripePrivateKey);


const db = MongoClient.connect(mongoURI)
  .then(function(db) {
    console.log("Connected to mongodb")
    return db;
  })
  .catch(function(err) {
    console.log("Unable to connection to mongodb")
  }
);

app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(bodyParser.json());

app.use(express.static('public'));



app.get('/key', (req, res) => {
  res.send(stripePublicKey)
})

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



app.listen(process.env.PORT, () => console.log('Farewell Zee listening on', process.env.PORT))

process.on('SIGTERM', () => {
    db.close().then(() => {
      process.exit(0)
  });
});
