import { StatusCodes } from 'http-status-codes';
import Job from '../models/JobModel.js';
import mongoose from 'mongoose';
import day from 'dayjs';

//import { NotFoundError } from '../errors/customErrors.js';

// We're not working anymore with the local array
/* import { nanoid } from 'nanoid';

let jobs = [
  { id: nanoid(), company: 'apple', position: 'front-end' },
  { id: nanoid(), company: 'google', position: 'back-end' },
]; */

/* And once the authenticate user middleware is in place.
Now let's use the user ID to get only the jobs that belong to a specific user. */

export const getAllJobs = async (req, res) => {
  //console.log(req.query);
  //console.log(req.user);
  const { search, jobStatus, jobType, sort } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
    /* jobStatus, => {"jobs": []}*/
  };

  if (search) {
    //queryObject.position = req.query.search;
    queryObject.$or = [
      { position: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
    ];
  }

  if (jobStatus && jobStatus !== 'all') {
    queryObject.jobStatus = jobStatus;
  }
  if (jobType && jobType !== 'all') {
    queryObject.jobType = jobType;
  }

  const sortOptions = {
    newest: '-createdAt',
    oldest: 'createdAt',
    'a-z': 'position',
    'z-a': '-position',
  };

  const sortKey = sortOptions[sort] || sortOptions.newest;

  // setup pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const jobs = await Job.find(queryObject)
    .sort(sortKey)
    .skip(skip)
    .limit(limit);

  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);
  res
    .status(StatusCodes.OK)
    .json({ totalJobs, numOfPages, currentPage: page, jobs });
  //-createdAt: descending order, the most recent date
  //const jobs = await Job.find(queryObject).sort('-createdAt');
  //const jobs = await Job.find(queryObject);
  /* const jobs = await Job.find({
    createdBy: req.user.userId,
    position: req.query.search,
  }); */
};

//console.log(req);
//const jobs = await Job.find({});

export const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};
/* const { company, position } = req.body;
  const job = await Job.create({ company, position }); */

/* if (!company || !position) {
    return res.status(400).json({ msg: 'please provide company and position' });
  }
  const id = nanoid(10);
  const job = { id, company, position };
  jobs.push(job); */

export const getJob = async (req, res) => {
  const job = await Job.findById(req.params.id);
  res.status(StatusCodes.OK).json({ job });
};
//const { id } = req.params;
//const job = await Job.findById(id);
//const job = jobs.find((job) => job.id === id);

//if (!job) throw new NotFoundError(`no job with id ${id}`);
// => It's moved into the line 50 in validationMiddleware.js

//return res.status(404).json({ msg: `no job with id ${id}` });

export const updateJob = async (req, res) => {
  const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(StatusCodes.OK).json({ msg: 'job modified', job: updatedJob });
};

/* const { id } = req.params;
const { company, position } = req.body;
if (!company || !position) {
  return res.status(400).json({ msg: 'please provide company and position' });
}
 */
//const job = jobs.find((job) => job.id === id);

//if (!updatedJob) throw new NotFoundError(`no job with id ${id}`);
// => It's moved into the line 50 in validationMiddleware.js

/* {
    return res.status(404).json({ msg: `no job with id ${id}` });
  } */

/*   job.company = company;
  job.position = position; */

export const deleteJob = async (req, res) => {
  const removedJob = await Job.findByIdAndDelete(req.params.id);
  res.status(StatusCodes.OK).json({ msg: 'job deleted', job: removedJob });
};
//const { id } = req.params;
//const job = jobs.find((job) => job.id === id);
//console.log(removedJob);

//if (!removedJob) throw new NotFoundError(`no job with id ${id}`);
// => It's moved into the line 50 in validationMiddleware.js

/* {
    return res.status(404).json({ msg: `no job with id ${id}` });
  } */

/* const newJobs = jobs.filter((job) => job.id !== id);
  jobs = newJobs; */

export const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: '$jobStatus', count: { $sum: 1 } } },
  ]);
  //console.log(stats);

  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});
  //console.log(stats);

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
  ]);
  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;

      const date = day()
        .month(month - 1)
        .year(year)
        .format('MMM YY');
      return { date, count };
    })
    .reverse();

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
  //res.send('stats');
};

/* let monthlyApplications = [
    {
      date: 'May 24',
      count: 12,
    },
    {
      date: 'Jun 24',
      count: 9,
    },
    {
      date: 'Jul 24',
      count: 3,
    },
  ]; */
