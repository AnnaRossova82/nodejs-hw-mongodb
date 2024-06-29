import Contact from '../db/models/Contact.js';

export const getAllContacts = async (page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', type, isFavourite) => {
  const skip = (page - 1) * perPage;
  const sortOrderValue = sortOrder === 'asc' ? 1 : -1;
  const filter = {};
  if (type) filter.contactType = type;
  if (isFavourite !== undefined) filter.isFavourite = isFavourite;

  const totalItems = await Contact.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / perPage);
  const contacts = await Contact.find(filter)
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrderValue });

  return {
      contacts,
      totalItems,
      totalPages,
      page,
      perPage,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages,
  };
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

