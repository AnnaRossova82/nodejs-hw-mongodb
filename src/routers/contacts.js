import express from 'express';
import { getContacts, getContactByIdController, createContactController, updateContactController, deleteContactController } from '../controllers/contacts.js';
import isValidId from '../middlewares/isValidId.js';

const router = express.Router();

router.get('/', getContacts);
router.get('/:contactId', isValidId, getContactByIdController);
router.post('/', createContactController);
router.patch('/:contactId', isValidId, updateContactController);
router.delete('/:contactId', isValidId, deleteContactController);

export default router;


