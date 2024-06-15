
import { sendMessage } from "../controllers/chat.controller.js";
import { addContact } from "../controllers/users.controller.js";
// import { sendMessage } from "../controllers/chat.controller.js";

const users = {};

export function chatSocket(socket, io) {
  console.log(`Cliente conectado: ${socket.id}`);

  
  socket.on('user_connected', (userId) => {
    users[userId] = socket.id;
    console.log(`Usuario ${userId} conectado con el socket ID ${socket.id}`);
  });
  
  socket.on('client:message', async (msg, callback) => {
    try {
      const savedMessage = await sendMessage(msg);
      const receiverSocketId = users[msg.receiver_id];
  
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('server:message', savedMessage);
      }
  
      callback({ success: true, message: savedMessage });
    } catch (error) {
      callback({ success: false, error: 'Failed to save message' });
    }
  });
  



  // socket.on('mark_messages_as_read', async ({ userId, conversationId }) => {
  //   try {
  //     await markMessagesAsRead(userId, conversationId);
  //     console.log(`Marked messages as read for user ${userId} in conversation with ${conversationId}`);
  //   } catch (error) {
  //     console.error('Error marking messages as read:', error);
  //   }
  // });

  socket.on('addContact', async ({ userId, contact }) => {
    try {
      const response = await addContact(userId, contact);
      socket.emit('contactAdded', response);
    } catch (error) {
      console.error('Error al agregar contacto:', error);
      socket.emit('error', 'Error al agregar contacto');
    }
  });

  socket.on('disconnect', () => {
    for (const [userId, socketId] of Object.entries(users)) {
      if (socketId === socket.id) {
        delete users[userId];
        break;
      }
    }
    console.log(`Cliente desconectado: ${socket.id}`);
  });
}
