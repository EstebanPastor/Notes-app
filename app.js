const express = require("express");

require("dotenv").config();

const expressLayouts = require("express-ejs-layouts");

const port = process.env.PORT || 3000;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files
app.use(express.static("public"));

// Template engine
app.use(expressLayouts);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use("/", require("./server/routes/index"));
app.use("/", require("./server/routes/dashboard"));


// Handle 404
app.get("*", function(req, res) {
  res.status(404).render("404")
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
