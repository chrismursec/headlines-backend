import {model, Schema} from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import IUser from '../interfaces/users/IUser';


const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
    default: new Date(),
  },
});

UserSchema.plugin(uniqueValidator);
const User = model<IUser>('User', UserSchema);
export default User;
