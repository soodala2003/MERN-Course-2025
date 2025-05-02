import 'express-async-errors';
import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary';

// routers
import jobRouter from './routes/jobRouter.js';
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';

// public
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

// middleware
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
import { authenticateUser } from './middleware/authMiddleware.js';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const app = express();
const port = process.env.PORT || 5100;

const __dirname = dirname(fileURLToPath(import.meta.url));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.static(path.resolve(__dirname, './client/dist')));
//app.use(express.static(path.resolve(__dirname, './public')));
app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/api/v1/test', (req, res) => {
  res.json({ msg: 'test route' });
});

app.use('/api/v1/jobs', authenticateUser, jobRouter);
// authenticateUser:
// when it comes to admin, not only will check for current user
// but will also check whether the user is actually an admin.
app.use('/api/v1/users', authenticateUser, userRouter);
app.use('/api/v1/auth', authRouter);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/dist', 'index.html'));
});

app.use('*', (req, res) => {
  res.status(404).json({ msg: 'not found' });
});

app.use(errorHandlerMiddleware);
/* app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ msg: 'something went wrong' });
}); */

try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`server running on PORT ${port}...`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}

/* app.post('/', (req, res) => {
  console.log(req);
  res.json({ massage: 'data received', data: req.body });
}); */

//import { validateTest } from './middleware/validationMiddleware.js';
//import { body, validationResult } from 'express-validator';

/* app.post(
  '/api/v1/test',
  validateTest, */

/* [
    body('name')
      .notEmpty()
      .withMessage('name is required')
      .isLength({ min: 50 })
      .withMessage('name must be at least 50'),
  ], */
//a function which takes care of the error response
/* (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ errors: errorMessages });
    }
    //console.log(errors.isEmpty());
    next();
  },  */

/* (req, res) => {
    const { name } = req.body;
    res.json({ message: `hello ${name}` });
  }
); */

// GET ALL JOBS
//app.get('/api/v1/jobs');

// CREATE JOB
//app.post('/api/v1/jobs');

// GET SINGLE JOB
//app.get('/api/v1/jobs/:id');

// EDIT JOB
//app.patch('/api/v1/jobs/:id');

// DELETE JOB
//app.delete('/api/v1/jobs/:id');
