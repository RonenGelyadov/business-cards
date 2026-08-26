import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import config from 'config';
import mongoose from 'mongoose';
import cors from 'cors';
import UsersRouter from './routes/users.js';
import CardsRouter from './routes/cards.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = config.get('PORT');
const DB_URL = config.get('DATABASE.URL');

await mongoose.connect(DB_URL);
console.log('mongodb connected');

const server = express();

server.use(express.static('public'));
server.use(express.json());

server.use(
  cors({
    origin: true,
    credentials: true,
    methods: 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  }),
);

server.use('/users', UsersRouter);
server.use('/cards', CardsRouter);

server.get('/', (req, res) => {
  res.send({ message: 'Welcome to Business Cards' });
});

server.use((req, res) => {
  res.status(404).sendFile(__dirname + '/public/404.html');
});

server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
