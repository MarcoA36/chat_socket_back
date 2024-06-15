// import mongoose from 'mongoose';

// const messageSchema = new mongoose.Schema({
//   content: { type: String, required: true },
//   sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   sent_at: { type: Date, default: Date.now },
// });

// const Message = mongoose.model('Message', messageSchema);
// export default Message;


import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sent_at: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },  // Agregar campo 'read'
});

const Message = mongoose.model('Message', messageSchema);
export default Message;
