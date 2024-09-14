import UserModel from "../../model/userModel.js";

const UpdateController = async (req, res) => {
  try {
    const { userId } = req.params; // Assuming you are passing the user ID in the request parameters
    const { username, email, password } = req.body;

    // Construct the update object with only the fields that are provided
    const updateFields = {};
    if (username) updateFields.username = username;
    if (email) updateFields.email = email;
    if (password) updateFields.password = password; // Ensure password is hashed before updating

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ error: "No fields to update." });
    }

    // Update the user document
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    console.log("success:", updatedUser);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the user." });
  }
};

export default UpdateController;
