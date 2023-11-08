import fs from "fs/promises";

async function imageToBuffer(imagePath) {
  try {
    // Read the image file as a binary buffer using fs.promises.readFile
    const imageBuffer = await fs.readFile(imagePath);

    return imageBuffer;
  } catch (error) {
    console.error("Error reading image file:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

export default imageToBuffer;
