import { DataTypes } from "sequelize";
import { sequelize } from "../utils/dbConnect.js";

const Project = sequelize.define("projects", {
  projectName: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 1000], // Validate the description field's length (0 to 1000 characters)
    },
  },
  lead: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  owner: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  newEndDate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  priority: {
    type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH", "NA"),
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM(
      "NOT STARTED",
      "ON HOLD",
      "OVERDUE",
      "IN PROGRESS",
      "COMPLETED"
    ),
    allowNull: true,
  },

  nextReview: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdBy: {
    type: DataTypes.INTEGER,
    references: {
      model: "users", // Use the table name here as a string
      key: "id",
    },
  },
});

// In your Project model

export default Project;
