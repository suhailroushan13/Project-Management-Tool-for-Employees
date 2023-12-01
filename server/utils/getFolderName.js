import { promises as fsPromises } from "fs";
import { join } from "path";

export async function fetchFolderNamesWithClientServer(directoryPath) {
  try {
    const files = await fsPromises.readdir(directoryPath);

    const subdirectories = await Promise.all(
      files.map(async (file) => {
        const fullPath = join(directoryPath, file);
        const stat = await fsPromises.stat(fullPath);
        if (stat.isDirectory()) {
          const subFiles = await fsPromises.readdir(fullPath);
          if (subFiles.includes("client") && subFiles.includes("server")) {
            return file;
          }
        }
        return null;
      })
    );

    // Filter out null values (directories that don't contain "client" and "server")
    const filteredFolderNames = subdirectories.filter((name) => name !== null);

    return filteredFolderNames;
  } catch (err) {
    console.error("Error reading directory:", err);
    throw err; // You can handle the error according to your application's needs
  }
}

