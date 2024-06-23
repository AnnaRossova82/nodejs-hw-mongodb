import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import contactsRouter from './routers/contacts.js';
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

  app.use('/contacts', contactsRouter);

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

/* import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import contactsRouter from './routes/contacts.js';

dotenv.config();

const setupServer = () => {
  const app = express();
  const port = process.env.PORT || 3001;

  app.use(cors());
  app.use(pino({
    transport: {
      target: 'pino-pretty',
    },
  }));
  app.use(express.json());

  app.use('/contacts', contactsRouter);

  app.use((req, res) => {
    res.status(404).json({ status: 404, message: 'Not found' });
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

export default setupServer;

 */
