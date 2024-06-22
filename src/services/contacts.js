import Contact from '../db/models/Contact.js';

export const getAllContacts = async () => {
  try {
    return await Contact.find();
  } catch (error) {
    throw new Error('Error fetching contacts', { cause: error });
  }
};

export const getContactById = async (id) => {
  try {
    return await Contact.findById(id);
  } catch (error) {
    throw new Error('Error fetching contact', { cause: error });
  }
};
/* import Contact from '../db/models/Contact.js';

export const getAllContacts = async () => {
  try {
    return await Contact.find();
  } catch (error) {
    throw new Error('Error fetching contacts', {error});
  }
};

export const getContactById = async (id) => {
  try {
    return await Contact.findById(id);
  } catch (error) {
    throw new Error('Error fetching contact', {error});
  }
}; */
