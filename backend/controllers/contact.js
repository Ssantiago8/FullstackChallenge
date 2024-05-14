const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Contact = require("../models/Contact");
require("dotenv").config();

// Create a new contact
const createContact = async (req, res, next) => {
  try {
    const { name, address, email, phoneNumber, profilePictureUrl } = req.body;
    const userId = req.user._id; // Se asume que req.user contiene la información del usuario autenticado

    // Crear el contacto
    const contact = await Contact.create({
      name,
      address,
      email,
      phoneNumber,
      profilePictureUrl,
      user: userId,
    });

    // Agregar el ID del contacto al array de contactos del usuario
    await User.findByIdAndUpdate(userId, { $push: { contacts: contact._id } });

    res.status(201).json({ message: "Contact created succesfully", contact });
  } catch (error) {
    next(error);
  }
};

// Get all contacts for a user
const getContacts = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1; // Actual page number
    const pageSize = parseInt(req.query.pageSize) || 10; // Default page size to 10

    // Calculate the start index of the contacts
    const startIndex = (page - 1) * pageSize;

    // Find the user and populate the contacts with pagination
    const user = await User.findById(userId).populate({
      path: "contacts",
      options: {
        skip: startIndex,
        limit: pageSize,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Obtain total count of contacts
    const totalCount = user.contacts.length;

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / pageSize);

    // build response
    const response = {
      contacts: user.contacts,
      pagination: {
        totalItems: totalCount,
        totalPages: totalPages,
        currentPage: page,
        pageSize: pageSize,
      },
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

//Update a contact
const updateContact = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const contactId = req.params.id;
    const { name, address, email, phoneNumber, profilePictureUrl } = req.body;

    // Verify if the contact exists
    const contact = await Contact.findOne({ _id: contactId, user: userId });
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    // Update the contact with the new information
    contact.name = name;
    contact.address = address;
    contact.email = email;
    contact.phoneNumber = phoneNumber;
    contact.profilePictureUrl = profilePictureUrl;

    // Save the updated contact
    await contact.save();

    res.json({ message: "Contact updated succesfully", contact });
  } catch (error) {
    console.error("Error trying to update the contact:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getContactById = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const contactId = req.params.id;

    // Buscar al usuario y asegurarse de que el contacto pertenezca al usuario
    const user = await User.findById(userId).populate("contacts");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Buscar el contacto por su ID
    const contact = user.contacts.find(
      (contact) => contact._id.toString() === contactId
    );
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json(contact);
  } catch (error) {
    next(error);
  }
};

module.exports = { createContact, getContacts, updateContact, getContactById };
