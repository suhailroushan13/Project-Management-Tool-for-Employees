import express from "express";
import Comment from "../../models/Comment.js";
import Project from "../../models/Project.js";
import c from "config";

const router = express.Router();

// Get One Comment by ID
router.get("/get/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Find the project by its ID and include associated comments
    const project = await Project.findOne({
      where: { id },
      include: Comment, // Assuming you have defined the association between Project and Comment models
    });

    console.log(project);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Project not found.",
      });
    }

    // Extract comments from the project
    const comments = project.Comments; // Assuming your association is named "Comments"
    console.log(comments);

    // Respond with the array of comments associated with the project
    res.status(200).json({
      success: true,
      comments,
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

// Get All Comments
router.get("/getall", async (req, res) => {
  try {
    // Fetch all projects that have associated comments using Sequelize's include option
    const projects = await Project.findAll({
      include: Comment, // Assuming you have defined the association between Project and Comment models
    });

    // Extract the comments from each project and create an array of comments
    const projectsWithComments = projects.map((project) => ({
      projectId: project.id,
      projectName: project.name,
      comments: project.comments, // Assuming your association is named "Comments"
    }));

    // Respond with the array of projects and their associated comments
    res.status(200).json({
      success: true,
      projectsWithComments,
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

router.get("/comments", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM comments");
    // rows will contain the result of the SQL query

    res.json({ success: true, comments: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});
// Add One
router.post("/add", async (req, res) => {
  try {
    // Validate the incoming data
    const { text, id } = req.body;
    if (!text || !id) {
      return res.status(400).json({
        success: false,
        error: "Both 'text' and 'id' are required fields.",
      });
    }

    // Check if the project with the specified ID exists
    const project = await Project.findOne({ where: { id } });

    if (!project) {
      // If the project doesn't exist, respond with a 404 (Not Found) status code
      return res.status(404).json({
        success: false,
        error: "Project not found.",
      });
    }

    // Create a new comment
    const comment = await Comment.create({
      text,
    });

    // Associate the comment with the project
    await project.addComment(comment);

    // Respond with the updated project data
    res.status(200).json({
      success: true,
      comment,
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

// Add Multiple
router.post("/addbulk", (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

// Update One
router.put("/update/:id", (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

// Update Bulk
router.put("/updatebulk", (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

// Delete One
router.delete("/delete/:id", (req, res) => {
  try {
    let userData = req.body;
    res.send(userData);
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

// Delete Bulk
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

router.delete("/delete/:projectId", async (req, res) => {
  const projectId = req.params.projectId;

  try {
    // Find the project by its ID
    const project = await Project.findOne({
      where: { id: projectId },
      include: Comment, // Assuming you have defined the association between Project and Comment models
    });

    console.log(project);

    if (!project) {
      // If the project doesn't exist, respond with a 404 (Not Found) status code
      return res.status(404).json({
        success: false,
        error: "Project not found.",
      });
    }

    // Delete all comments associated with the project
    await Comment.destroy({
      where: { ProjectId: projectId },
    });

    // Respond with a success message
    res.status(200).json({
      success: true,
      message: `All comments for project with ID ${projectId} have been deleted.`,
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

export default router;
