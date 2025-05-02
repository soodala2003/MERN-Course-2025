import { Router } from 'express';
const router = Router();

import {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  showStats,
} from '../controllers/jobController.js';
import {
  validateJobInput,
  validateIdParam,
} from '../middleware/validationMiddleware.js';
import { checkForTestUser } from '../middleware/authMiddleware.js';

//app.use('/api/v1/jobs', jobRouter);
// '/' => '/api/v1/jobs'
//router.get('/', getAllJobs)
//router.post('/', createJob)

router
  .route('/')
  .get(getAllJobs)
  .post(checkForTestUser, validateJobInput, createJob);

/* We want to place stats before the ID because otherwise 
if you place it after Express is just going to think 
that stats is the ID that we're passing in.
Since express reads top to bottom */
router.route('/stats').get(showStats);

router
  .route('/:id')
  .get(validateIdParam, getJob)
  .patch(checkForTestUser, validateJobInput, validateIdParam, updateJob)
  .delete(checkForTestUser, validateIdParam, deleteJob);

export default router;
