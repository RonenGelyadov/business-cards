import config from 'config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = config.get('JWT_SECRET');
