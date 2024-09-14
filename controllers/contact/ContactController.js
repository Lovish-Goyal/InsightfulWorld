import ContactModel from "../../model/contactModel.js";

const ContactController = async (req, res) => {
  try {
    const { username, email, message } = req.body;

    if (!username || !email || !message) {
      console.log("Validation error: All fields are required.");
      return;
    }

    const data = await ContactModel.create({
      username,
      email,
      message,
    });

    console.log("success:", data);
    res.redirect("/");
  } catch (error) {
    console.log("error", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
};

export default ContactController;
