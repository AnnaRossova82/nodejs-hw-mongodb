import Contact from '../db/models/Contact.js';

export const getAllContacts = async () => {
  return await Contact.find();
};

export const getContactById = async (id) => {
  return await Contact.findById(id);
};

export const createContact = async (contactData) => {
  const contact = new Contact(contactData);
  await contact.save();
  return contact;
};

export const updateContact = async (id, updates) => {
  return await Contact.findByIdAndUpdate(id, updates, { new: true });
};

export const deleteContact = async (id) => {
  return await Contact.findByIdAndDelete(id);
};

