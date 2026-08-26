import { Router } from 'express';
import config from 'config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middlewares/auth.js';
import admin from '../middlewares/admin.js';

const JWT_SECRET = config.get('JWT_SECRET');

const router = Router();

router.get('/', auth, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({
      message: 'An error occurred while processing your request',
      error: err.message,
    });
  }
});

router.post('/', async (req, res) => {
  const { name, phone, email, password, image, address, isBusiness } = req.body;

  try {
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

    const { password: _, ...userWithoutPassword } = newUser._doc;

    res.status(200).send({
      message: 'User created successfully',
      user: userWithoutPassword,
    });
  } catch (err) {
    res.status(500).json({
      message: 'An error occurred while processing your request',
      error: err.message,
    });
  }
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
    isBusiness: foundUser.isBusiness,
    isAdmin: foundUser.isAdmin,
  };

  const token = jwt.sign(tokenData, JWT_SECRET, { expiresIn: '20m' });
  res.status(200).send({ token });
});

router.get('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { userId, isAdmin } = req.user;

  if (id !== userId && !isAdmin) {
    return res
      .status(403)
      .send({ message: 'You do not have permission to perform this action' });
  }

  try {
    const user = await User.findById(id).select('-password');

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.status(200).send(user);
  } catch (err) {
    res.status(500).send({
      message: 'An error occurred while processing your request',
      error: err.message,
    });
  }
});

router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;
});

router.patch('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;
  const { isBusiness } = req.body ?? {};

  if (id !== userId) {
    return res
      .status(403)
      .send({ message: 'You do not have permission to perform this action' });
  }

  if (isBusiness === undefined) {
    return res.status(400).send({ message: 'You must provide isBusiness value' });
  }

  try {
    const foundUser = await User.findById(id);

    if (!foundUser) {
      return res.status(404).send({ message: 'User not found' });
    }

    foundUser.isBusiness = isBusiness;

    const editedUser = await foundUser.save();

    const { password: _, ...userWithoutPassword } = editedUser._doc;

    res.status(200).send({
      message: 'User updated successfully',
      user: userWithoutPassword,
    });
  } catch (err) {
    res.status(500).send({
      message: 'An error occurred while processing your request',
      error: err.message,
    });
  }
});

router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { userId, isAdmin } = req.user;

  if (id !== userId && !isAdmin) {
    return res
      .status(403)
      .send({ message: 'You do not have permission to perform this action' });
  }

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.status(200).send({
      message: 'User deleted successfully',
      deletedUser,
    });
  } catch (err) {
    res.status(500).send({
      message: 'An error occurred while processing your request',
      error: err.message,
    });
  }
});

export default router;
