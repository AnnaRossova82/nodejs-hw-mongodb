import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import contactsRouter from './routes/contacts.js'; // Import the router

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

  // Use the contacts router
  app.use('/contacts', contactsRouter);

  app.use((req, res) => {
    res.status(404).json({ status: 404, message: 'Not found' });
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

export default setupServer;


/* import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import { getAllContacts, getContactById } from './services/contacts.js';

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


  app.get('/contacts', async (req, res) => {
    try {
      const contacts = await getAllContacts();
      res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
      });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  });


  app.get('/contacts/:contactId', async (req, res) => {
    try {
      const contact = await getContactById(req.params.contactId);
      if (!contact) {
        return res.status(404).json({ status: 404, message: 'Contact not found' });
      }
      res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${req.params.contactId}!`,
        data: contact,
      });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  });

  app.use((req, res) => {
    res.status(404).json({ status: 404, message: 'Not found' });
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

export default setupServer;
 */
