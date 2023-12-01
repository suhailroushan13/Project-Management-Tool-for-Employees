import { DataTypes } from "sequelize";
import { sequelize } from "../utils/dbConnect.js";
import Project from "./Project.js";
import Legacy from "./Legacy.js";
import timeAgo from "../utils/timeAgo.js";

const User = sequelize.define("users", {
  fullName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  displayName: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM("Admin", "Lead", "Owner", "User"),
    allowNull: true,
    defaultValue: "User",
  },
  title: {
    type: DataTypes.TEXT,
  },
  profileImage: {
    type: DataTypes.STRING, // Changed to TEXT for longer strings
    allowNull: true,
  },

  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true,
  },

  lastActive: {
    type: DataTypes.VIRTUAL,
    get() {
      return timeAgo(this.getDataValue("lastLogin"));
    },
  },
});

User.hasMany(Project, {
  foreignKey: "createdBy",
  as: "projects",
});

User.hasMany(Legacy, {
  foreignKey: "createdBy",
  as: "legacys",
});

Legacy.belongsTo(User, {
  foreignKey: "lead", // The column in Legacy model that holds the reference
  as: "Lead", // Alias used for include
  targetKey: "displayName", // The column in User model to match with
});

Legacy.belongsTo(User, {
  foreignKey: "owner",
  as: "Owner",
  targetKey: "displayName",
});

export default User;
