import { Router } from 'express';
import auth from '../middlewares/auth.js';
import business from '../middlewares/business.js';
import validateRequest from '../middlewares/validateRequest.js';
import CardSchema from '../validations/cardValidation.js';
import {
  createNewCard,
  deleteCard,
  editCard,
  getAllCards,
  getCardById,
  getUserCards,
  likeCard,
} from '../controllers/cardsController.js';

const router = Router();

router.get('/', getAllCards);

router.post('/', auth, business, validateRequest(CardSchema), createNewCard);

router.get('/my-cards', auth, getUserCards);

router.get('/:id', getCardById);

router.put('/:id', auth, validateRequest(CardSchema), editCard);

router.patch('/:id', auth, likeCard);

router.delete('/:id', auth, deleteCard);

export default router;
