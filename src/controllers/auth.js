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

const createSession = async (userId) => {
  const tokens = generateTokens();
  const newSession = await Session.create({
    userId,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
  console.log('New session created:', newSession);
  return newSession;
};

const setupResponseSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, { httpOnly: true, secure: true });
  res.cookie('sessionid', session.accessToken, { httpOnly: true, secure: true });
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

    await Session.findOneAndDelete({ userId: user._id });
    const newSession = await createSession(user._id);

    setupResponseSession(res, newSession);
    res.status(200).json({
      status: 200,
      message: 'Successfully logged in a user!',
      data: { accessToken: newSession.accessToken }
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

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw createHttpError(401, 'Refresh token not provided');
    }

    const currentSession = await Session.findOne({ refreshToken });
    if (!currentSession || currentSession.refreshTokenValidUntil < Date.now()) {
      throw createHttpError(401, 'Invalid or expired refresh token');
    }

    const newSession = await createSession(currentSession.userId);

    await Session.findByIdAndDelete(currentSession._id);

    setupResponseSession(res, newSession);

    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken: newSession.accessToken }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      console.log('No refresh token in cookies');
      throw createHttpError(401, 'Refresh token not provided');
    }

    console.log('Refresh token:', refreshToken);
    const session = await Session.findOne({ refreshToken });
    if (!session) {
      console.log('Invalid refresh token');
      throw createHttpError(401, 'Invalid refresh token');
    }

    await Session.findByIdAndDelete(session._id);

    res.clearCookie('refreshToken');
    res.clearCookie('sessionid');
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
