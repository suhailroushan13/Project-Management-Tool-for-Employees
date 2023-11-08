import { sequelize } from "./dbConnect.js";

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("Database synced successfully with alterations.");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
};

export default syncDatabase;
