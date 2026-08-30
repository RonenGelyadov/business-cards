import Card from '../models/Card.js';

export const getAllCards = async (req, res) => {
  try {
    const cards = await Card.find();
    res.status(200).send(cards);
  } catch (err) {
    res.status(500).send({
      message: 'An error occurred while processing your request',
    });
  }
};

export const createNewCard = async (req, res) => {
  console.log('req.user.id:', req.user.userId);
  try {
    const foundBizNumber = await Card.findOne({ bizNumber: req.validatedData.bizNumber });

    if (foundBizNumber) {
      return res.status(409).send({ message: 'bizNumber already exists' });
    }

    const card = new Card({ ...req.validatedData, user_id: req.user.userId });
    const newCard = await card.save();

    res.status(200).send({
      message: 'Card created successfully',
      card: newCard,
    });
  } catch (err) {
    res.status(500).send({
      message: 'An error occurred while processing your request',
    });
  }
};

export const getUserCards = async (req, res) => {
  try {
    const userCards = await Card.find({ user_id: req.user.userId });
    res.status(200).send(userCards);
  } catch (err) {
    res.status(500).send({
      message: 'An error occurred while processing your request',
    });
  }
};

export const getCardById = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id).select('-user_id');

    if (!card) {
      return res.status(404).send({ message: 'Card not found' });
    }

    res.status(200).send(card);
  } catch (err) {
    res.status(500).send({
      message: 'An error occurred while processing your request',
    });
  }
};

export const editCard = async (req, res) => {};

export const likeCard = async (req, res) => {};

export const deleteCard = async (req, res) => {};
