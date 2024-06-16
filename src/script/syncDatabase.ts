/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import sequelize from "../config/db";
import User from "../models/user";
import Session from "../models/session";

const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: true }); // This will drop all tables and recreate them
    // eslint-disable-next-line no-console
    console.log("Database synchronized successfully.");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error synchronizing the database:", error);
  } finally {
    await sequelize.close();
  }
};

syncDatabase();
