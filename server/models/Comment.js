import { DataTypes } from "sequelize";
import { sequelize } from "../utils/dbConnect.js";
import Project from "./Project.js";
import User from "./Users.js";

const Comment = sequelize.define("comments", {
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

Comment.belongsTo(Project);
Project.hasMany(Comment);
Comment.belongsTo(User);
User.hasMany(Comment);

const CommentAttachment = sequelize.define("commentattachments", {
  filePath: {
    type: DataTypes.TEXT,
  },
  fileType: {
    type: DataTypes.TEXT,
  },
});

CommentAttachment.belongsTo(Comment);
Comment.hasMany(CommentAttachment);

export default Comment;
