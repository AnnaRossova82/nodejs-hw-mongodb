import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import contactsRouter from './routers/contacts.js';
import authRoutes from './routers/auth.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import initMongoConnection from './db/initMongoConnection.js';

dotenv.config();

const setupServer = () => {
  const app = express();
  const port = process.env.PORT || 3001;

  app.use(cors());
  app.use(pino({ transport: { target: 'pino-pretty' } }));
  app.use(express.json());
  app.use(cookieParser());

  app.use('/contacts', contactsRouter);
  app.use('/auth', authRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

const startServer = async () => {
  await initMongoConnection();
  setupServer();
};

export default startServer;

