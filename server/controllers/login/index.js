import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import Admin from "../../models/Admin.js";
import User from "../../models/Users.js";
import config from "config";

const router = express.Router();

const TOKEN = config.get("TOKEN"); // Change to your secret key

// Common login route for both users and admins
router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user or admin by email
    const user = await User.findOne({ where: { email } });
    const admin = await Admin.findOne({ where: { email } });

    // If neither user nor admin is found, return an error
    if (!user && !admin) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed. User not found.",
      });
    }

    // Check the password for user or admin based on the presence of user or admin
    const entity = user || admin;
    const passwordMatch = await bcrypt.compare(password, entity.password);

    // If the password doesn't match, return an error
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed. Incorrect password.",
      });
    }

    // Create a JWT token for authentication
    const token = jwt.sign(
      { userId: entity.userId, email: entity.email },
      TOKEN,
      { expiresIn: "1h" }
    );

    let role = entity.role;

    // console.log("Updating lastLogin for entity:", entity.email);
    entity.lastLogin = new Date();
    // console.log("New lastLogin value:", entity.lastLogin);
    await entity.save();
    // console.log("Entity saved:", entity);

    res.status(200).json({
      success: true,
      message: "Authentication successful",
      token,
      role,
      entity,
      user,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while attempting to log in.",
    });
  }
});

export default router;
