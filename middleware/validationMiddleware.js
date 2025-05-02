import { body, param, validationResult } from 'express-validator';
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '../errors/customErrors.js';
import { JOB_STATUS, JOB_TYPE } from '../utils/constants.js';
import mongoose from 'mongoose';
import Job from '../models/JobModel.js';
import User from '../models/UserModel.js';

// Create validate test with the values to validate
// and a function which takes care of the error response.
const withValidationErrors = (validateValues) => {
  return [
    // if we want to group them together, we essentially set up an array
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        if (errorMessages[0].startsWith('no job')) {
          throw new NotFoundError(errorMessages);
        }
        if (errorMessages[0].startsWith('not authorized')) {
          throw new UnauthorizedError('not authorized to access this route');
        }
        throw new BadRequestError(errorMessages);
      }
      next();
    },
  ];
};

export const validateJobInput = withValidationErrors([
  body('company').notEmpty().withMessage('company is required'),
  body('position').notEmpty().withMessage('position is required'),
  body('jobLocation').notEmpty().withMessage('job location is required'),
  body('jobStatus')
    .isIn(Object.values(JOB_STATUS))
    .withMessage('invalid status value'),
  body('jobType')
    .isIn(Object.values(JOB_TYPE))
    .withMessage('invalid type value'),
]);

/* export const validateTest = withValidationErrors([
  body('name')
    .notEmpty()
    .withMessage('name is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('name must be between 3 and 50 characters long')
    .trim(),
]); */

// remove NotFoundError from getJob, updateJob, deleteJob controllers
export const validateIdParam = withValidationErrors([
  param('id').custom(async (value, { req }) => {
    const isValidId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidId) throw new BadRequestError('invalid MongoDB id');
    // BadRequestError and Error are the same...
    //if (!isValidId) throw new Error('invalid MongoDB id');
    const job = await Job.findById(value);
    if (!job) throw new NotFoundError(`no job with id ${value}`);
    const isAdmin = req.user.role === 'admin';
    const isOwner = req.user.userId === job.createdBy.toString();
    if (!isAdmin && !isOwner)
      throw new UnauthorizedError('not authorized to access this route');
  }),
]);

/* .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('invalid MongoDB id'), */
// if we return true, then everything is find, we pass it on the controller
// if not, if it returns false, then you'll see the error message.

/* {
      //return true;
      // => "msg": "no job with id 680be8af5c42176a7ca5212d"
      //return false;
      // => invoke this whole validation setup, and then it'll send back the error with invalid MongoDB
      // "msg": "invalid MongoDB id"
    }) */

export const validateRegisterInput = withValidationErrors([
  body('name').notEmpty().withMessage('name is required'),
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invalid email format')
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new BadRequestError('email already exists');
      }
    }),
  body('password')
    .notEmpty()
    .withMessage('password is required')
    .isLength({ min: 8 })
    .withMessage('password must be at least 8 characters long'),
  body('lastName').notEmpty().withMessage('last name is required'),
  body('location').notEmpty().withMessage('location is required'),
]);

export const validateLoginInput = withValidationErrors([
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invalid email format'),
  body('password').notEmpty().withMessage('password is required'),
]);

export const validateUpdateUserInput = withValidationErrors([
  body('name').notEmpty().withMessage('name is required'),
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invalid email format')
    .custom(async (email, { req }) => {
      const user = await User.findOne({ email });
      //console.log(user); //peter@gmail.com
      //console.log(user._id.toString()); //peter's id
      //console.log(req); //current user => john
      //console.log(req.user.userId); //john's id
      //authenticateUser => req.user

      //user._id.toString() !== req.user.userId
      // :if I'm sending in some kind of email address,
      // I'm checking for other users
      // and whether they are not already using this email address.
      if (user && user._id.toString() !== req.user.userId) {
        throw new BadRequestError('email already exists');
      }
    }),
  body('lastName').notEmpty().withMessage('last name is required'),
  body('location').notEmpty().withMessage('location is required'),
]);
