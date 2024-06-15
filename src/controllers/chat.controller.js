import Contact from '../models/contact.model.js';
import Message from '../models/message.model.js';

export const getInbox = async (req, res) => {
  try {
    const userId = req.user.id;

    // Encuentra los contactos del usuario
    const contacts = await Contact.find({ user_id: userId }).populate('contact_id', 'username profilePicture');

    // Para cada contacto, encuentra el último mensaje y el número de mensajes no leídos
    const conversations = await Promise.all(
      contacts.map(async (contact) => {
        const lastMessage = await Message.findOne({
          $or: [
            { sender_id: userId, receiver_id: contact.contact_id._id },
            { sender_id: contact.contact_id._id, receiver_id: userId }
          ]
        }).sort({ sent_at: -1 });

        const unreadCount = await Message.countDocuments({
          sender_id: contact.contact_id._id,
          receiver_id: userId,
          read: false
        });

        return {
          participant: contact.contact_id,
          lastMessage,
          unreadCount
        };
      })
    );

    // Ordenar las conversaciones por la fecha del último mensaje (más reciente primero)
    conversations.sort((a, b) => {
      const dateA = a.lastMessage ? new Date(a.lastMessage.sent_at) : new Date(0);
      const dateB = b.lastMessage ? new Date(b.lastMessage.sent_at) : new Date(0);
      return dateB - dateA;
    });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el buzón' });
  }
};

export const getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { receiverId } = req.params;

    // Marcar mensajes como leídos solo para el receptor
    await Message.updateMany(
      { sender_id: receiverId, receiver_id: userId, read: false },
      { $set: { read: true } }
    );

    const messages = await Message.find({
      $or: [
        { sender_id: userId, receiver_id: receiverId },
        { sender_id: receiverId, receiver_id: userId }
      ]
    }).sort({ sent_at: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los mensajes' });
  }
};



export const markMessagesAsRead = async (userId, conversationId) => {
  try {
    const result = await Message.updateMany(
      {
        receiver_id: userId,
        sender_id: conversationId,
        read: false,
      },
      { read: true }
    );

    console.log(`Marked messages as read for user ${userId} in conversation with ${conversationId}`);
    return result;
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error; // Puedes manejar el error aquí o dejar que lo maneje el código que llame a esta función
  }
};




export const sendMessage = async (msg) => {
  const { content, sender_id, sender_username, receiver_id } = msg;

  if (!content || !sender_id || !receiver_id) {
    throw new Error('Missing required fields');
  }

  try {
    const message = new Message({
      content,
      sender_id,
      sender_username,
      receiver_id,
      sent_at: new Date()
    });

    const savedMessage = await message.save();
    return savedMessage;
  } catch (error) {
    console.error('Error saving message to DB:', error);
    throw error;
  }
};
