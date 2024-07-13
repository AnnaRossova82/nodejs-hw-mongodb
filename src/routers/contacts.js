import express from 'express';
import {
  getContacts,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController
} from '../controllers/contacts.js';
import isValidId from '../middlewares/isValidId.js';
import ctrlWrapper from '../middlewares/ctrlWrapper.js';
import validateBody from '../middlewares/validateBody.js';
import { createContactSchema, updateContactSchema } from '../validations/contactValidation.js';
import authenticate from '../middlewares/authenticate.js';
import upload from '../config/multerConfig.js';

const router = express.Router();

router.get('/', authenticate, ctrlWrapper(getContacts));
router.get('/:contactId', authenticate, isValidId, ctrlWrapper(getContactByIdController));
router.post('/', authenticate, upload.single('photo'), validateBody(createContactSchema), ctrlWrapper(createContactController));
router.patch('/:contactId', authenticate, isValidId, upload.single('photo'), validateBody(updateContactSchema), ctrlWrapper(updateContactController));
router.delete('/:contactId', authenticate, isValidId, ctrlWrapper(deleteContactController));

export default router;
