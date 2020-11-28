import {Document} from 'mongoose';

interface IUser extends Document{
 username: string;
 password: string;
 createdAt: Date;
};

export default IUser;
