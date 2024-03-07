import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

// endoints
import crypto from 'crypto'; // encriptación del password
import { UserModel } from '../database/models/userModel';
import { IUser } from '../domain/entities/IUser';

// encriptar password con crypto
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

// create JWT
function jwtToken(username: string) {
  const secretKey = process.env.JWT_SECRET_KEY;
  if (!secretKey) {
    throw new Error('JWT_SECRET_KEY is not defined');
  }
  const token = jwt.sign({ username }, secretKey, {
    expiresIn: process.env.CADUCIDAD_TOKEN
  });
  return token;
}

//---- Endpoint for Login -------------------------
const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const cookie = req.cookies;
  console.log('cookie: ' + cookie);

  const token = jwtToken(username);
  console.log('token: ' + token);

  if (cookie) {
    // verifica si la cookiellamada 'jwtCookie' contiene el token
    if (cookie['jwtCookie'] === token) {
      res.sendFile(process.cwd() + '/public/chat.html');
    }
  } else {
    try {
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

      // Si el usuario existe y la contraseña es correcta: se crea el token, la cookie y manda el json al front
      const token = jwtToken(username);
      console.log('token: ' + token);

      res.cookie('jwtCookie', token, { maxAge: 60 * 60 * 4 }); // almacena el token en una cookie llamada 'jwtToken'
      // httpOnly: true asegura que la cookie no pueda ser accedida o modificada por scripts del lado del cliente, para prevenir ataques de cross-site scripting (XSS).
      // maxAge: 60 * 60 * 4 es el tiempo de vida de 4 horas
      // no se puede crear cookie 'Secure' porque estamos en http y no https

      return res.status(200).json({
        ok: true, // operacion solicitada por el cliente realizada con exito
        user: user,
        token,
        message: 'Login successful'
      });
    } catch (error) {
      res.status(500).send({ message: 'Internal server error', error });
    }
  }
};

//---- Endpoint for register ----------------------
const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body; // desestructuracion del req.body
    const trimmedUsername = username.trim(); // quitamos espacios ppio y final
    const existingUser = await UserModel.findOne({ username: trimmedUsername });

    if (!existingUser && trimmedUsername !== '') {
      const hashedPassword = await encryptPassword(password);
      const newUser = await createUser(trimmedUsername, hashedPassword);

      const message = `User ${newUser.username} has been created successfully`;
      console.log(message);
      // res.status(201).redirect('/index.html');

      res.status(201).send({
        ok: true, // operacion solicitada por el cliente realizada con exito
        message: `User ${newUser.username} has been created successfully`
      });
      return;
    } else {
      res.status(400).send({ message: 'This user already exists' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Internal server error', error });
  }
};
export { login, register };
