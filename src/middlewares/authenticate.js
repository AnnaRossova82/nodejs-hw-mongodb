
import createHttpError from 'http-errors';
import Session from '../db/models/Session.js';
import User from '../db/models/User.js';

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw createHttpError(401, 'Authorization header not provided');
    }

    const tokenParts = authHeader.split(' ');

    if (tokenParts[0] !== 'Bearer' || tokenParts.length !== 2) {
      throw createHttpError(401, 'Invalid Authorization header format');
    }

    const accessToken = tokenParts[1];

    const session = await Session.findOne({ accessToken });
    if (!session || session.accessTokenValidUntil < Date.now()) {
      throw createHttpError(401, 'Invalid or expired access token');
    }

    const user = await User.findById(session.userId);
    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default authenticate;
