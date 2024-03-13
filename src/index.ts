import express, { Request, Response } from 'express';
import cors from 'cors';
import { connectToMongoDB } from './database/connectToMongoDB';
import 'dotenv/config';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { router } from './controllers/loginRegisterRoutes';
import { authenticationJWT } from './middleware/authentication';

// para el server socket
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { Socket } from 'socket.io'; // type de socket

const app = express();

//---------- MIDDLEWARE --------------------------
// Se utiliza CORS primero para permitir las solicitudes de origen cruzado.
app.use(
  cors({
    origin: '*', // abierto a todos los puertos ¡OJO! A cambiar en produccion
    credentials: true // Habilita el intercambio de cookies
  })
);
app.use(express.json()); // analiza los cuerpos de las solicitudes entrantes en un formato JSON.
app.use(bodyParser.urlencoded({ extended: true })); // para poder pasar el form a body del front, analiza las solicitudes entrantes (body) en formato URL-encoded.
app.use(cookieParser()); // analizar las cookies adjuntas a la solicitud del cliente.

// servir archivos estáticos del frontend
app.use(
  express.static('public', {
    // MIME headers
    setHeaders: (res, path) => {
      if (path.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
        // res.setHeader('SameSite', 'None'); // cookie
        // res.setHeader('Secure', 'true'); // cookie
      } else if (path.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
      }
    }
  })
);

// Rutas
app.use('/', router); // path-routes de register-login

//---------- FRONTEND ----------------------------
app.get('/', (req: Request, res: Response) => {
  console.log('req.cookies: ' + req.cookies);
  res.sendFile(process.cwd() + '/public/index.html');
});

app.get('/register', (_req: Request, res: Response) => {
  res.sendFile(process.cwd() + '/public/register.html');
});

app.get('/chat', authenticationJWT, (_req: Request, res: Response) => {
  res.sendFile(process.cwd() + '/public/chat.html');
});

//---------- SOCKET-IO -----------------------------

// server socket-io
const server = createServer(app);
const io = new SocketServer(server, {
  cors: { origin: '*' },
  connectionStateRecovery: {}
});

// type Salida = null | undefined | '';

io.on('connection', (socket: Socket) => {
  console.log('A user is connected with id: ' + socket.id);

  // El usuario se une a la sala 'global-room' por defecto
  socket.join('global-room');
  console.log(socket.rooms);

  socket.on(
    'chat-message',
    (username: string, message: string, room: string) => {
      // io.emit('chat-message', username, message); // para comunicar con todos
      if (room === '' || room === 'global-room') {
        room = 'global-room';
        io.to(room).emit('chat-message', username, message);
      } else {
        io.to(room).emit('chat-message', username, message);
      }

      console.log(
        `username: ${username} ha escrito: '${message}' en la room: ${room}`
      );
      console.log(socket.rooms);
    }
  );

  socket.on('join-room', (room) => {
    // borramos el ultimo elemento del set socket.rooms saliendo de la ultima sala donde esta el user
    const oldRooms = new Set(socket.rooms);
    oldRooms.forEach((lastRoom) => {
      if (lastRoom !== socket.id && lastRoom !== room) {
        socket.leave(lastRoom);
      }
    });

    // si room está vacio lo susituimos por global-room
    if (room === '') {
      room = 'global-room';
      socket.join(room);
    }
    socket.join(room);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

//---------- SERVER - MONGO DB ---------------------
const PORT = process.env.PORT || '3000';
const uri = process.env.MONGODB_URI!;

connectToMongoDB(uri!)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`✅ Server is listening on port ${PORT}, close with ^C`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB or starting the server', error);
    process.exit(1); // el proceso termina debido a un error.
  });
