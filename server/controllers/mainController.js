exports.homepage = async (req, res) => {
  const locals = {
    title: "Node app",
    description: "A simple note app",
  };
  res.render("index", locals);
};

exports.about = async (req, res) => {
  const locals = {
    title: "About page",
    description: "A simple note app",
  };
  res.render("about", locals);
};
