import express from "express";

import {
  Channel,
  User,
  ChannelMember,
  Message,
  Attachment,
  Tag,
} from "../../models/Channel.js"; // Adjust the path

const router = express.Router();

/////////////////////////////////////

// CHANNEL ROUTES

////////////////////////////////////

// GET

// Get All Channels
router.get("/getall", async (req, res) => {
  try {
    const channels = await Channel.findAll({
      include: {
        model: User,
        through: ChannelMember, // This is the junction table for the many-to-many relationship
        as: "users", // Alias defined when you set up the relationship
      },
    });
    res.status(201).json(channels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a channel by its ID
router.get("/:channelId", async (req, res) => {
  try {
    // Check if the channel exists
    const channelExists = await Channel.count({
      where: { id: req.params.channelId },
    });

    if (!channelExists) {
      return res.status(404).json({ error: "Channel not found" });
    }

    const channel = await Channel.findByPk(req.params.channelId);
    res.status(200).json(channel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST

router.post("/create", async (req, res) => {
  try {
    // Check if there are any users in the users table
    const usersCount = await User.count();
    console.log(usersCount);

    if (usersCount === 0) {
      return res.status(400).json({
        error:
          "User table is not populated. Please add users before creating a channel.",
      });
    }

    let { name, description } = req.body;

    const channel = await Channel.create(req.body);
    res.status(201).json({ msg: `Your ${name} Channel Has Been Created` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT

router.put("/:channelId/update", async (req, res) => {
  try {
    const channelId = req.params.channelId;

    // Check if the channel exists
    const channel = await Channel.findByPk(channelId);

    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    // Update the channel
    const updatedChannel = await channel.update(req.body);
    res
      .status(200)
      .json({ msg: `Channel ${updatedChannel.name} has been updated` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE

// Delete Channel By ID

router.delete("/:channelId", async (req, res) => {
  try {
    const channel = await Channel.findByPk(req.params.channelId);

    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    await channel.destroy();

    res.json({ success: `Channel ${channel.name} has been deleted` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete all Channels
router.delete("/deleteall", async (req, res) => {
  try {
    console.log("hELLO");

    // First, delete all records from the channelMembers table (or any other tables that reference Channel)
    await ChannelMember.destroy({ where: {} });

    // Then, delete all channels
    await Channel.destroy({
      where: {},
    });
    res
      .status(200)
      .json({ msg: "All channels and associated members have been deleted." });
  } catch (error) {
    res.status(500).json({ error });
  }
});

/////////////////////////////////////

// CHANNEL MEMEBERS ROUTES

////////////////////////////////////

// GET

// Get All Members
router.get("/channels/users", async (req, res) => {
  try {
    // Fetch all channels and their associated users
    const channels = await Channel.findAll({
      include: [
        {
          model: User,
          through: ChannelMember, // The junction table
          as: "users", // Alias defined when setting up the relationship
        },
      ],
    });

    // Create a structured response with channel and its associated users
    const response = channels.map((channel) => ({
      channelId: channel.id,
      channelName: channel.name,
      users: channel.users.map((user) => ({
        userId: user.id,
        userName: user.fullName,
      })),
    }));

    // Return the structured response
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET All Users of A Channel
router.get("/:channelId/users", async (req, res) => {
  try {
    const channelId = req.params.channelId;

    // Check if the channel exists
    const channel = await Channel.findByPk(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    // Fetch all users associated with this channel
    const users = await User.findAll({
      include: [
        {
          model: Channel,
          where: { id: channelId },
          through: ChannelMember, // The junction table
          as: "channels", // Alias defined when setting up the relationship
        },
      ],
    });

    // Return the users
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET Channel By ID
router.get("/:channelId", async (req, res) => {
  try {
    // Fetch the channel by its ID along with its associated users and messages
    const channel = await Channel.findByPk(req.params.channelId, {
      include: [
        {
          model: User,
          through: ChannelMember, // The junction table
          as: "users", // Alias defined when setting up the relationship with users
        },
        {
          model: Message,
          as: "messages", // Alias defined when setting up the relationship with messages
        },
      ],
    });

    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    // Return the channel details
    res.status(200).json(channel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST

// Add User in Channel
router.post("/:channelId/users/:userId", async (req, res) => {
  try {
    // Fetch the channel and user details using the provided IDs
    const channel = await Channel.findByPk(req.params.channelId);
    const user = await User.findByPk(req.params.userId);

    // Check if the channel or user doesn't exist
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user is already a member of the channel
    const existingMember = await ChannelMember.findOne({
      where: {
        channelId: req.params.channelId,
        userId: req.params.userId,
      },
    });
    if (existingMember) {
      return res
        .status(400)
        .json({ error: "User is already a member of the channel" });
    }

    // Create the ChannelMember entry
    const member = await ChannelMember.create({
      channelId: req.params.channelId,
      userId: req.params.userId,
    });

    // Send the success response with the channel name and user full name
    res.json({
      success: `${user.fullName} has been added to channel ${channel.name}`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT

router.put("/:channelId/users/:userId", async (req, res) => {
  try {
    // Find the association between the user and the channel
    const member = await ChannelMember.findOne({
      where: {
        channelId: req.params.channelId,
        userId: req.params.userId,
      },
    });

    // If the association doesn't exist, send an error response
    if (!member) {
      return res
        .status(404)
        .json({ error: "User is not a member of the channel" });
    }

    // Fetch the channel and user details for response message
    const channel = await Channel.findByPk(req.params.channelId);
    const user = await User.findByPk(req.params.userId);

    // If the channel or user doesn't exist, send an error response
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the association attributes
    // For instance, if you have a 'role' in the ChannelMember, you can update it like this:
    // member.role = req.body.role;
    for (let key in req.body) {
      member[key] = req.body[key];
    }

    await member.save();

    // Send the success response with the updated details
    res.json({
      success: `${user.fullName}'s details have been updated in channel ${channel.name}`,
      updatedDetails: member,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE

// Delete User By ID
router.delete("/:channelId/users/:userId", async (req, res) => {
  try {
    // Find the association between the user and the channel
    const member = await ChannelMember.findOne({
      where: {
        channelId: req.params.channelId,
        userId: req.params.userId,
      },
    });

    // If the association doesn't exist, send an error response
    if (!member) {
      return res
        .status(404)
        .json({ error: "User is not a member of the channel" });
    }

    // Fetch the channel and user details for response message
    const channel = await Channel.findByPk(req.params.channelId);
    const user = await User.findByPk(req.params.userId);

    // If the channel or user doesn't exist, send an error response
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete the association
    await member.destroy();

    // Send the success response with the channel name and user full name
    res.json({
      success: `${user.fullName} has been removed from channel ${channel.name}`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete all users from channel
router.delete("/:channelId/users", async (req, res) => {
  try {
    const channel = await Channel.findByPk(req.params.channelId);

    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    // Check the count of users associated with the channel
    const usersCount = await ChannelMember.count({
      where: {
        channelId: req.params.channelId,
      },
    });

    if (usersCount === 0) {
      return res
        .status(400)
        .json({ error: "No users to delete from the channel" });
    }

    await ChannelMember.destroy({
      where: {
        channelId: req.params.channelId,
      },
    });

    res.json({
      success: `All users have been removed from channel ${channel.name}`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/////////////////////////////////////

// MESSAGES ROUTES

////////////////////////////////////

// GET
// Messagess

// Get All Messages of a Channel:
router.get("/:channelId/messages", async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: {
        channelId: req.params.channelId,
      },
      include: { model: User, as: "Sender" }, // To include sender's details with each message
    });

    if (!messages) {
      return res
        .status(404)
        .json({ error: "No messages found for this channel" });
    }

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Message By ID
router.get("/:channelId/messages/:messageId", async (req, res) => {
  try {
    const message = await Message.findOne({
      where: {
        id: req.params.messageId,
        channelId: req.params.channelId,
      },
      include: { model: User, as: "Sender" }, // To include sender's details with the message
    });

    if (!message) {
      return res.status(404).json({
        error: "No message found with this ID in the specified channel",
      });
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET ALL MESAGES OF CHANNEL
router.get("/:channelId/messages", async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: {
        channelId: req.params.channelId,
      },
      include: { model: User, as: "Sender" }, // To include sender's details with each message
    });

    if (messages.length === 0) {
      return res
        .status(404)
        .json({ error: "No messages found for this channel" });
    }

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 
router.get("/users/:userId/messages", async (req, res) => {
  try {
    // Fetch messages sent by the user
    const messages = await Message.findAll({
      where: {
        userId: req.params.userId,
      },
      include: [
        { model: Channel, as: "Channel" }, // Include channel details for each message
        { model: User, as: "Sender" }, // Include sender's details, though it'll be repetitive in this case
      ],
    });

    if (messages.length === 0) {
      return res.status(404).json({ error: "No messages found for this user" });
    }

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




router.post("/:channelId/messages", async (req, res) => {
  try {
    const { content, userId } = req.body;

    // Validate the provided data
    if (!content || !userId) {
      return res.status(400).json({ error: "Content and userId are required" });
    }

    // Check if the user and channel exist
    const user = await User.findByPk(userId);
    const channel = await Channel.findByPk(req.params.channelId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    // Create the message
    const message = await Message.create({
      content,
      userId,
      channelId: req.params.channelId,
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Edit Message
router.put("/:channelId/messages/:messageId", async (req, res) => {
  try {
    const { content } = req.body;

    // Validate the provided data
    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    // Fetch the message using provided channelId and messageId
    const message = await Message.findOne({
      where: {
        id: req.params.messageId,
        channelId: req.params.channelId,
      },
    });

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Update the message content
    message.content = content;
    await message.save();

    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Message
router.delete("/:channelId/messages/:messageId", async (req, res) => {
  try {
    // Fetch the message using provided channelId and messageId
    const message = await Message.findOne({
      where: {
        id: req.params.messageId,
        channelId: req.params.channelId,
      },
    });

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Delete the message
    await message.destroy();

    res.json({ success: `Message has been deleted` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
