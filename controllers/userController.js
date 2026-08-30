import config from 'config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { editUserSchema, registerSchema } from '../validations/userValidation.js';

const JWT_SECRET = config.get('JWT_SECRET');

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({
      message: 'An error occurred while processing your request',
      error: err.message,
    });
  }
};

export const addNewUser = async (req, res) => {
  const { error, value } = registerSchema.validate(req.body);

  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  try {
    const foundUser = await User.findOne({ email: req.body.email });

    if (foundUser) {
      return res.status(409).send({ message: 'email already exists' });
    }

    const user = new User(value);

    const newUser = await user.save();

    const { password, ...userWithoutPassword } = newUser._doc;

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
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body ?? {};

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
};

export const getUserById = async (req, res) => {
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
};

export const editUser = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  if (id !== userId) {
    return res
      .status(403)
      .send({ message: 'You do not have permission to perform this action' });
  }

  const { error, value } = editUserSchema.validate(req.body);

  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  try {
    const user = await User.findByIdAndUpdate(id, value);

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.end();
  } catch (err) {
    res.status(500).send({
      message: 'An error occurred while processing your request',
      error: err.message,
    });
  }
};

export const changeIsBusinessStatus = async (req, res) => {
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
};

export const deleteUser = async (req, res) => {
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
};
