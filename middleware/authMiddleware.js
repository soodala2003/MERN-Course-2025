import {
  UnauthenticatedError,
  UnauthorizedError,
  BadRequestError,
} from '../errors/customErrors.js';
import { verifyJWT } from '../utils/tokenUtils.js';

/* we restrict the access if the cookie is not present or the JWT is not valid.
And then this user object is going to be available in all of the controllers 
which have this authenticate user middleware sitting in front. 
And of course, in our case, those are all the job controllers. */
export const authenticateUser = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) throw new UnauthenticatedError('authentication invalid');

  try {
    const { userId, role } = verifyJWT(token);
    const testUser = userId === 'testUserId';
    req.user = { userId, role, testUser };
    /* const user = verifyJWT(token);
    console.log(user); */
    next();
  } catch (error) {
    throw new UnauthenticatedError('Unauthorized to access this route');
  }
};

// use the 'rest' operator or 'roles'
// we can gather all of the parameters
// and they will be nicely stored in the array.
export const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError('Unauthorized to access this route');
    }
    //console.log(roles);
    next();
  };
};

//console.log(req.cookies);
/* So effectively once we set up the library as a middleware, 
we'll have access to the cookies property and more specifically,
our cookie. Now remember when we were creating the cookie 
and of course we can see that in the auth controller. 
Well, in my case I went with Token, 
so there should be that token cookie (in authController.js). 
If it's not present, then we want to throw our own custom error. */

export const checkForTestUser = (req, res, next) => {
  if (req.user.testUser) {
    throw new BadRequestError('Demo User. Read Only!');
  }
  next();
};
