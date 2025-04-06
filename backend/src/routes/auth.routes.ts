import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, me } from '../controllers/auth.controller';
import { validateFields } from '../middleware/validateFields';
import { asyncHandler } from '../middleware/asyncHandler';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

router.post(
  '/register',
  [
    body('name', 'El nombre es obligatorio').not().isEmpty(),
    body('email', 'El email no es válido').isEmail(),
    body('password', 'El password debe tener mínimo 6 caracteres').isLength({
      min: 6,
    }),
    validateFields,
  ],
  asyncHandler(register)
);

router.post(
  '/login',
  [
    body('email', 'El email es obligatorio').isEmail(),
    body('password', 'La contraseña es obligatoria').not().isEmpty(),
    validateFields,
  ],
  asyncHandler(login)
);

router.get('/me', verifyToken, me);

export default router;
