import { DataTypes } from "sequelize";
import { sequelize } from "../utils/dbConnect.js";
import { parse, format } from "date-fns";
import User from "./Users.js";

const Project = sequelize.define("projects", {
  projectName: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
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
      "COMPLETED",

      "CANCELED"
    ),
    allowNull: true,
  },

  nextReview: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export default Project;
