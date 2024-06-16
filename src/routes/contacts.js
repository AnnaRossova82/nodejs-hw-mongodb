import express from 'express';
import { getContacts, getContactById } from '../services/contacts.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const contacts = await getContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
});

router.get('/:contactId', async (req, res) => {
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

export default router;
