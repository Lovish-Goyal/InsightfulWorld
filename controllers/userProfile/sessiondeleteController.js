const sessiondeleteController = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    } else {
      console.log("Session destroyed successfully");
    }
  });
  res.redirect("/");
};

export default sessiondeleteController;
