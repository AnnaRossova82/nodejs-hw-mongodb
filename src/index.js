import dotenv from 'dotenv';
import setupServer from './server.js';
import initMongoConnection from './db/initMongoConnection.js';

dotenv.config();

const startServer = async () => {
  try {
    await initMongoConnection();
    setupServer();
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
