import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../../models/Admin.js";
import User from "../../models/Users.js";

import { sequelize } from "../../utils/dbConnect.js";
import { Op } from "sequelize"; // Import Op from Sequelize
import config from "config";

let TOKEN = config.get("TOKEN");

const router = express.Router();

// // Fetch all admins
router.get("/getall", async (req, res) => {
  try {
    const admins = await Admin.findAll();
    res.status(200).json(admins);
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
        error: "An error occurred while fetching admins.",
      });
    }
  }
});

router.post("/add", async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, phone } = req.body;

    const requiredFields = [
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
    const existingAdmin = await Admin.findOne({
      where: {
        [Op.or]: [{ email }, { phone }],
      },
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin with the same email or phone already exists.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const newAdmin = await Admin.create({
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
      message: "Admin Added Successfully",
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
        error: "An error occurred while fetching admins.",
      });
    }
  }
});

// // Admin login
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find the user by username
//     const user = await Admin.findOne({ where: { email } });

//     // If the user doesn't exist, return an error
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Authentication failed. Admin not found.",
//       });
//     }

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
// // Update user information
router.put("/update/:id", async (req, res) => {
  try {
    const adminId = req.params.id;
    const { email, password, phone, firstName, lastName, role } = req.body;

    // Hash the new password if it's provided
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds
    }

    // Prepare the data to update
    const updatedData = {
      email,
      phone,
      password,
      firstName,
      lastName,
      role,
    };

    // Include the hashed password in the update if a new password is provided
    if (hashedPassword) {
      updatedData.password = hashedPassword;
    }

    // Update the user's information
    const [updatedCount] = await Admin.update(updatedData, {
      where: { adminId: adminId },
    });

    if (updatedCount === 1) {
      res
        .status(200)
        .json({ success: true, message: "Admin updated successfully" });
    } else {
      res.status(404).json({ success: false, message: "No Admin Found" });
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

router.delete("/delete/:adminId", async (req, res) => {
  const adminId = req.params.adminId;
  console.log(adminId);

  try {
    // Check if the admin exists based on the 'adminId' field
    const admin = await Admin.findOne({ where: { id: adminId } });

    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "No Admin Found" });
    }

    // Delete the admin based on the 'adminId' field
    await Admin.destroy({ where: { id: adminId } });

    res.json({ success: true, message: "Admin deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the admin.",
    });
  }
});

// // Delete all admins
router.delete("/deleteall", async (req, res) => {
  try {
    // Delete all admins
    await Admin.destroy({
      where: {},
      truncate: true, // Resets the auto-increment counter for some databases
    });

    res.json({ success: true, message: "All admins deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting all admins.",
    });
  }
});

// drop admins table
router.delete("/dropadmins", async (req, res) => {
  try {
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");

    // Drop the 'users' table
    await sequelize.getQueryInterface().dropTable("admins");

    // Re-enable foreign key checks
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

    // await syncModels();

    res.json({ success: true, message: "'admins' Table Dropped Forcefully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message:
        "An error occurred while deleting comments and dropping the 'users' table.",
    });
  }
});

router.post("/reset", async (req, res) => {
  try {
    const dbName = "tworksdb"; // Get the database name from the request body

    // Drop the database if it exists
    await sequelize.query(`DROP DATABASE IF EXISTS \`${dbName}\``);

    // Create the database with the given name
    await sequelize.query(`CREATE DATABASE \`${dbName}\``);

    res.status(200).json({
      success: true,
      message: `Database '${dbName}' has been dropped and recreated.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

export default router;
