import Contact from '../db/models/Contact.js';

export const getAllContacts = async (page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', type, isFavourite, userId) => {
  const skip = (page - 1) * perPage;
  const sortOrderValue = sortOrder === 'asc' ? 1 : -1;
  const filter = { userId };
  if (type) filter.contactType = type;
  if (isFavourite !== undefined) filter.isFavourite = isFavourite;

  const totalItems = await Contact.countDocuments(filter);
  const contacts = await Contact.find(filter)
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrderValue });

  return {
      contacts,
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      page,
      perPage,
      hasPreviousPage: page > 1,
      hasNextPage: page < Math.ceil(totalItems / perPage),
  };
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

