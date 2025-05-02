import { StatusCodes } from 'http-status-codes';
import User from '../models/UserModel.js';
import { comparePassword, hashPassword } from '../utils/passwordUtils.js';
import { UnauthenticatedError } from '../errors/customErrors.js';
import { createJWT } from '../utils/tokenUtils.js';
//import bcrypt from 'bcryptjs'; <= move it into '../utils/passwordUtils.js'

export const register = async (req, res) => {
  const isFirstAccount = (await User.countDocuments()) === 0;
  req.body.role = isFirstAccount ? 'admin' : 'user';

  const hashedPassword = await hashPassword(req.body.password);
  req.body.password = hashedPassword;
  /* const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt); */

  const user = await User.create(req.body);
  res.status(StatusCodes.CREATED).json({ msg: 'user created', user });
  //res.send('register');
};

export const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  // Refactor
  const isValidUser =
    user && (await comparePassword(req.body.password, user.password));
  if (!isValidUser) throw new UnauthenticatedError('invalid credentials');

  /* if (!user) throw new UnauthenticatedError('invalid credentials');
  const isPasswordCorrect = await comparePassword(
    req.body.password,
    user.password
  );
  if (!isPasswordCorrect) throw new UnauthenticatedError('invalid credentials'); */

  const token = createJWT({ userId: user._id, role: user.role });

  // cookies expiration date is the same with the JWT expiration day
  // cookies expiration date is with milliseconds unit
  const oneDay = 1000 * 60 * 60 * 24;

  // to create a cookie
  // now(): number
  // Returns the number of milliseconds elapsed
  // since midnight, January 1, 1970 Universal Coordinated Time (UTC).
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
  });
  // to set up a cookie
  res.status(StatusCodes.OK).json({ msg: 'user logged in' });

  // just to see the token
  //res.json({ token });
  //res.send('login');
};

export const logout = (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: 'user logged out' });
};
