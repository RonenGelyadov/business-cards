import { Router } from 'express';
import auth from '../middlewares/auth.js';
import admin from '../middlewares/admin.js';
import validateRequest from '../middlewares/validateRequest.js';
import {
  editUserSchema,
  loginSchema,
  registerSchema,
} from '../validations/userValidation.js';
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

router.post('/', validateRequest(registerSchema), addNewUser);

router.post('/login', validateRequest(loginSchema), loginUser);

router.get('/:id', auth, getUserById);

router.put('/:id', auth, validateRequest(editUserSchema), editUser);

router.patch('/:id', auth, changeIsBusinessStatus);

router.delete('/:id', auth, deleteUser);

export default router;
