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
  try {
    const foundBizNumber = await Card.findOne({ bizNumber: req.validatedData.bizNumber });

    if (foundBizNumber) {
      return res.status(409).send({ message: 'bizNumber already exists' });
    }

    const card = new Card({ ...req.validatedData, user_id: req.user.userId });
    const newCard = await card.save();

    res.status(200).send(newCard);
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
    const card = await Card.findById(req.params.id);

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

export const editCard = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  if (id !== userId) {
    return res
      .status(403)
      .send({ message: 'You do not have permission to perform this action' });
  }

  try {
    const card = await Card.findByIdAndUpdate(id, req.validatedData, { new: true });

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

export const likeCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).send({ message: 'Card not found' });
    }

    if (card.likes.includes(req.user.userId)) {
      return res.status(200).send({ message: 'You already liked this card' });
    }

    card.likes = [...card.likes, req.user.userId];
    const newCard = await card.save();
    res.status(200).send(newCard);
  } catch (err) {
    res.status(500).send({
      message: 'An error occurred while processing your request',
    });
  }
};

export const deleteCard = async (req, res) => {
  const { id } = req.params;
  const { userId, isAdmin } = req.user;

  if (id !== userId && !isAdmin) {
    return res
      .status(403)
      .send({ message: 'You do not have permission to perform this action' });
  }

  try {
    const deletedCard = await Card.findByIdAndDelete(id);

    if (!deletedCard) {
      return res.status(404).send({ message: 'Card not found' });
    }

    res.status(200).send(deletedCard);
  } catch (err) {
    res.status(500).send({
      message: 'An error occurred while processing your request',
    });
  }
};
