import ThoughtModel from "../../model/thoughtModel.js";
const deleteThoughtController = async (req, res) => {
  const ThoughtId = String(req.params.id);
  const ThoughtDeleted = await ThoughtModel.findByIdAndDelete(ThoughtId);
  if (ThoughtDeleted) {
    console.log("Thought deleted");
  } else {
    console.log("error in deletion");
  }
  res.redirect("/userHome");
};

export default deleteThoughtController;
