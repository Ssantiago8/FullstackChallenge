const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Contact = require("../models/Contact");
require("dotenv").config();

// Create a new contact
const createContact = async (req, res, next) => {
  try {
    const { name, address, email, phoneNumber, profilePictureUrl } = req.body;
    const userId = req.user._id; // Assumes req.user contains the authenticated user information

    // Create the contact
    const contact = await Contact.create({
      name,
      address,
      email,
      phoneNumber,
      profilePictureUrl,
      user: userId,
    });

    // Add contact ID to the user's contacts array
    await User.findByIdAndUpdate(userId, { $push: { contacts: contact._id } });

    res.status(201).json({ message: "Contact created succesfully", contact });
    console.log("Contact created succesfully", contact);
  } catch (error) {
    next(error);
  }
};

// Get all contacts for a user
const getContacts = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const user = await User.findById(userId).populate("contacts");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const allContacts = user.contacts;
    const totalCount = allContacts.length;
    const totalPages = Math.ceil(totalCount / pageSize);

    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalCount);
    const contactsToShow = allContacts.slice(startIndex, endIndex);

    // Build response
    const response = {
      contacts: contactsToShow,
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

// Update a contact
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

// Get a contact by ID
const getContactById = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const contactId = req.params.id;

    // Find the user and ensure the contact belongs to the user
    const user = await User.findById(userId).populate("contacts");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the contact by its ID
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
