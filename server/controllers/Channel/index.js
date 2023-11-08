import config from "config";
import express from "express";
// import { Comment, CommentAttachment } from "../../models/Comment.js";
import Project from "../../models/Project.js";
import User from "../../models/Users.js";
import { syncModels } from "../../utils/dbConnect.js";

const router = express.Router();

router.get("/get/:commentId", async (req, res) => {
  try {
    const commentId = req.params.commentId;

    // Find the comment with the given ID
    const comment = await Comment.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      return res.status(404).json({ msg: "Comment not found." });
    }

    res.status(200).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

// Get All Comments with Associated Users and Projects
router.get("/getall", async (req, res) => {
  try {
    // Fetch all comments with their associated projects and users, including all attributes of Project and User
    const comments = await Comment.findAll({
      include: [
        {
          model: Project,
          required: true,
          attributes: ["id", "projectName", "lead", "owner"], // Include the specific attributes you want from Project
        },
        {
          model: User,
          required: true,
          attributes: ["id", "firstName", "email", "role"], // Include the specific attributes you want from U
        },
      ],
    });

    const commentsWithUsersAndProjects = comments.map((comment) => {
      return {
        commentId: comment.id,
        text: comment.text,
        createdAt: comment.createdAt,
        project: comment.project, // Include the entire project object
        user: comment.user, // Include the entire user object
      };
    });

    console.log(commentsWithUsersAndProjects);

    res.status(200).json({
      success: true,
      commentsWithUsersAndProjects,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

router.get("/getallcomments/:projectId", async (req, res) => {
  try {
    const projectId = req.params.projectId;

    // Find all comments associated with the given project ID and include their associated Project and User
    const comments = await Comment.findAll({
      include: [
        {
          model: Project,
          where: { id: projectId }, // Filter by the specified project ID
          attributes: ["id", "projectName", "lead", "owner"], // Include the specific attributes you want from Project
        },
        {
          model: User,
          attributes: ["id", "firstName", "email", "role"], // Include the specific attributes you want from User
        },
      ],
    });

    const commentsWithUsersAndProjects = comments.map((comment) => {
      return {
        commentId: comment.id,
        text: comment.text,
        createdAt: comment.createdAt,
        project: comment.project, // Include the entire project object
        user: comment.user, // Include the entire user object
      };
    });

    console.log(commentsWithUsersAndProjects);

    res.status(200).json({
      success: true,
      commentsWithUsersAndProjects,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

router.post("/add", async (req, res) => {
  try {
    const { text, projectId, userId } = req.body;

    if (!text || !projectId || !userId) {
      return res.status(400).json({
        success: false,
        error: "Both 'text', 'projectId', and 'userId' are required fields.",
      });
    }

    const project = await Project.findOne({ where: { id: projectId } });

    if (!project) {
      // If the project doesn't exist, respond with a 404 (Not Found) status code
      return res.status(404).json({
        success: false,
        error: "Project not found.",
      });
    }

    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      // If the user doesn't exist, respond with a 404 (Not Found) status code
      return res.status(404).json({
        success: false,
        error: "User not found.",
      });
    }

    const comment = await Comment.create({ text });

    // Associate the comment with both the project and the user
    await project.addComment(comment);
    await user.addComment(comment);

    res.status(200).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

// Update One
router.put("/update/:commentId", async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const { text, id: projectId } = req.body;

    // Validate input
    if (!text || !projectId) {
      return res
        .status(400)
        .json({ msg: "Both 'text' and 'projectId' are required." });
    }

    // Check if the project with the specified ID exists
    const projectExists = await Project.count({ where: { id: projectId } });

    if (!projectExists) {
      return res.status(404).json({ msg: "Project not found." });
    }

    // Update the comment
    const [updatedRows] = await Comment.update(
      { text, projectId },
      { where: { id: commentId } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ msg: "Comment not found." });
    }

    res.status(200).json({ msg: "Comment updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

router.delete("/delete/:commentId", async (req, res) => {
  try {
    const commentId = req.params.commentId;

    console.log(commentId);
    // Delete the comment
    const deletedRows = await Comment.destroy({
      where: { id: commentId },
    });

    if (deletedRows === 0) {
      return res.status(404).json({ msg: "Comment not found." });
    }

    res.status(200).json({ msg: "Comment deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

// Delete All Comments Of A Project
router.delete("/deleteall/:projectId", async (req, res) => {
  try {
    const projectId = req.params.projectId;

    // Delete all comments associated with the given project ID
    const deletedRows = await Comment.destroy({
      where: { projectId: projectId },
    });

    if (deletedRows === 0) {
      return res
        .status(404)
        .json({ msg: "No comments found for the specified project." });
    }

    res.status(200).json({
      msg: `All comments for project ${projectId} deleted successfully.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

// Get All Comments of a Project
router.get("/getall/:projectId", async (req, res) => {
  try {
    const projectId = req.params.projectId;

    // Fetch all comments associated with the given project ID
    const comments = await Comment.findAll({
      where: { projectId: projectId },
    });

    if (comments.length === 0) {
      return res
        .status(404)
        .json({ msg: "No comments found for the specified project." });
    }

    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

// Delete Bulk All Comments
router.delete("/deleteall", async (req, res) => {
  try {
    // Delete all comments from the database
    await Comment.destroy({
      where: {}, // Empty where condition to delete all comments
    });

    // Respond with a success message
    res.status(200).json({
      success: true,
      message: "All comments have been deleted.",
    });
  } catch (error) {
    console.error(error);

    // Respond with a 500 (Internal Server Error) status code and an error message
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

// Drop Table
router.delete("/reset", async (req, res) => {
  try {
    // Drop the comments table

    await CommentAttachment.drop();

    await Comment.drop();

    // Sync the models to recreate the tables
    await syncModels();

    res.status(200).json({ msg: "Comments table dropped successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

export default router;
