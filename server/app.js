import express from "express";
import config from "config";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import fs from "fs";
import multer from "multer";

import { fileURLToPath } from "url";
import syncDatabase from "./utils/sync.js";

import userRouter from "./controllers/users/index.js";
import adminRouter from "./controllers/admins/index.js";
import loginRouter from "./controllers/login/index.js";
import projectRouter from "./controllers/projects/index.js";
import channelRouter from "./controllers/Channel/newIndex.js";
import legacyRouter from "./controllers/legacy/index.js";

const PORT = config.get("PORT");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Allow CORS from all origins
app.use(cors());

app.use(morgan("dev"));
app.use(express.json());

// Serve static files from the "build" directory
app.use(express.static(path.join(__dirname, "build")));

// Serve the status file at the root
app.get("/", (req, res) => {
  const statusFilePath = "/home/suhail/newsquad/server/utils/status.html";
  if (fs.existsSync(statusFilePath)) {
    res.status(200).sendFile(statusFilePath);
  } else {
    res.status(404).send("File not found");
  }
});

// API routes
app.use("/api/login", loginRouter);
app.use("/api/users", userRouter);
app.use("/api/admins", adminRouter);
app.use("/api/projects", projectRouter);
app.use("/api/legacy", legacyRouter);
app.use("/api/channel", channelRouter);

app.use("/*", (req, res) => {
   res.redirect("https://pms.tworks.in");
  // res.json({ msg: "Invalid Route Please Check Spelling Suhail" });
});

await syncDatabase();

app.listen(PORT, () => {
  console.log(`Server Started AT ${PORT}`);
  console.log(`Yoo Deployed at : ${config.get("URL")}`);
  // console.log("Redis is running and active.");
});
