// import Contact from "../models/contact.model.js";
// import User from "../models/user.model.js";

// export const addContact = async (req, res) => {
//   const { userId, contact } = req.body;
//   try {
//     const contactUser = await User.findOne({ username: contact });

//     if (contactUser) {
//       const newContact = new Contact({
//         user_id: userId,
//         contact_id: contactUser._id,
//       });
//       await newContact.save();
//       return res.status(200).json({ success: true, message: `Contact ${contact} added successfully` });
//     } else {
//       return res.status(404).json({ success: false, message: `No user found with the username ${contact}` });
//     }
//   } catch (error) {
//     console.error("Error adding contact:", error);
//     return res.status(500).json({ success: false, message: "Error adding contact" });
//   }
// };

// // Controlador para obtener los contactos de un usuario
// export const getUsers = async (req, res) => {
//   const userId = req.query.userId;

//   if (!userId) {
//     return res.status(400).json({ message: "Missing userId parameter" });
//   }

//   try {
//     const contacts = await Contact.find({ user_id: userId }).populate('contact_id');

//     if (contacts.length === 0) {
//       return res.status(404).json({ message: "No contacts found" });
//     }

//     const userDetails = contacts.map(contact => contact.contact_id);

//     res.status(200).json(userDetails);
//   } catch (error) {
//     console.error("Error getting users:", error);
//     res.status(500).json({ message: "Error getting users" });
//   }
// };






import Contact from "../models/contact.model.js";
import User from "../models/user.model.js";
import mongoose from 'mongoose';

// export const addContact = async (req, res) => {
//   const { userId, contact } = req.body;
//   try {
//     const contactUser = await User.findOne({ username: contact });

//     if (contactUser) {
//       const newContact = new Contact({
//         user_id: mongoose.Types.ObjectId(userId),
//         contact_id: contactUser._id,
//       });
//       await newContact.save();
//       return res.status(200).json({ success: true, message: `Contact ${contact} added successfully` });
//     } else {
//       return res.status(404).json({ success: false, message: `No user found with the username ${contact}` });
//     }
//   } catch (error) {
//     console.error("Error adding contact:", error);
//     return res.status(500).json({ success: false, message: "Error adding contact" });
//   }
// };




export const addContact = async (req, res) => {
  const { userId, contact } = req.body;
  try {
    const contactUser = await User.findOne({ username: contact });

    if (contactUser) {
      const newContact = new Contact({
        user_id: new mongoose.Types.ObjectId(userId), // Corregido aquí
        contact_id: new mongoose.Types.ObjectId(contactUser._id), // Corregido aquí
      });
      await newContact.save();
      return res.status(200).json({ success: true, message: `Contact ${contact} added successfully` });
    } else {
      return res.status(404).json({ success: false, message: `No user found with the username ${contact}` });
    }
  } catch (error) {
    console.error("Error adding contact:", error);
    return res.status(500).json({ success: false, message: "Error adding contact" });
  }
};


// Controlador para obtener los contactos de un usuario
export const getUsers = async (req, res) => {
  const userId = req.query.userId;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid userId" });
  }

  try {
    const contacts = await Contact.find({ user_id: userId }).populate('contact_id');

    if (contacts.length === 0) {
      return res.status(404).json({ message: "No contacts found" });
    }

    const userDetails = contacts.map(contact => contact.contact_id);

    res.status(200).json(userDetails);
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({ message: "Error getting users" });
  }
};

