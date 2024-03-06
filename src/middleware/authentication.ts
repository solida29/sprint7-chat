import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const secretKey = process.env.SEED_AUTENTICACION;
if (!secretKey) {
  throw new Error('SECRET_KEY is not defined');
}

// Middleware para verificar el token JWT
export const authenticationJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token: string = req.body.cookies.jwtToken;
  if (token) {
    try {
      const decodedToken = jwt.verify(token, secretKey);
      req.body.user = decodedToken;
      next();
    } catch (error) {
      res.status(400).json({
        status: 400,
        statusMsg: 'Bad Request',
        error: 'token missing or invalid'
      });
      next(error);
    }
  } else {
    next();
  }
};
// Middleware de error
export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err) {
    res
      .status(500)
      .send({ message: 'Error al verificar el token JWT', error: err.message });
  } else {
    next();
  }
};
