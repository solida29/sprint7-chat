import express, { Request, Response } from 'express';
import cors from 'cors';
import { connectToMongoDB } from './database/connectToMongoDB';
import 'dotenv/config';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { router } from './controllers/loginRegisterRoutes';
import { authenticationJWT } from './middleware/authentication';

const app = express();

//---- MIDDLEWARE -------------------
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

//---- FRONTEND -------------------------
app.get('/', (req: Request, res: Response) => {
  console.log('req.cookies: ' + req.cookies);
  res.sendFile(process.cwd() + '/public/index.html');
});

app.get('/register', (_req: Request, res: Response) => {
  res.sendFile(process.cwd() + '/public/register.html');
});

// app.use('/chat', authenticationJWT);

app.get('/chat', authenticationJWT, (_req: Request, res: Response) => {
  res.sendFile(process.cwd() + '/public/chat.html');
});

//---------- SERVER - MONGO DB ---------------------
const PORT = process.env.PORT || '3000';
const uri = process.env.MONGODB_URI!;

connectToMongoDB(uri!)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server is listening on port ${PORT}, close with ^C`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB or starting the server', error);
    process.exit(1); // el proceso termina debido a un error.
  });
