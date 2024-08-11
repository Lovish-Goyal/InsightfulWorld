import ThoughtModel from "../../model/thoughtModel.js";
const saveThoughtController = (req, res) => {
  const targetuser = req.session.targetuser;
  const userId = targetuser._id;
  ThoughtModel.create({
    content: req.body.content,
    userId: userId,
  })
    .then((response) => {
      console.log(response);
      console.log("Your Thought saved Successfully");
      res.redirect("/userHome");
    })
    .catch((err) => {
      console.log("error in saving your thought");
    });
};

export default saveThoughtController;
