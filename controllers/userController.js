import { StatusCodes } from 'http-status-codes';
import User from '../models/UserModel.js';
import Job from '../models/JobModel.js';
import cloudinary from 'cloudinary';
import { promises as fs } from 'fs'; //file system module

// to get the info about the actual user,
// username:  running every time user navigates to the dashboard.
export const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  const userWithoutPassword = user.toJSON();
  res.status(StatusCodes.OK).json({ user: userWithoutPassword });
  //res.status(StatusCodes.OK).json({ msg: 'get current user' });
};

export const getApplicationStats = async (req, res) => {
  const users = await User.countDocuments();
  const jobs = await Job.countDocuments();
  res.status(StatusCodes.OK).json({ users, jobs });
};
export const updateUser = async (req, res) => {
  //console.log(req.file);
  //const obj = { ...req.body };
  //delete obj.password;
  const newUser = { ...req.body };
  delete newUser.password;

  if (req.file) {
    const response = await cloudinary.v2.uploader.upload(req.file.path);
    //it returns an object
    await fs.unlink(req.file.path);
    newUser.avatar = response.secure_url;
    newUser.avatarPublicId = response.public_id;
  }

  //updatedUser has the old user(old instance) before the update
  const updatedUser = await User.findByIdAndUpdate(req.user.userId, newUser);
  // if req.file is present && whether there is an existing image on the cloudinary
  if (req.file && updatedUser.avatarPublicId) {
    await cloudinary.v2.uploader.destroy(updatedUser.avatarPublicId);
  }

  res.status(StatusCodes.OK).json({ msg: 'update user' });
};
/* //to show password
  const updatedUser = await User.findByIdAndUpdate(req.user.userId, req.body);
  console.log(updatedUser); */
