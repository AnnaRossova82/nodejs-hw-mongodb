import Contact from '../db/models/Contact.js';

export const getContacts = async () => {
  return await Contact.find();
};

export const getContactById = async (contactId) => {
    return await Contact.findById(contactId);
  };
