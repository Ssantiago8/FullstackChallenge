const express = require("express");
const { authenticate } = require("../middleware/auth");
const {
  createContact,
  getContacts,
  updateContact,
  getContactById,
} = require("../controllers/contact");

const router = express.Router();

// Route to create a contact with user authenticated
router.post("/create", authenticate, createContact);
// Route to get all contacts for a user
router.get("/getallcontacts", authenticate, getContacts);
// Route to get one contact individually
router.get("/getonecontact/:id", authenticate, getContactById);
// Route to update a contact with user authenticated
router.patch("/updatecontact/:id", authenticate, updateContact);

module.exports = router;
