import { Request, Response, NextFunction } from 'express';

// Para extraer el token de la cookie o del header
function accessToken(req: Request, res: Response, next: NextFunction) {
  const cookies = req.signedCookies;
  const accessToken = cookies.accessToken; // la auth en la cookie o en el header (abajo)
  // const refreshToken = cookies.refreshToken;

  if (!accessToken) {
    // Bearer [TOKEN] - del header
    const headerAuthToken = ((req.header('Authorization') as string) || '')
      .split(' ')
      .pop();

    if (headerAuthToken) {
      req.authToken = headerAuthToken;
    }
  } else {
    req.usingCookies = true;
    req.authToken = accessToken;
  }

  next();
}

// sería authenticationJWT aquí
function validAccess(token: string) {
  return token;
}

function auth(req: Request, res: Response, next: NextFunction) {
  const authToken = req.authToken;

  if (!validAccess(authToken)) {
    //check for refresh token
    res.status(401);
    next(new Error('Unauthorized'));
    return;
  }

  next();
}

export { accessToken, auth };
