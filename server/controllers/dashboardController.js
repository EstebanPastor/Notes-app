const mongoose = require("mongoose");
const Note = require("../models/Notes");

exports.dashboard = async (req, res, next) => {
  const perPage = 8;
  const page = req.query.page || 1;

  const locals = {
    title: "Dashboard",
    description: "Dashboard page",
  };

  try {
    const notes = await Note.aggregate([
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $match: { user: new mongoose.Types.ObjectId(req.user.id) },
      },
      {
        $project: {
          title: { $substr: ["$title", 0, 30] },
          body: { $substr: ["$body", 0, 100] },
        },
      },
    ])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Note.countDocuments().exec();

    res.render("dashboard/index", {
      userName: req.user.firstName,
      locals,
      notes,
      layout: "../views/layouts/dashboard.ejs",
      current: page,
      pages: Math.ceil(count / perPage),
    });
  } catch (error) {
    console.log(error);
    next(error); 
  }
};
