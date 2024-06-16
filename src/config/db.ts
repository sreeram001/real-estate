// src/index.ts
import { Sequelize } from 'sequelize';
import config from './config';
import User from '../models/user'; // Assuming User model is already defined
import Session from '../models/session'; // Assuming User model is already defined

const sequelize = new Sequelize('postgres', config.dbUserName, config.dbPassword, {
  host: config.dbHost,
  port: config.dbPort,
  dialect: 'postgres',
});

export const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    // Sync models if necessary
    await sequelize.sync({ alter: true });
    console.log('Database synchronized.');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
};

export default sequelize;
