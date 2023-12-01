import { DataTypes } from "sequelize";
import { sequelize } from "../utils/dbConnect.js";
import Project from "./Project.js";
import User from "./Users.js";
import Legacy from "./Legacy.js";

// Channel Model
const Channel = sequelize.define("channel", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: DataTypes.STRING,
  description: DataTypes.STRING,
});

// ChannelMembers Model (Pivot table for many-to-many relationship between Channel and User)
const ChannelMember = sequelize.define("channelMember", {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
  },
  channelId: {
    type: DataTypes.INTEGER,
    references: {
      model: Channel,
      key: "id",
    },
  },
});

// Message Model
const Message = sequelize.define("message", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  content: DataTypes.TEXT,
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
  },
  channelId: {
    type: DataTypes.INTEGER,
    references: {
      model: Channel,
      key: "id",
    },
  },
});

// Attachments Model
const Attachment = sequelize.define("attachment", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  messageId: {
    type: DataTypes.INTEGER,
    references: {
      model: Message,
      key: "id",
    },
  },
  filePath: DataTypes.STRING,
  fileType: DataTypes.STRING,
});

// Tags Model (For tagging users in messages)
const Tag = sequelize.define("tag", {
  messageId: {
    type: DataTypes.INTEGER,
    references: {
      model: Message,
      key: "id",
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
  },
});

// Relationships
User.belongsToMany(Channel, { through: ChannelMember });
Channel.belongsToMany(User, { through: ChannelMember });

Channel.hasMany(Message);
Message.belongsTo(Channel);

User.hasMany(Message);
Message.belongsTo(User);

Message.hasMany(Attachment);
Attachment.belongsTo(Message);

Message.belongsToMany(User, {
  as: "Tags",
  through: Tag,
  foreignKey: "messageId",
});
User.belongsToMany(Message, { through: Tag });

// Now, set the relationship
Project.belongsTo(User, {
  foreignKey: "createdBy",
  as: "creator",
});

Legacy.belongsTo(User, {
  foreignKey: "createdBy",
  as: "creator",
});

Project.belongsTo(User, { as: "Lead", foreignKey: "leadId" });
Project.belongsTo(User, { as: "Owner", foreignKey: "ownerId" });

// Now, set the relationship

export { User, Channel, ChannelMember, Message, Attachment, Tag, Project };
