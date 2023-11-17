exports.dashboard = async (req, res) => {
    const locals = {
      title: "Dashboard",
      description: "Dashboard page",
    };
    res.render("dashboard/index", {
      locals,
      layout: "../views/layouts/dashboard.ejs"
    });
  };
  
