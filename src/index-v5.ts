import express, { Request, Response } from 'express';
import cors from 'cors';
import { connectToMongoDB } from './database/connectToMongoDB';
import 'dotenv/config';
import bodyParser from 'body-parser';

// endoints
import crypto from 'crypto'; // encriptación del password
import { UserModel } from './database/models/userModel';
import { IUser } from './domain/entities/IUser';

const app = express();

app.use(
  cors({
    origin: '*',
    credentials: true // Habilita el intercambio de cookies
  })
);

app.use(express.json());
app.use(
  express.static('public', {
    // MIME headers
    setHeaders: (res, path) => {
      if (path.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
        res.setHeader('SameSite', 'None'); // cookie
        res.setHeader('Secure', 'true'); // cookie
      } else if (path.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
      }
    }
  })
);

// para poder pasar el form a body del front
app.use(bodyParser.urlencoded({ extended: true }));

//---------- LOGIN - REGISTER ---------------------
function encryptPassword(password: string): string {
  const secretKey = 'secretCrypto';
  const saltedPassword = secretKey + password;
  const hash = crypto.createHash('sha256').update(saltedPassword).digest('hex');
  return hash;
}

// create User in mongoDB
async function createUser(username: string, password: string) {
  const newUser: IUser = await UserModel.create({ username, password });
  return newUser;
}

//---- Endpoint for Login -------------------------
app.get('/login', (_req: Request, res: Response) => {
  res.sendFile(process.cwd() + '/public/index.html');
}); // para el frontend

app.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await UserModel.findOne({ username });
    if (!user) {
      res.status(400).send({ message: 'Invalid username or password' });
      console.log('invalid username');
      return;
    }

    const encryptedPassword = encryptPassword(password);
    // si los 2 passwords encryptados no coinciden
    if (encryptedPassword !== user.password) {
      res.status(400).send({ message: 'Invalid username or password' });
      console.log('invalid password');
      return;
    }

    // Si el usuario existe y la contraseña es correcta:
    res.redirect('/chat.html'); // response para redireccionar el front al chat
    return;

    // Response para Thunderclient, no es compatible con .redirect del front
    // return res.status(200).json({
    //   ok: true, // operacion solicitada por el cliente realizada con exito
    //   user: user,
    //   message: 'Login successful'
    // });
  } catch (error) {
    res.status(500).send({ message: 'Internal server error', error });
  }
});

//---- Endpoint for register ----------------------
app.get('/register', (_req: Request, res: Response) => {
  res.sendFile(process.cwd() + '/public/register.html');
}); // para el frontend

app.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body; // desestructuracion del req.body
    const trimmedUsername = username.trim(); // quitamos espacios ppio y final
    const existingUser = await UserModel.findOne({ username: trimmedUsername });

    if (!existingUser && trimmedUsername !== '') {
      const hashedPassword = await encryptPassword(password);
      const newUser = await createUser(trimmedUsername, hashedPassword);

      const message = `User ${newUser.username} has been created successfully`;
      console.log(message);

      res.redirect('/index.html');
      return;

      // PARA EL THUNDERCLIENT
      // res.status(201).send({
      //   message: `User ${newUser.username} has been created successfully`
      // });
      // return;
    } else {
      res.status(400).send({ message: 'This user already exists' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Internal server error', error });
  }
});

app.get('/chat', (_req: Request, res: Response) => {
  res.sendFile(process.cwd() + '/public/chatbot.html');
});
// -------------- FIN LOGIN REGISTER ----------------------------

//---------- SERVER - MONGO DBR ------------------------------
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
