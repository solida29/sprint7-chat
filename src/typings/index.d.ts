declare namespace Express {
  interface Request {
    authToken: string;
    usingCookies: boolean;
  }
}
