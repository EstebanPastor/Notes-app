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

exports.dashboardViewNote = async (req, res) => {
  const note = await Note.findById({ _id: req.params.id })
    .where({ user: req.user.id })
    .lean();

  if (note) {
    res.render("dashboard/view-note.ejs", {
      noteID: req.params.id,
      note,
      layout: "../views/layouts/dashboard",
    });
  } else {
    res.send("Something went wrong");
  }
};

exports.dashboardUpdateNote = async (req, res) => {
  try {
    const updateNote = await Note.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      { title: req.body.title, body: req.body.body }
    ).where({ user: req.user.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

exports.dashboardDeleteNote = async (req, res) => {
  try {
    const deleteNote = await Note.deleteOne({
      _id: req.params.id,
    }).where({ user: req.user.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

exports.dashboardAddNote = async (req, res) => {
  res.render("dashboard/add", {
    layout: "../views/layouts/dashboard",
  });
};

exports.dashboardAddNoteSubmit = async (req, res) => {
  try {
    req.body.user = req.user.id;
    const note = await Note.create(req.body);
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

exports.dashboardSearch = async (req, res) => {
  try {
    res.render("dashboard/search", {
      searchResults: "",
      layout: "../views/layouts/dashboard",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.dashboardSearchSubmit = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    const searchResults = await Note.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChars, "i") } },
        { body: { $regex: new RegExp(searchNoSpecialChars, "i") } },
      ],
    }).where({ user: req.user.id });

    res.render("dashboard/search", {
      searchResults,
      layout: "../views/layouts/dashboard",
    });
  } catch (error) {
    console.log(error);
  }
};