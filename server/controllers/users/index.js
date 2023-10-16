import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/Users.js";
import Admin from "../../models/Admin.js";
import Project from "../../models/Project.js";
import Comment from "../../models/Comment.js";
import { sequelize } from "../../utils/dbConnect.js";
import { Op } from "sequelize"; // Import Op from Sequelize
import config from "config";

let TOKEN = config.get("TOKEN");

const router = express.Router();

// Fetch all users
router.get("/getall", async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    if (
      error.name === "SequelizeDatabaseError" &&
      error.parent.code === "ER_NO_SUCH_TABLE"
    ) {
      res
        .status(200)
        .json({ success: false, message: "Table Not Created Yet" });
    } else {
      console.error(error);
      res.status(500).json({
        success: false,
        error: "An error occurred while fetching users.",
      });
    }
  }
});

router.post("/add", async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, role, phone } =
      req.body;

    console.log(req.body);

    const requiredFields = [
      "username",
      "email",
      "password",
      "firstName",
      "lastName",
      "role",
      "phone",
    ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `The following required fields are missing: ${missingFields.join(
          ", "
        )}`,
      });
    }

    // Check if a user with the same email or username already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }, { phone }],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with the same email or username already exists.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
      phone,
    });

    // const formattedData = {
    //   id: newUser.id,
    //   userId: newUser.userId,
    //   username: newUser.username,
    //   firstName: newUser.firstName,
    //   lastName: newUser.lastName,
    //   email: newUser.email,
    //   phone: newUser.phone,
    //   password: newUser.password,
    //   bio: newUser.bio,
    //   isActive: newUser.isActive,
    //   profileImageUrl: newUser.profileImageUrl,
    // };

    res.status(201).json({
      success: true,
      message: "User Added Successfully",
    });
  } catch (error) {
    console.error("Error during user creation:", error);
    if (
      error.name === "SequelizeDatabaseError" &&
      error.parent.code === "ER_NO_SUCH_TABLE"
    ) {
      res
        .status(200)
        .json({ success: false, message: "Table Not Created Yet" });
    } else {
      console.error(error);
      res.status(500).json({
        success: false,
        error: "An error occurred while fetching users.",
      });
    }
  }
});

// // User login
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find the user by username
//     const user = await User.findOne({ where: { email } });

//     const admin = await Admin.findOne({ where: { email } });
//     console.log(user, admin);

//     // If the user doesn't exist, return an error
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Authentication failed. User not found.",
//       });
//     }

//     // if (!admin) {
//     //   return res.status(401).json({
//     //     success: false,
//     //     message: "Authentication failed. Admin not found.",
//     //   });
//     // }

//     // Compare the provided password with the hashed password in the database
//     const passwordMatch = await bcrypt.compare(password, user.password);

//     // If the password doesn't match, return an error
//     if (!passwordMatch) {
//       return res.status(401).json({
//         success: false,
//         message: "Authentication failed. Incorrect password.",
//       });
//     }

//     // Create a JWT token for authentication
//     const token = jwt.sign(
//       { userId: user.userId, username: user.username },
//       TOKEN, // Replace with your secret key
//       { expiresIn: "1h" } // Set the token expiration time (e.g., 1 hour)
//     );

//     res.status(200).json({
//       success: true,
//       message: "Authentication successful",
//       token,
//     });
//   } catch (error) {
//     console.error("Error during login:", error);
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while attempting to log in.",
//     });
//   }
// });
// Update user information

router.put("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { username, email, password, phone, firstName, lastName, role } =
      req.body;

    // Hash the new password if it's provided
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds
    }

    // Prepare the data to update
    const updatedData = {
      username,
      email,
      phone,
      firstName,
      lastName,
      role,
      password: hashedPassword,
    };

    // Include the hashed password in the update if a new password is provided
    if (hashedPassword) {
      updatedData.password = hashedPassword;
    }

    // Update the user's information
    const [updatedCount] = await User.update(updatedData, {
      where: { id },
    });

    if (updatedCount === 1) {
      res
        .status(200)
        .json({ success: true, message: "User updated successfully" });
    } else {
      res.status(404).json({ success: false, message: "No User Found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the user.",
    });
  }
});
// Delete a user by ID
router.delete("/delete/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    // Check if the user exists
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ success: false, message: "No User Found" });
    }

    // Delete the user
    await User.destroy({ where: { id: userId } });

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the user.",
    });
  }
});

// Delete all projects and users
// Delete all users and associated comments
// Delete all users
router.delete("/deleteall", async (req, res) => {
  try {
    // Delete all users without using TRUNCATE
    await User.destroy({
      where: {},
      truncate: false, // Use DELETE instead of TRUNCATE
    });

    res.json({ success: true, message: "All users deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting all users.",
    });
  }
});

// drop users table
router.delete("/dropusers", async (req, res) => {
  try {
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");

    // Drop the 'users' table
    await sequelize.getQueryInterface().dropTable("users");

    // Re-enable foreign key checks
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

    res.json({ success: true, message: "'users' table dropped forcefully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message:
        "An error occurred while deleting comments and dropping the 'users' table.",
    });
  }
});
export default router;
