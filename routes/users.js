import { Router } from 'express';
import auth from '../middlewares/auth.js';
import admin from '../middlewares/admin.js';
import {
  addNewUser,
  changeIsBusinessStatus,
  deleteUser,
  editUser,
  getAllUsers,
  getUserById,
  loginUser,
} from '../controllers/userController.js';

const router = Router();

router.get('/', auth, admin, getAllUsers);

router.post('/', addNewUser);

router.post('/login', loginUser);

router.get('/:id', auth, getUserById);

router.put('/:id', auth, editUser);

router.patch('/:id', auth, changeIsBusinessStatus);

router.delete('/:id', auth, deleteUser);

export default router;
