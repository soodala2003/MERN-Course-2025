import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  lastName: {
    type: String,
    default: 'lastName',
  },
  location: {
    type: String,
    default: 'my city',
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  avatar: String,
  avatarPublicId: String,
});

/* Method approach:
- please keep in mind, of course it works in any controller where you're getting back that instance.
- the instance method with a name, JSON. 
- .toJSON() method: It allows to convert the result set into JSON object.
- if you're using 'this', which is going to point back to the instance, 
then yes, I strongly suggest using the good old function keyword.*/
UserSchema.methods.toJSON = function () {
  let obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model('User', UserSchema);
