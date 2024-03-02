import { Socket } from 'socket.io';
import { Server as SocketServer } from 'socket.io';
import { createServer } from 'node:http';

const server = createServer(app);

/*
-------------- SOCKET IO ----------------------------
*/
const io = new SocketServer(server, {
  connectionStateRecovery: {
    // handle disconnections
    // valores predeterminados
    maxDisconnectionDuration: 2 * 60 * 1000, // duración máxima de desconexión (2min)
    skipMiddlewares: true // omitir middlewares
  }
});
// io es global
io.on('connection', (socket: Socket) => {
  console.log('A user connected');
  console.log('socket.recovered: ' + socket.recovered); // si el estado-los msg fueron recuperados (true) o no (false)
  console.log('user socket.id: ' + socket.id); // id user

  socket.on('chat-message', (msg, room) => {
    if (room === '') {
      io.emit('chat-message', `id ${socket.id}: ${msg}`); // to send message to everyone connected with socket.emit()
    } else {
      socket.to(room).emit('chat-message', `id ${socket.id}: ${msg}`);
    }
    console.log('room: ' + room);
    console.log('message: ' + msg);
  });

  socket.on('join-room', (room, joinedMessage) => {
    socket.join(room);
    joinedMessage(`✅ Joined ${room} room`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
