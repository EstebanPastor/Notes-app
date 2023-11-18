const express = require("express");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");

require("dotenv").config();

const expressLayouts = require("express-ejs-layouts");

const connectDB = require("./server/config/db");

const app = express();
const port = process.env.PORT || 3000;

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
    }),
    cookie: { maxAge: new Date(Date.now() + 604800000) },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connectDB();

// Static files
app.use(express.static("public"));

// Template engine
app.use(expressLayouts);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use("/", require("./server/routes/index"));
app.use("/", require("./server/routes/auth"));
app.use("/", require("./server/routes/dashboard"));

// Handle 404
app.get("*", function (req, res) {
  res.status(404).render("404");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
