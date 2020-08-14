"use strict";

const express = require("express");
const fccTesting = require("./freeCodeCamp/fcctesting.js");
const session = require("express-session");
const passport = require("passport");
const app = express();

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

fccTesting(app); //For FCC testing purposes
app.use("/public", express.static(process.cwd() + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.route("/").get((req, res) => {
  //Change the response to render the Pug template
  res.render('pug/index', {title: 'Hello', message: 'Please login'} )
  // res.send(`Pug template is not defined.`);
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port " + process.env.PORT);
});
