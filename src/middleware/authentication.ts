import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

// Middleware para verificar el token JWT
function authenticationJWT(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const secretKey = process.env.JWT_SECRET_KEY;
  if (!secretKey) {
    throw new Error('SECRET_KEY is not defined');
  }
  // recupera el token de la cookie
  const token = req.cookies.jwtCookie;
  console.log('token authentication: ' + token);

  if (token) {
    let decodedToken = {};

    try {
      decodedToken = jwt.verify(token, secretKey);
      req.body.username = decodedToken;
      console.log('decodedToken: ' + decodedToken);
      console.log('token ok');

      next();
    } catch (error) {
      res.status(401).json({
        status: 401,
        statusMsg: 'Bad Request',
        error: 'token missing or invalid'
      });
      next(error);
    }
  } else {
    // Envía una respuesta 401 indicando que la autenticación es necesaria
    res.status(401).json({
      status: 401,
      statusMsg: 'Unauthorized',
      error: 'Authentication required'
    });
    // next();
  }
}
// Middleware de error
function errorAuth(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err) {
    res
      .status(500)
      .send({ message: 'Error al verificar el token JWT', error: err.message });
  } else {
    next();
  }
}

export { authenticationJWT, errorAuth };
