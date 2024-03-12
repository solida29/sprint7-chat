import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

// Middleware para verificar el token JWT
export function authenticationJWT(
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
    //let decodedToken = {};

    try {
      const decodedToken = jwt.verify(token, secretKey);
      req.body.username = decodedToken;

      console.log('decodedToken: ' + decodedToken);

      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        // Redirige al usuario a la página de inicio de sesión si el token ha expirado
        res.redirect('/');
      } else {
        res.status(401).json({
          status: 401,
          statusMsg: 'Bad Request',
          error: 'token missing or invalid'
        });
      }
      next(error);
    }
  } else {
    // Redirige al usuario a la página de inicio de sesión si hay un error
    res.redirect('/');
  }
}

// Middleware de error auth
export function errorAuth(req: Request, res: Response): void {
  res.status(500).redirect('/');
}
