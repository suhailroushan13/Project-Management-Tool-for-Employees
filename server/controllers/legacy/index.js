import express from "express";
import { Op } from "sequelize"; // Import Op from Sequelize
// import Legacy from "../../models/Legacy.js";
import Legacy from "../../models/Legacy.js";
// import { Comment, CommentAttachment } from "../../models/Comment.js";
import axios from "axios";
import { syncModels } from "../../utils/dbConnect.js";

const router = express.Router();

router.get("/getall", async (req, res) => {
  try {
    // const projects = await Legacy.findAll({ include: Comment });
    const projects = await Legacy.findAll({});

    res.status(200).json(projects);
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

router.get("/get/:id", async (req, res) => {
  const { id } = req.params; // Extract the project id from the URL parameter

  try {
    const project = await Legacy.findOne({
      where: { id }, // Find the project by id
    });

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Legacy not found" });
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
    const projects = await Legacy.findAll({
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
    let response = await Legacy.findAll();

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

    console.log(projectData);

    // Check if a project with the same name already exists in the database
    const existingProject = await Legacy.findOne({
      where: { projectName: projectData.projectName },
    });

    if (existingProject) {
      // If a project with the same name exists, respond with an error message
      return res.status(400).json({
        success: false,
        error: "A project with the same name already exists.",
      });
    }

    // Create a new project in the database using Sequelize
    await Legacy.create(projectData);

    // Respond with the created project data and a success status code (201)
    res.status(201).json({
      success: true,
      msg: "Legacy Added Successfully",
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
    const project = await Legacy.findOne({ where: { id } });

    // Check if the project exists
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Legacy not found." });
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
    const project = await Legacy.findOne({ where: { id } });

    // Check if the project exists
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Legacy not found." });
    }

    // Delete the project from the database
    await project.destroy();

    // Return a success message as a response
    res
      .status(200)
      .json({ success: true, message: "Legacy deleted successfully." });
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
    await Legacy.destroy({ where: {} });

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
//     const projectWithComment = await Legacy.findOne({
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
//     const project = await Legacy.findOne({ where: { id: id } });

//     if (!project) {
//       return res
//         .status(404)
//         .json({ success: false, error: "Legacy not found." });
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

    await CommentAttachment.drop();
    // await Comment.drop();
    await Legacy.drop();

    // Sync the models to recreate the tables
    await syncModels();

    res.status(200).send("Projects table dropped successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    // Extract the user ID from the request parameters
    const { userId } = req.params;

    // Find all projects where the createdBy field matches the user ID
    const projects = await Legacy.findAll({
      where: { createdBy: userId },
    });

    // If no projects are found, return a 404 status code with a message
    if (!projects || projects.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No projects found for the given user ID.",
      });
    }

    // Respond with the found projects and a success status code (200)
    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);

    // Respond with a 500 (Internal Server Error) status code and an error message
    res.status(500).json({
      success: false,
      error: "An error occurred while retrieving the projects.",
    });
  }
});

export default router;
