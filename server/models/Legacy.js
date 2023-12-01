import { DataTypes } from "sequelize";
import { sequelize } from "../utils/dbConnect.js";
import User from "./Users.js";

const Legacy = sequelize.define("legacys", {
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
    allowNull: true,
  },
});

export default Legacy;
