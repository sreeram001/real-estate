import sequelize from '../config/db';
import User from '../models/user';

const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: true }); // This will drop all tables and recreate them
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing the database:', error);
  } finally {
    await sequelize.close();
  }
};

syncDatabase();
