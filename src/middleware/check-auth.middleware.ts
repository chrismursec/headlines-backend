import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import IUserAuth from '../interfaces/users/IUserAuth';
import config from '../config/keys';

export default (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers.authorization!.split(' ')[1];
    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userData: IUserAuth = {username: decodedToken.username, userId: decodedToken.userId};
    req.userData = userData;
    next();
  } catch (error) {
    res.status(401).json({message: 'Auth Failed'});
  }
};
