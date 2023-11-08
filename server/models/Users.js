import { DataTypes } from "sequelize";
import { sequelize } from "../utils/dbConnect.js";

function timeAgo(pastDate) {
  if (!pastDate) {
    return "Never logged in";
  }

  const differenceInSeconds = Math.floor(
    (new Date() - new Date(pastDate)) / 1000
  );
  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;

  if (differenceInSeconds < minute) {
    return `${differenceInSeconds} seconds ago`;
  } else if (differenceInSeconds < hour) {
    return `${Math.floor(differenceInSeconds / minute)} minutes ago`;
  } else if (differenceInSeconds < day) {
    return `${Math.floor(differenceInSeconds / hour)} hours ago`;
  } else if (differenceInSeconds < week) {
    return `${Math.floor(differenceInSeconds / day)} days ago`;
  } else {
    return `${Math.floor(differenceInSeconds / week)} weeks ago`;
  }
}

const User = sequelize.define("users", {
  firstName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fullName: {
    type: DataTypes.STRING,
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
    validate: {
      isNumeric: true,
    },
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
    type: DataTypes.STRING,
    defaultValue: null,
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

export default User;
