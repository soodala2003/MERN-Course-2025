import jwt from 'jsonwebtoken';

export const createJWT = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};
// restart the server
// after changing 'secret' and '1d' into process.env.JWT_SECRET and process.env.JWT_EXPIRES_IN

/* If the JWT is present, then also we want to get the data.
when we create JWT, these are the values that I'm passing in and this is exactly what I want to get back.
because we'll attach this user to request and then of course we can create specific job with user ID and 
also eventually we'll use this role as well. */
export const verifyJWT = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
};
