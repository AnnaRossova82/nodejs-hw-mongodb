import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Session from '../models/Session.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createHttpError(409, 'Email in use');
    }

    const newUser = await User.create({ name, email, password });

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: { name: newUser.name, email: newUser.email }
    });
  } catch (error) {
    next(error);
  }
};
