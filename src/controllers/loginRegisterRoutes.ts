import express from 'express';
import { login, register } from './loginRegisterController';
import { authenticationJWT, errorAuth } from '../middleware/authentication';

export const router = express.Router();

router.post('/login', login);
router.post('/register', register);
