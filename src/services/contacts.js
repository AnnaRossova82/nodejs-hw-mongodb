import Contact from '../db/models/Contact.js';

export const getAllContacts = async (page, perPage, sortBy, sortOrder, type, isFavourite, userId) => {
  const query = { userId };
  if (type) query.contactType = type;
  if (isFavourite !== undefined) query.isFavourite = isFavourite;

  const contacts = await Contact.find(query)
    .sort({ [sortBy]: sortOrder })
    .skip((page - 1) * perPage)
    .limit(perPage);
  return contacts;
};

export const getContactById = async (contactId, userId) => {
  const contact = await Contact.findOne({ _id: contactId, userId });
  return contact;
};

export const createContact = async (contactData) => {
  const newContact = await Contact.create(contactData);
  return newContact;
};

export const updateContact = async (contactId, updates, userId) => {
  const updatedContact = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    updates,
    { new: true }
  );
  return updatedContact;
};

export const deleteContact = async (contactId, userId) => {
  const deletedContact = await Contact.findOneAndDelete({ _id: contactId, userId });
  return deletedContact;
};

