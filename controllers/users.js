import { Router } from 'express';
import { model, Schema } from 'mongoose';
import config from 'config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import guard from '../services/guard.js';

const JWT_SECRET = config.get('JWT_SECRET');

const NameSchema = new Schema({
  first: String,
  middle: String,
  last: String,
});

const ImageSchema = new Schema({
  url: String,
  alt: String,
});

const AddressSchema = new Schema({
  state: { type: String, default: 'not defined' },
  country: String,
  city: String,
  street: String,
  houseNumber: String,
  zip: { type: Number, default: 0 },
});

const UserSchema = new Schema({
  name: NameSchema,
  phone: String,
  email: String,
  password: String,
  image: ImageSchema,
  address: AddressSchema,
  isAdmin: { type: Boolean, default: false },
  isBusiness: Boolean,
  createdAt: { type: Date, default: Date.now },
});

const User = model('users', UserSchema);

const router = Router();

router.get('/', guard, async (req, res) => {});

router.post('/', async (req, res) => {
  const { name, phone, email, password, image, address, isBusiness } = req.body;

  const foundUser = await User.findOne({ email });

  if (foundUser) {
    return res.status(409).send({ message: 'email already exists' });
  }

  const user = new User({
    name: {
      first: name.first,
      middle: name.middle,
      last: name.last,
    },
    phone,
    email,
    password: await bcrypt.hash(password, 10),
    image: {
      url: image.url,
      alt: image.alt,
    },
    address: {
      state: address.state,
      country: address.country,
      city: address.city,
      street: address.street,
      houseNumber: address.houseNumber,
    },
    isBusiness,
  });

  const newUser = await user.save();
  res.status(201).send(newUser);
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const foundUser = await User.findOne({ email });

  if (!foundUser) {
    return res.status(401).send({ message: 'Invalid credentials' });
  }

  const passwordMatch = await bcrypt.compare(password, foundUser.password);

  if (!passwordMatch) {
    return res.status(401).send({ message: 'Invalid credentials' });
  }

  const tokenData = {
    userId: foundUser._id,
    fullName: `${foundUser.name.first} ${foundUser.name.last}`,
    isAdmin: foundUser.isAdmin,
  };

  const token = jwt.sign(tokenData, JWT_SECRET, { expiresIn: '20m' });
  res.status(200).send(token);
});

export default router;
