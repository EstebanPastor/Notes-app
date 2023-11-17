exports.homepage = async (req, res) => {
  const locals = {
    title: "Node app",
    description: "A simple note app",
  };
  res.render("index", {
    locals,
    layout: "../views/layouts/front-page.ejs"
  });
};

exports.about = async (req, res) => {
  const locals = {
    title: "About page",
    description: "A simple note app",
  };
  res.render("about", locals);
};
