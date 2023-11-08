import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/Users.js";
import Admin from "../../models/Admin.js";
import Project from "../../models/Project.js";
// import { Comment } from "../../models/Comment.js";
import { sequelize } from "../../utils/dbConnect.js";
import { Op } from "sequelize"; // Import Op from Sequelize
import config from "config";
import { syncModels } from "../../utils/dbConnect.js";
import multer from "multer";
import path from "path";
import { promises as fs } from "fs";

let TOKEN = config.get("TOKEN");

const router = express.Router();

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // Convert to 12-hour format and set AM/PM
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  hours = String(hours).padStart(2, "0");

  return `${day}-${month}-${year}-${hours}:${minutes}-${ampm}`;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, "/home/suhail/newsquad/server/uploads"),
  filename: (req, file, cb) => {
    const userId = req.params.id;
    const currentTime = formatDate(new Date());
    cb(null, `${userId}-${currentTime}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }

    cb(new Error("Only images are allowed!"));
  },
}).single("image");

// Fetch all users
router.get("/getall", async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "An error occurred while fetching users.",
    });
  }
});

// Get a specific user by email
router.get("/getuser/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ where: { email } });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "An error occurred while fetching the user.",
    });
  }
});

router.get("/getleads", async (req, res) => {
  try {
    const leads = await User.findAll({ where: { role: "lead" } });

    res.status(200).json(leads);
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
        error: "An error occurred while fetching leads.",
      });
    }
  }
});
router.post("/add", async (req, res) => {
  try {
    let { email, password, firstName, lastName, role, phone, fullName, title } =
      req.body;

    // Build the condition for finding an existing user
    const condition = {
      where: {
        [Op.or]: [{ email }],
      },
    };
    if (phone) {
      condition.where[Op.or].push({ phone });
    }

    // Check if a user with the same email or phone already exists
    const existingUser = await User.findOne(condition);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with the same email or phone already exists.",
        user: existingUser,
      });
    }

    let hashedPassword = null;

    if (password && typeof password === "string" && password.trim() !== "") {
      hashedPassword = await bcrypt.hash(password.trim(), 10);
    }

    // Create a new user in the database
    const newUser = await User.create({
      email: email || null,
      password: hashedPassword, // It will be null if not provided or not valid
      firstName: firstName || null,
      lastName: lastName || null,
      fullName: fullName || null,
      role,
      title: title || null,
      phone: phone || null, // Set phone to null if it's not provided
    });

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
      res.status(500).json({
        success: false,
        error: error,
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
    const { email, password, phone, firstName, lastName, role, bio } = req.body;

    // Prepare the data to update. Note that we're not adding the password here.
    const updatedData = {
      email,
      phone: phone ? phone : null,
      firstName,
      lastName,
      role,
      bio,
    };

    // If the password is provided in the request, hash it and include it in the update.
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds
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

    // await syncModels();

    res.json({ success: true, message: "'users' Table Dropped Forcefully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message:
        "An error occurred while deleting comments and dropping the 'users' table.",
    });
  }
});

// router.post(
//   "/updateBio/:userId",
//   upload.single("profileImage"),
//   async (req, res) => {
//     try {
//       const { userId } = req.params;
//       const { filename } = req.file; // Multer will handle the uploaded file

//       // Check if the user with the specified userId exists
//       const user = await User.findByPk(userId);

//       if (!user) {
//         return res.status(404).json({
//           success: false,
//           message: "User not found",
//         });
//       }

//       // Update the user's profileImageUrl in the database
//       user.profileImageUrl = filename;

//       await user.save();

//       res.status(200).json({
//         success: true,
//         message: "Profile image updated successfully",
//       });
//     } catch (error) {
//       console.error("Error during profile image update:", error);
//       res.status(500).json({
//         success: false,
//         error: "An error occurred while updating the profile image.",
//       });
//     }
//   }
// );

router.get("/getallimages", async (req, res) => {
  try {
    // Find all users with profile images
    const usersWithImages = await User.findAll({
      where: { profileImage: { [Op.not]: null } }, // Filter users with non-null profileImage
      attributes: ["id", "firstName", "email", "role", "profileImage"],
    });

    if (!usersWithImages || usersWithImages.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users with profile images found.",
      });
    }

    // Extract image data from each user and create an array of image objects
    const imageUrls = usersWithImages.map((user) => ({
      userId: user.id,
      firstName: user.firstName,
      email: user.email,
      role: user.role,
      imageUrl: user.profileImage,
    }));

    return res.json({ success: true, images: imageUrls });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the profile images.",
    });
  }
});

router.get("/getimage/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Find user by ID
    const user = await User.findOne({
      where: { id: userId },
      attributes: ["id", "firstName", "email", "role", "profileImage"], // Include the specific attributes you want from User
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    if (user.profileImage) {
      const imagePath = user.profileImage;
      return res.json({
        success: true,
        imageUrl: imagePath,
        userId: user.id,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Profile image not found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the profile image.",
    });
  }
});

router.post("/uploadimage/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(userId);

    await new Promise((resolve, reject) => {
      upload(req, res, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    // Update the user's profileImage in the User model
    await User.update(
      {
        profileImage: req.file.path,
      },
      {
        where: { id: userId },
      }
    );

    res.json({
      success: true,
      message: "Profile image uploaded successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while uploading the profile image.",
    });
  }
});

router.put("/updateimage/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Fetch user's current profile image path
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // If user has a profile image, delete it from the server
    if (user.profileImage) {
      try {
        await fs.unlink(user.profileImage); // This deletes the old image file
      } catch (err) {
        console.warn(
          "Failed to delete old profile image. Continuing with update."
        );
      }
    }

    // Now, use multer to handle the new image upload
    await new Promise((resolve, reject) => {
      upload(req, res, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    // Update the user's profileImage in the User model with the new image's path
    await User.update(
      {
        profileImage: req.file.path,
      },
      {
        where: { id: userId },
      }
    );

    res.json({
      success: true,
      message: "Profile image updated successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the profile image.",
    });
  }
});

router.delete("/deleteimage/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Fetch user's current profile image path
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // If user has a profile image, delete it from the server
    if (user.profileImage) {
      await fs.unlink(user.profileImage); // This deletes the image file
    }

    // Update the user's profileImage in the User model to null
    await User.update(
      {
        profileImage: null,
      },
      {
        where: { id: userId },
      }
    );

    res.json({
      success: true,
      message: "Profile image deleted successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the profile image.",
    });
  }
});

export default router;
