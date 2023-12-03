import express from "express";
import { Op } from "sequelize"; // Import Op from Sequelize
import Project from "../../models/Project.js";
import User from "../../models/Users.js";
import { sequelize } from "../../utils/dbConnect.js";
// import { Comment, CommentAttachment } from "../../models/Comment.js";
import axios from "axios";
import { syncModels } from "../../utils/dbConnect.js";
import sendEmail from "../../utils/sendEmail.js";

const router = express.Router();
router.get("/getall", async (req, res) => {
  try {
    // Fetching projects without associated user details initially
    const projects = await Project.findAll();

    for (let project of projects) {
      let updateFields = {};

      // Find and assign the lead user ID
      if (project.lead) {
        const leadUser = await User.findOne({
          where: { displayName: project.lead },
        });
        if (leadUser) {
          updateFields.leadId = leadUser.id;
        }
      }

      // Find and assign the owner user ID
      if (project.owner) {
        const ownerUser = await User.findOne({
          where: { displayName: project.owner },
        });
        if (ownerUser) {
          updateFields.ownerId = ownerUser.id;
        }
      }

      // Update the project if there are fields to update
      if (Object.keys(updateFields).length > 0) {
        await project.update(updateFields);
      }
    }

    // Fetch projects again, now with associated user details
    const updatedProjects = await Project.findAll({
      include: [
        {
          model: User,
          as: "Lead",
          attributes: [
            "id",
            "fullName",
            "displayName",
            "email",
            "phone",
            "role",
            "title",
            "profileImage",
            "lastLogin",
            "createdAt",
            "updatedAt",
          ],
        },
        {
          model: User,
          as: "Owner",
          attributes: [
            "id",
            "fullName",
            "displayName",
            "email",
            "phone",
            "role",
            "title",
            "profileImage",
            "lastLogin",
            "createdAt",
            "updatedAt",
          ],
        },
        // Include other associations as needed
      ],
    });

    // Send a single response after processing
    res.status(200).json(updatedProjects);
  } catch (error) {
    // Error handling
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
        error: "An error occurred while fetching projects.",
      });
    }
  }
});

router.get("/get/:id", async (req, res) => {
  const { id } = req.params; // Extract the project id from the URL parameter

  try {
    const project = await Project.findOne({
      where: { id }, // Find the project by id
    });

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "An error occurred while fetching the project.",
    });
  }
});

router.get("/getbylead/:leadName", async (req, res) => {
  const { leadName } = req.params; // Extract the lead name from the URL parameter

  try {
    const projects = await Project.findAll({
      where: {
        [Op.or]: [
          { lead: leadName }, // Find projects with the specified lead name
          { owner: leadName }, // Find projects with the specified owner name
        ],
      },
    });

    if (!projects || projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No projects found for this lead or owner",
      });
    }

    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error:
        "An error occurred while fetching projects by lead name or owner name.",
    });
  }
});

