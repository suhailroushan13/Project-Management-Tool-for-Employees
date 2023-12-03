import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import Admin from "../../models/Admin.js";
import User from "../../models/Users.js";
import config from "config";
import otpGen from "../../utils/otpGen.js";
import sendEmail from "../../utils/sendEmail.js";
import { fileURLToPath } from "url";
import path from "path";
import { sequelize } from "../../utils/dbConnect.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Received email:", email);

    if (!email.endsWith("@tworks.in")) {
      console.log("Email does not end with @tworks.in");
      return res.status(400).json({
        success: false,
        message: "Not a Valid User of T-Works",
      });
    }

    console.log("Before calling findOne");
    const user = await User.findOne({ where: { email: email } });
    console.log("After calling findOne");

    if (!user) {
      console.log("User not found for email:", email);
      return res.status(404).json({
        success: false,
        message: "Email not found in our database",
      });
    }

    let fullName = user.fullName;
    let otp = otpGen(6);

    const emailBody = `<!DOCTYPE html>
<html>

<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
        }

        .header {
            background-color: #ffffff;
            color: #fff;
            text-align: center;
            padding: 10px 0;
        }

        .header-logo {
            font-size: 24px;
            font-weight: bold;
        }

        .card {
            width: 300px;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            background-color: #fff;
            font-family: Arial, sans-serif;
            margin: 20px auto;
        }

        .card-title {
            font-size: 20px;
            font-weight: bold;
            color: #333;
        }

        .card-content {
            font-size: 16px;
            margin-top: 10px;
            color: #555;
        }

        .otp-display {
            font-size: 22px;
            font-weight: bold;
            color: #333;
            padding: 12px;
            margin-top: 10px;
            border: 1px solid #ccc;
            text-align: center;
            border-radius: 3px;
            background-color: #eef;
        }
    </style>
</head>

<body>


    <div class="card">
        <div class="header">
            <div class="header-logo">
                <img height="200px" width="280px"
                    src="https://images.squarespace-cdn.com/content/v1/5b03aa4f31d4df8db1fccf03/70133a8e-845f-4900-b63a-c6359131a5b7/T-WORKS+Logo-01.png?format=1500w"
                    alt="">
            </div>
        </div>
        <br>
        <br>
        <div class="card-title">Hey ${fullName} !</div>
        <br>
        <br>
        <div class="card-title">Your OTP</div>
        <div class="card-content">
            <p>Please use the following OTP to proceed with your password reset:</p>
            <div class="otp-display" id="otp-display">${otp}</div>
        </div>
    </div>


</body>

</html>`;

    const subject = "OTP Verification Required for Your Account | T-Works"; // Custom subject
    const recipients = [{ email, fullName, otp }];

    sendEmail(emailBody, subject, recipients);

    const result = await sequelize.query(
      "UPDATE users SET otp = :otp WHERE email = :email",
      {
        replacements: { email: email, otp: otp },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    console.log(result);

    res.status(200).json({
      success: true,
      message:
        "An OTP has been sent to your email address. Please check your inbox to proceed with the password reset.",
    });
  } catch (error) {
    console.error("Error in /forget-password route:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email not found in our database",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Hash the new password and save it in the database
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    console.log("Password Updated");

    res.status(200).json({
      success: true,
      message:
        "Password reset successful. You can now login with your new password.",
    });
  } catch (error) {
    console.error("Error in /verify-otp route:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

export default router;
