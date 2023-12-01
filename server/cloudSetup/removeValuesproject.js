import fs from "fs/promises";

async function readJsonFromFile(filePath) {
  try {
    const jsonData = await fs.readFile(filePath, "utf8");
    return JSON.parse(jsonData);
  } catch (error) {
    console.error("Error reading JSON file:", error);
    throw error;
  }
}

async function writeJsonToFile(filePath, data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
    console.log("Data written to newData.json");
  } catch (error) {
    console.error("Error writing JSON file:", error);
    throw error;
  }
}

const sourceFilePath = "./setup/db.json"; // Replace with the path to your source JSON file
const outputFilePath = "./newData.json"; // New file where the data will be saved

try {
  const data = await readJsonFromFile(sourceFilePath);

  // Remove keys "id", "projectName", "createdAt", "updatedAt" from each object in the array
  const newData = data.map(
    ({ id, projectId, createdAt, updatedAt, ...rest }) => rest
  );

  await writeJsonToFile(outputFilePath, newData);
} catch (error) {
  // Handle any errors here
}
