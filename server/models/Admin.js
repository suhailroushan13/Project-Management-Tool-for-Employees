import { DataTypes } from "sequelize";
import { sequelize } from "../utils/dbConnect.js";

const Admin = sequelize.define("admins", {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isNumeric: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("Admin"),
    allowNull: false,
  },
  profileImageUrl: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  title: {
    type: DataTypes.TEXT,
    defaultValue: null,
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true,
  },

  lastActive: {
    type: DataTypes.VIRTUAL, // This field does not correspond to a database column
    get() {
      const currentTime = new Date();
      const lastLogin = this.lastLogin;
      if (!lastLogin) {
        return "Never logged in";
      }
      const diffInSeconds = (currentTime - lastLogin) / 1000;
      const diffInMinutes = diffInSeconds / 60;
      const diffInHours = diffInMinutes / 60;
      const diffInDays = diffInHours / 24;

      if (diffInDays > 30) {
        return "Suspended";
      } else if (diffInDays >= 1) {
        const days = Math.floor(diffInDays);
        return `${days} Day${days > 1 ? "s" : ""} ago`;
      } else if (diffInHours >= 1) {
        const hours = Math.floor(diffInHours);
        return `${hours} Hour${hours > 1 ? "s" : ""} ago`;
      } else if (diffInMinutes >= 1) {
        const minutes = Math.floor(diffInMinutes);
        return `${minutes} Minute${minutes > 1 ? "s" : ""} ago`;
      } else {
        return "Few Minutes Ago";
      }
    },
  },
});

export default Admin;
