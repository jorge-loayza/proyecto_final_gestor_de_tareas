import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) {
      res.status(400).json({ message: 'Usuario ya registrado' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'Usuario registrado con éxito' });
    return;
  } catch (err) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Credenciales inválidas' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(400).json({ message: 'Credenciales inválidas' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || '', {
      expiresIn: '2h',
    });
    res.json({ message: 'Login exitoso', token });
  } catch {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const me = async (req: Request & { userId?: string }, res: Response) => {
  const user = await User.findById(req.userId).select('-password');
  res.json(user);
};
