import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  // Construct the absolute path to the HTML file.

  // Send the HTML file as a response.
  res.send(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Status Page</title>
    <style>
      body {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
        background-color: #f0f0f0;
      }

      .status-button {
        background-color: #e0e0e0;
        border: none;
        border-radius: 10px;
        padding: 20px;
        font-size: 24px;
        cursor: default;
        box-shadow: 5px 5px 10px #c0c0c0, -5px -5px 10px #ffffff;
      }

      .status-button:hover {
        background-color: #d0d0d0;
      }

      .status-button:active {
        background-color: #c0c0c0;
      }
    </style>
  </head>
  <body>
    <button class="status-button">Server is Running  🟢</button>
  </body>
</html>
`);
});

export default router;
