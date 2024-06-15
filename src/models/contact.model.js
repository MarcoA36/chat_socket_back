import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contact_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