router.get("/getleadsdata", async (req, res) => {
  try {
    let response = await Project.findAll();

    const leadCounts = response.reduce((counts, project) => {
      if (project.status !== "COMPLETED") {
        const lead = project.lead;
        counts[lead] = (counts[lead] || 0) + 1;
      }
      return counts;
    }, {});

    // Create an array of lead names and counts
    const leadNamesAndCounts = Object.entries(leadCounts);
    res.status(200).json(leadNamesAndCounts);
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
    // Destructure the request body to get only the desired values
    const {
      projectName,
      description,
      lead,
      owner,
      newEndDate,
      priority,
      status,
      nextReview,
      createdBy,
    } = req.body;

    const projectData = {
      projectName,
      description,
      lead,
      owner,
      newEndDate,
      priority,
      status,
      nextReview,
      createdBy,
    };
    projectData.comments = [];

    // Check if a project with the same name already exists in the database
    const existingProject = await Project.findOne({
      where: { projectName: projectData.projectName },
    });

    if (existingProject) {
      // If a project with the same name exists, respond with an error message
      return res.status(400).json({
        success: false,
        error: "A project with the same name already exists.",
      });
    }

    let leadData = await User.findOne({
      where: { displayName: lead },
    });

    let ownerData = await User.findOne({
      where: { displayName: owner },
    });

    // /////////////////////////////////

    let addLeadEmailBody = `<!DOCTYPE html>
<html>

<head>
    <style>
        .container {
            display: flex;
            flex-wrap: wrap;
        }

        .card {
            width: 400px;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            font-family: Arial, sans-serif;
            margin: 20px;
        }

        .card-title {
            font-size: 18px;
            font-weight: bold;
            text-align: center;
        }

        .card-content {
            font-size: 14px;
            padding: 5px;
            text-align: left;
            /* Smaller text size for email */
            margin-top: 10px;
        }

        .contact-info {
            margin-top: 20px;
        }

        .contact-info p {
            margin: 5px 0;
        }

        .vertical-table {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            margin-top: 10px;
            padding: 3px;
        }

        .vertical-table-label {
            flex: 1;
            font-weight: bold;
        }

        .vertical-table-value {
            flex: 2;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="card">
            <div class="card-title">Project Added In Your Bucket 🪣!</div>
            <p><strong>Hello ${leadData.displayName} 👋</strong></p>
            <p>You Have Created New Project
            <p>Here are the Project Detail's</p>
            </p>
            <div class="card-content">
                <div class="vertical-table">
                    <div class="vertical-table-label">Project Name:</div>
                    <div class="vertical-table-value">${projectName}</div>
                </div>
                <div class="vertical-table">
                    <div class="vertical-table-label">Description:</div>
                    <div class="vertical-table-value">${description}</div>
                </div>
                <div class="vertical-table">
                    <div class="vertical-table-label">Lead:</div>
                    <div class="vertical-table-value">${lead}</div>
                </div>
                <div class="vertical-table">
                    <div class="vertical-table-label">Owner:</div>
                    <div class="vertical-table-value">${owner}</div>
                </div>
                <div class="vertical-table">
                    <div class="vertical-table-label">New End Date:</div>
                    <div class="vertical-table-value">${newEndDate}</div>
                </div>
                <div class="vertical-table">
                    <div class="vertical-table-label">Priority:</div>
                    <div class="vertical-table-value">${priority}</div>
                </div>
                <div class="vertical-table">
                    <div class="vertical-table-label">Status:</div>
                    <div class="vertical-table-value">${status}</div>
                </div>
                <div class="vertical-table">
                    <div class="vertical-table-label">Next Review:</div>
                    <div class="vertical-table-value">${nextReview}</div>
                </div>
                
            </div>


            <div class="card-content">
                <p><strong>Best regards,</strong></p>
                <p>T-Works</p>
            </div>
        </div>
    </div>
</body>

</html>`;

    let addOwnerEmailBody = `<!DOCTYPE html>
<html>

<head>
    <style>
        .container {
            display: flex;
            flex-wrap: wrap;
        }

        .card {
            width: 400px;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            font-family: Arial, sans-serif;
            margin: 20px;
        }

        .card-title {
            font-size: 18px;
            font-weight: bold;
            text-align: center;
        }

        .card-content {
            font-size: 14px;
            padding: 5px;
            text-align: left;
            /* Smaller text size for email */
            margin-top: 10px;
        }

        .contact-info {
            margin-top: 20px;
        }

        .contact-info p {
            margin: 5px 0;
        }

        .vertical-table {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            margin-top: 10px;
            padding: 3px;
        }

        .vertical-table-label {
            flex: 1;
            font-weight: bold;
        }

        .vertical-table-value {
            flex: 2;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="card">
            <div class="card-title">Project Added In Your Bucket 🪣!</div>
            <p><strong> Hello ${ownerData.displayName} 👋 </strong></p>
            <p>Look Like You Have a New Project Assigned By <strong> ${leadData.displayName} </strong></p>
            <p>Here are the Project Detail's</p>
            </p>
            <div class="card-content">
                <div class="vertical-table">
                    <div class="vertical-table-label">Project Name:</div>
                    <div class="vertical-table-value">${projectName}</div>
                </div>
                <div class="vertical-table">
                    <div class="vertical-table-label">Description:</div>
                    <div class="vertical-table-value">${description}</div>
                </div>
                <div class="vertical-table">
                    <div class="vertical-table-label">Lead:</div>
                    <div class="vertical-table-value">${lead}</div>
                </div>
                <div class="vertical-table">
                    <div class="vertical-table-label">Owner:</div>
                    <div class="vertical-table-value">${owner}</div>
                </div>
                <div class="vertical-table">
                    <div class="vertical-table-label">New End Date:</div>
                    <div class="vertical-table-value">${newEndDate}</div>
                </div>
                <div class="vertical-table">
                    <div class="vertical-table-label">Priority:</div>
                    <div class="vertical-table-value">${priority}</div>
                </div>
                <div class="vertical-table">
                    <div class="vertical-table-label">Status:</div>
                    <div class="vertical-table-value">${status}</div>
                </div>
                <div class="vertical-table">
                    <div class="vertical-table-label">Next Review:</div>
                    <div class="vertical-table-value">${nextReview}</div>
                </div>
                
            </div>


            <div class="card-content">
                <p><strong>Best regards,</strong></p>
                <p>T-Works</p>
            </div>
        </div>
    </div>
</body>

</html>`;

    // ////////////////////////////////////

    let recipient1 = [{ email: leadData.email, fullName: leadData.fullName }];

    let recipient2 = [{ email: ownerData.email, fullName: ownerData.fullName }];

    const subject = `Project Assigned By ${leadData.displayName} to ${ownerData.displayName} | T-Works`; // Custom subject
    sendEmail(addLeadEmailBody, subject, recipient1);
    sendEmail(addOwnerEmailBody, subject, recipient2);

    console.log(leadData.email);
    console.log(ownerData.email);
    // Create a new project in the database using Sequelize
    await Project.create(projectData);

    // Respond with the created project data and a success status code (201)
    res.status(201).json({
      success: true,
      msg: "Project Added Successfully",
    });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);

    // Respond with a 500 (Internal Server Error) status code and an error message
    res.status(500).json({
      success: false,
      error: "An error occurred while adding the project.",
    });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const id = req.params.id; // Get the project ID from the URL parameter

    // Find the project by ID in the database
    const project = await Project.findOne({ where: { id } });

    const {
      projectName,
      description,
      lead,
      owner,
      newEndDate,
      priority,
      status,
      nextReview,
    } = project;

    // Check if the project exists
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found." });
    }

    // Define which fields can be updated
    const allowedUpdates = [
      "projectName",
      "description",
      "lead",
      "owner",
      "newEndDate",
      "priority",
      "status",
      "nextReview",
    ];

    // Update the project with valid fields from the request body
    const updates = {};
    allowedUpdates.forEach((update) => {
      if (Object.prototype.hasOwnProperty.call(req.body, update)) {
        project[update] = req.body[update];
        updates[update] = req.body[update];
      }
    });

    let leadData = await User.findOne({
      where: { displayName: lead },
    });

    let ownerData = await User.findOne({
      where: { displayName: owner },
    });

    // /////////////////////////////////

    let addLeadEmailBody = `<!DOCTYPE html>
<html>

<head>
    <style>
        .container {
            display: flex;
            flex-wrap: wrap;
        }

        .card {
            width: 400px;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            font-family: Arial, sans-serif;
            margin: 20px;
        }

        .card-title {
            font-size: 18px;
            font-weight: bold;
            text-align: center;
        }

        .card-content {
            font-size: 14px;
            padding: 5px;
            text-align: left;
            /* Smaller text size for email */
            margin-top: 10px;
        }

        .contact-info {
            margin-top: 20px;
        }

        .contact-info p {
            margin: 5px 0;
        }

        .vertical-table {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            margin-top: 10px;
            padding: 3px;
        }

        .vertical-table-label {
            flex: 1;
            font-weight: bold;
        }

        .vertical-table-value {
            flex: 2;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="card">
            <div class="card-title">Project Updated In Your Bucket 🪣!</div>
            <p><strong>Hello ${leadData.displayName} 👋</strong></p>
            <p>You Have Updated The Project
            <p>Here are the Updated Project Detail's</p>
            </p>
            <div class="card-content">
                <div class="vertical-table">
                    <div class="vertical-table-label">Project Name:</div>
                    <div class="vertical-table-value">${projectName}</div>
                </div>
                <div class="vertical-table">
                    <div class="vertical-table-label">Description:</div>
                    <div class="vertical-table-value">${description}</div>
                </div>
                <div class="vertical-table">
                    <div class="vertical-table-label">Lead:</div>
                    <div class="vertical-table-value">${lead}</div>
                </div>
                <div class="vertical-table">
                    <div class="vertical-table-label">Owner:</div>
                    <div class="vertical-table-value">${owner}</div>
                </div>
                <div class="vertical-table">
                    <div class="vertical-table-label">New End Date:</div>
                    <div class="vertical-table-value">${newEndDate}</div>
                </div>
                <div class="vertical-table">
                    <div class="vertical-table-label">Priority:</div>
                    <div class="vertical-table-value">${priority}</div>
                </div>
                <div class="vertical-table">
                    <div class="vertical-table-label">Status:</div>
                    <div class="vertical-table-value">${status}</div>
                </div>
                <div class="vertical-table">
                    <div class="vertical-table-label">Next Review:</div>
                    <div class="vertical-table-value">${nextReview}</div>
                </div>
                
            </div>


            <div class="card-content">
                <p><strong>Best regards,</strong></p>
                <p>T-Works</p>
            </div>
        </div>
    </div>
</body>

</html>`;

    let addOwnerEmailBody = `<!DOCTYPE html>
<html>

<head>
    <style>
        .container {
            display: flex;
            flex-wrap: wrap;
        }

        .card {
            width: 400px;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            font-family: Arial, sans-serif;
            margin: 20px;
        }

        .card-title {
            font-size: 18px;
            font-weight: bold;
            text-align: center;
        }

        .card-content {
            font-size: 14px;
            padding: 5px;
            text-align: left;
            /* Smaller text size for email */
            margin-top: 10px;
        }

        .contact-info {
            margin-top: 20px;
        }

        .contact-info p {
            margin: 5px 0;
        }

        .vertical-table {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            margin-top: 10px;
            padding: 3px;
        }

        .vertical-table-label {
            flex: 1;
            font-weight: bold;
        }

        .vertical-table-value {
            flex: 2;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="card">
            <div class="card-title">Project Updated In Your Bucket 🪣!</div>
            <p><strong> Hello ${ownerData.displayName} 👋 </strong></p>
            <p>Look Like You Have a Updated Assigned By <strong> ${leadData.displayName} </strong></p>
            <p>Here are the Updated Project Detail's</p>
            </p>
            <div class="card-content">
                <div class="vertical-table">
                    <div class="vertical-table-label">Project Name:</div>
                    <div class="vertical-table-value">${projectName}</div>
                </div>
                <div class="vertical-table">
                    <div class="vertical-table-label">Description:</div>
                    <div class="vertical-table-value">${description}</div>
                </div>
                <div class="vertical-table">
                    <div class="vertical-table-label">Lead:</div>
                    <div class="vertical-table-value">${lead}</div>
                </div>
                <div class="vertical-table">
                    <div class="vertical-table-label">Owner:</div>
                    <div class="vertical-table-value">${owner}</div>
                </div>
                <div class="vertical-table">
                    <div class="vertical-table-label">New End Date:</div>
                    <div class="vertical-table-value">${newEndDate}</div>
                </div>
                <div class="vertical-table">
                    <div class="vertical-table-label">Priority:</div>
                    <div class="vertical-table-value">${priority}</div>
                </div>
                <div class="vertical-table">
                    <div class="vertical-table-label">Status:</div>
                    <div class="vertical-table-value">${status}</div>
                </div>
                <div class="vertical-table">
                    <div class="vertical-table-label">Next Review:</div>
                    <div class="vertical-table-value">${nextReview}</div>
                </div>
                
            </div>


            <div class="card-content">
                <p><strong>Best regards,</strong></p>
                <p>T-Works</p>
            </div>
        </div>
    </div>
</body>

</html>`;

    // ////////////////////////////////////

    let recipient1 = [{ email: leadData.email, fullName: leadData.fullName }];

    let recipient2 = [{ email: ownerData.email, fullName: ownerData.fullName }];

    const subject = `Project Updated By ${leadData.displayName} to ${ownerData.displayName} | T-Works`; // Custom subject
    sendEmail(addLeadEmailBody, subject, recipient1);
    sendEmail(addOwnerEmailBody, subject, recipient2);

    console.log(leadData.email);
    console.log(ownerData.email);

    await project.save();

    // Return the updated fields as a response
    res.status(200).json(updates);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "An error occurred while updating the project.",
    });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id; // Get the project ID from the URL parameter

    // Find the project by ID in the database
    const project = await Project.findOne({ where: { id } });

    // Check if the project exists
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found." });
    }

    const {
      projectName,
      description,
      lead,
      owner,
      newEndDate,
      priority,
      status,
      nextReview,
      createdBy,
    } = project;

    let leadData = await User.findOne({
      where: { displayName: lead },
    });

    let ownerData = await User.findOne({
      where: { displayName: owner },
    });

    let EmailBody = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project Deleted</title>
    <style>
        /* Reset some default styles for email clients */
        body,
        p {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            font-size: 16px;
            line-height: 1.6;
            color: #333;
        }

        /* Container for the card */
        .container {
            max-width: 400px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9eaea;
            /* Light red background color */
            border: 1px solid #e74c3c;
            /* Border color */
            border-radius: 5px;
            text-align: center;
        }

        /* Heading style */
        h1 {
            font-size: 24px;
            color: #e74c3c;
            /* Red color for heading */
        }

        /* Text style */
        p {
            margin-top: 20px;
        }

        /* Link style */
        a {
            color: #3498db;
            /* Blue color for links */
            text-decoration: none;
        }

        /* Responsive styles */
        @media screen and (max-width: 500px) {
            .container {
                width: 100%;
                padding: 10px;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <h1>${projectName} Project Deleted</h1>
        <p>This project has been successfully deleted.</p>

    </div>
</body>

</html>`;

    // Delete the project from the database
    await project.destroy();

    let recipient1 = [{ email: leadData.email, fullName: leadData.fullName }];

    let recipient2 = [{ email: ownerData.email, fullName: ownerData.fullName }];

    const subject = ` ${project.projectName} Project is Deleted | T-Works`; // Custom subject
    sendEmail(EmailBody, subject, recipient1);
    sendEmail(EmailBody, subject, recipient2);

    // Return a success message as a response
    res
      .status(200)
      .json({ success: true, message: "Project deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "An error occurred while deleting the project.",
    });
  }
});

router.delete("/deleteall", async (req, res) => {
  try {
    // Delete all projects from the database
    await Project.destroy({ where: {} });

    // Return a success message as a response
    res
      .status(200)
      .json({ success: true, message: "All projects deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "An error occurred while deleting all projects.",
    });
  }
});

// // Get All Comments By ID

// router.get("/comment/:commentId", async (req, res) => {
//   try {
//     // Extract the commentId from the request parameters
//     const { commentId } = req.params;

//     // Find a project that has a comment with the given commentId
//     const projectWithComment = await Project.findOne({
//       where: {
//         comments: {
//           [Op.contains]: [{ commentId: commentId }],
//         },
//       },
//     });

//     if (!projectWithComment) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Comment not found." });
//     }

//     // Extract the comment with the given ID from the project's comments
//     const comment = projectWithComment.comments.find(
//       (comment) => comment.commentId === commentId
//     );

//     // Return the comment as a response
//     res.status(200).json({ success: true, comment: comment });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       error: "An error occurred while fetching the comment.",
//     });
//   }
// });

// Add Comment

// router.post("/:id", async (req, res) => {
//   try {
//     // Extract the id from the request parameters
//     const id = req.params.id;
//     console.log(id);

//     // Find the project with the given id
//     const project = await Project.findOne({ where: { id: id } });

//     if (!project) {
//       return res
//         .status(404)
//         .json({ success: false, error: "Project not found." });
//     }

//     // Extract the new comment data from req.body
//     const newCommentData = req.body; // Assuming the comment is in the 'comment' field of req.body

//     // Find the last comment in the comments array
//     const lastComment = project.comments[project.comments.length - 1];
//     console.log(lastComment);

//     // Extract the last character of the comment ID and convert it to a number
//     const lastChar = lastComment
//       ? parseInt(lastComment.commentId.slice(-1))
//       : 0;

//     // Calculate the new comment ID by incrementing the last character by 1
//     const newCommentId = lastChar + 1;
//     console.log(newCommentId);

//     // Create a new comment object with the new comment ID
//     const newComment = {
//       commentId: newCommentId.toString(), // Convert the number back to a string
//       ...newCommentData, // Include other comment data
//     };

//     // Push the new comment into the comments array of the project
//     project.comments.push(newComment);

//     console.log(project.comments);

//     // Save the project to persist the changes in the database
//     await project.save();

//     // Return a success response
//     res.status(201).json(project);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       error: "An error occurred while adding the comment.",
//     });
//   }
// });

router.delete("/reset", async (req, res) => {
  try {
    // Drop the comments table

    // await CommentAttachment.drop();
    // await Comment.drop();
    await Project.drop();

    // Sync the models to recreate the tables
    await syncModels();

    res.status(200).send("Projects table dropped successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/project/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;

    // Find the project with the given ID and include associated data
    const project = await Project.findOne({
      where: { id: projectId },
      include: [
        {
          model: User,
          as: "Lead", // Ensure this matches your association alias
          attributes: { exclude: ["password"] },
        },
        {
          model: User,
          as: "Owner", // Ensure this matches your association alias
          attributes: { exclude: ["password"] },
        },
      ],
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: "No project found for the given project ID.",
      });
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "An error occurred while retrieving the project.",
    });
  }
});
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const projects = await Project.findAll({
      where: { createdBy: userId },
      include: [
        {
          model: User,
          as: "Lead",
          attributes: [
            "id",
            "fullName",
            "displayName",
            "email",
            "phone",
            "role",
            "title",
            "profileImage",
            "lastLogin",
            "createdAt",
            "updatedAt",
          ],
        },
        {
          model: User,
          as: "Owner",
          attributes: [
            "id",
            "fullName",
            "displayName",
            "email",
            "phone",
            "role",
            "title",
            "profileImage",
            "lastLogin",
            "createdAt",
            "updatedAt",
          ],
        },
      ],
    });

    if (!projects || projects.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No projects found for the given user ID.",
      });
    }

    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "An error occurred while retrieving the projects.",
    });
  }
});

export default router;
