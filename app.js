import express from "express";

import expressLayouts from "express-ejs-layouts";
import dotenv from "dotenv";

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files
app.use(express.static("public"));

// Template engine
app.use(expressLayouts);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("index");
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})