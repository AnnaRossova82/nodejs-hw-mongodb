import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import User from '../db/models/User.js';
import Session from '../db/models/Session.js';
import { randomBytes } from 'node:crypto';

const generateTokens = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  return { accessToken, refreshToken };
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(401, 'Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw createHttpError(401, 'Invalid email or password');
    }

    const tokens = generateTokens();

    await Session.findOneAndDelete({ userId: user._id });
    const newSession = await Session.create({
      userId: user._id,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
      refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    console.log('New session created:', newSession);

    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true });
    res.status(200).json({
      status: 200,
      message: 'Successfully logged in a user!',
      data: { accessToken: tokens.accessToken }
    });
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createHttpError(409, 'Email in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: { name: newUser.name, email: newUser.email }
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw createHttpError(401, 'Refresh token not provided');
    }

    const session = await Session.findOne({ refreshToken });
    if (!session || new Date(session.refreshTokenValidUntil) < new Date()) {
      throw createHttpError(401, 'Invalid or expired refresh token');
    }

    const user = await User.findById(session.userId);
    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    const tokens = generateTokens();

    await Session.findByIdAndDelete(session._id); 

    const newSession = await Session.create({
      userId: user._id,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
      refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    console.log('New session created:', newSession);

    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true });
    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken: tokens.accessToken }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw createHttpError(401, 'Refresh token not provided');
    }

    const session = await Session.findOne({ refreshToken });
    if (!session) {
      throw createHttpError(401, 'Invalid refresh token');
    }

    await Session.findByIdAndDelete(session._id);

    res.clearCookie('refreshToken');
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
