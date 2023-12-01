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
import { fileURLToPath } from "url";
import cloudinary from "cloudinary";
import { dirname } from "path";

// Use this to get the directory name of the current module
const __dirname = dirname(fileURLToPath(import.meta.url));

let TOKEN = config.get("TOKEN");

cloudinary.config({
  cloud_name: config.get("CLOUD.NAME"),
  api_key: config.get("CLOUD.API_KEY"),
  api_secret: config.get("CLOUD.API_SECRET_KEY"),
});

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.get("UPLOAD_PATH")); // Specify the folder where you want to store the uploaded files
  },
  filename: function (req, file, cb) {
    const userId = req.params.id;
    const extension = path.extname(file.originalname);
    const fileName = `${userId}${extension}`; // Use userId as the filename
    cb(null, fileName);
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
});

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

router.get("/get/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Validate the userId if necessary, e.g., check if it's a number

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found.",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "An error occurred while fetching the user.",
    });
  }
});

router.get("/getalladmins", async (req, res) => {
  try {
    // Retrieve only users with the role "Admin"
    const admins = await User.findAll({
      where: {
        role: "Admin",
      },
    });
    res.status(200).json(admins);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "An error occurred while fetching admin users.",
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
    const {
      email,
      password,
      role,
      phone,
      fullName,
      title,
      profileImage,
      displayName,
    } = req.body;

    console.log(req.body);

    if (!email || !email.endsWith("@tworks.in")) {
      return res.status(400).json({
        success: false,
        message: "Only T-Works Email's Allowed",
      });
    }

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

    const hashedPassword = password
      ? await bcrypt.hash(password.trim(), 10)
      : null;

    // Create a new user in the database
    await User.create({
      email: email || null,
      password: hashedPassword,
      fullName: fullName || null,
      displayName: displayName || null,
      role: role || null,
      profileImage: profileImage || null,
      title: title || null,
      phone: phone || null,
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
    const {
      email,
      password,
      phone,
      fullName,
      role,
      bio,
      title,
      profileImage,
      displayName,
    } = req.body;

    if (!email || !email.endsWith("@tworks.in")) {
      return res.status(400).json({
        success: false,
        message: "Only T-Works Email's Allowed",
      });
    }
    // Prepare the data to update. Note that we're not adding the password here.
    const updatedData = {
      email,
      phone: phone ? phone : null,
      fullName,
      displayName,
      role,
      title,
      bio,
      profileImage,
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
// Get all profile images for all users
router.get("/getallimages", async (req, res) => {
  try {
    const usersWithProfileImages = await User.findAll({
      where: {
        profileImage: {
          [Op.not]: null, // Filters users with non-null profileImage
        },
      },
    });
    // Extract user details and profile image URLs from each user
    const userData = usersWithProfileImages.map((user) => ({
      id: user.id,
      fullName: user.fullName,
      displayName: user.displayName,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
    }));

    res.json({
      success: true,
      users: userData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message:
        "An error occurred while fetching user details and profile images.",
    });
  }
});

// Get profile image URL for a user
router.get("/getimage/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Use Sequelize to find the user by ID
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!user.profileImage) {
      return res.status(404).json({
        success: false,
        message: "Profile image not found for this user.",
      });
    }

    // Construct the response object with the desired user details
    const userDetails = {
      id: user.id,
      fullName: user.fullName,
      displayName: user.displayName,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
    };

    res.json({
      success: true,
      users: [userDetails],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the profile image.",
    });
  }
});

router.post("/uploadimage/:id", upload.single("image"), async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(req);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded.",
      });
    }

    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Store the Cloudinary image URL in the user's profileImage field
    user.profileImage = result.secure_url;
    await user.save();

    // Delete the local file after uploading to Cloudinary
    // fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      message: "Image uploaded successfully!",
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while uploading the image.",
    });
  }
});

// Delete profile image for a user
router.delete("/deleteimage/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Use Sequelize to find the user by ID
    const user = await User.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Clear the profileImage URL by setting it to null
    user.profileImage = null;

    // Save the updated user object to the database
    await user.save();

    res.json({
      success: true,
      message: "Profile image URL cleared successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while clearing the profile image URL.",
    });
  }
});

// Delete all profile images for all users
router.delete("/deleteallimages", async (req, res) => {
  try {
    // Use Sequelize to fetch all users
    const users = await User.findAll();

    // Clear the profileImage field for each user
    for (const user of users) {
      user.profileImage = null;
      await user.save();
    }

    res.json({
      success: true,
      message: "All profile images deleted successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting profile images.",
    });
  }
});

export default router;
