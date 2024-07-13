import { getAllContacts, getContactById, createContact, updateContact, deleteContact } from '../services/contacts.js';
import createHttpError from 'http-errors';
import cloudinary from '../config/cloudinaryConfig.js';
import fs from 'fs/promises';

const saveFileToCloudinary = async (file, folder) => {
  const response = await cloudinary.uploader.upload(file.path, { folder });
  await fs.unlink(file.path);
  return response.secure_url;
};

export const getContacts = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', type, isFavourite } = req.query;
    const userId = req.user._id;

    const contacts = await getAllContacts(Number(page), Number(perPage), sortBy, sortOrder, type, isFavourite, userId);
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

export const getContactByIdController = async (req, res) => {
  const userId = req.user._id;
  const contact = await getContactById(req.params.contactId, userId);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${req.params.contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res, next) => {
  try {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;
    const userId = req.user._id;
    let photoUrl = '';

    if (req.file) {
      photoUrl = await saveFileToCloudinary(req.file, 'contacts');
    }
    console.log("Photo URL: ", photoUrl);
    
    const newContact = await createContact({
      name, phoneNumber, email, isFavourite, contactType, userId, photo: photoUrl
    });
    res.status(201).json({
      status: 201,
      message: 'Contact created successfully',
      data: newContact
    });
  } catch (error) {
    next(error);
  }
};

export const updateContactController = async (req, res) => {
  const { contactId } = req.params;
  const updates = req.body;
  const userId = req.user._id;

  if (req.file) {
    updates.photo = await saveFileToCloudinary(req.file, 'contacts');
  }

  const updatedContact = await updateContact(contactId, updates, userId);
  if (!updatedContact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const deletedContact = await deleteContact(contactId, userId);
  if (!deletedContact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(204).send();
};
