import UserModel from "../../model/userModel.js";

const profileEditController = async (req, res) => {
  // Ensure the user is logged in and targetuser is in the session
  const targetuser = req.session.targetuser;
  if (!targetuser) {
    console.log("Session or user not found.");
    return res.status(404).send("Session or user not found");
  }

  const userId = targetuser._id;
  const { email, username, password } = req.body;

  // Build the update object dynamically
  const updateFields = {};
  if (email) updateFields.email = email;
  if (username) updateFields.username = username;
  if (password) updateFields.password = password;

  if (Object.keys(updateFields).length === 0) {
    console.log("No fields to update.");
    return res.status(400).send("No fields to update.");
  }

  try {
    // Update only the fields present in updateFields
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updateFields }, // Use $set to update only specified fields
      { new: true, runValidators: true } // Return the updated document and run validators
    );

    if (!updatedUser) {
      console.log("User not found.");
      return res.status(404).send("User not found");
    }

    console.log("User updated successfully");

    // Update session with new user details
    req.session.targetuser = updatedUser;

    // Redirect to the profile page
    res.redirect("/profile");
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Server Error");
  }
};

export default profileEditController;
