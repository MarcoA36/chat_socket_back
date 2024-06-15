import app from './app.js';
import { connectDB } from './db.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { chatSocket } from './sockets/chat.socket.js';



const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  }
});

io.on('connection', (socket) => chatSocket(socket, io));
connectDB();

server.listen(3001, () => {
  console.log('corriendo en el puerto', 3001);
});
