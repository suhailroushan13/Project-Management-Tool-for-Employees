import config from "config";
import { Sequelize } from "sequelize";

const { HOST, DATABASE, USERNAME, PASSWORD } = config.get("SQL");

// Create a single instance of the Sequelize connection
const db = new Sequelize(DATABASE, USERNAME, PASSWORD, {
  host: HOST,
  dialect: "mysql",
  logging: false,
});

const authenticateDB = async () => {
  try {
    await db.authenticate();
    console.log(
      "Connection to the database has been established successfully."
    );
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

authenticateDB();

const syncModels = async () => {
  try {
    // Sync all models to create tables
    await db.sync();
    console.log("All tables have been created");
  } catch (error) {
    console.error("Error syncing models:", error);
  }
};

syncModels();
// Export the Sequelize instance and the synchronization function
export { db as sequelize, syncModels };
