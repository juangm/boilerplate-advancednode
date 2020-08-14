"use strict";

const express = require("express");
const fccTesting = require("./freeCodeCamp/fcctesting.js");
const session = require("express-session");
const passport = require("passport");
const app = express();
const ObjectID = require("mongodb").ObjectID;
const mongo = require("mongodb").MongoClient;

// Set PUG
app.set('view engine', 'pug');

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'randomString',
  resave: true,
  saveUninitialized: true,
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Connect to Mongo
mongo.connect(process.env.MONGO_URI, (err, db) => {
  if (err) {
    console.log("Database error: " + err);
  } else {
    console.log("Successful database connection");
    passport.serializeUser((user, done) => {
      done(null, user._id);
    });
    passport.deserializeUser((id, done) => {
      db.collection("users").findOne({ _id: new ObjectID(id) }, (err, doc) => {
        done(null, doc);
      });
    });
    app.listen(process.env.PORT || 3000, () => {
      console.log("Listening on port " + process.env.PORT);
    });
  }
});

fccTesting(app); //For FCC testing purposes
app.use("/public", express.static(process.cwd() + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.route("/").get((req, res) => {
  //Change the response to render the Pug template
  res.render('pug/index', {title: 'Hello', message: 'Please login'} )
  // res.send(`Pug template is not defined.`);
});
