import express from 'express';
import config from 'config';
import mongoose from 'mongoose';
import cors from 'cors';
import UsersRouter from './routes/users.js';
import CardsRouter from './routes/cards.js';

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
  res.send({ message: 'Welcome to Business Cards. For more information: /info.txt' });
});

server.use((req, res) => {
  res.status(404).send({
    error: 'Not Found',
    message: `The requested resource '${req.url}' was not found on this server. For more information: /info.txt`,
  });
});

server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
