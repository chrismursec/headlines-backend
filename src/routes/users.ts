import {Router, Request, Response, NextFunction} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.model';
import IUser from '../interfaces/users/IUser';
import {IAuthenticatedUserResponse} from '../interfaces/users/IAuthenticatedUserResponse';
import checkAuth from '../middleware/check-auth.middleware';
import SavedItem from '../models/SavedItem.model';
import SavedSearch from '../models/SavedSearch.model';


const router: Router = Router();

router.post('/signup', (req: Request, res: Response) => {
  if (!req.body.password) {
    res.status(400).json({
      error: {
        message: 'no password provided',
      },
    });
  }

  User.findOne({username: req.body.username}).then((user) => {
    if (user != null) {
      res.status(400).json({
        error: {
          message: 'Username is taken',
        },
      });
    } else if (user === null) {
      bcrypt.hash(req.body.password, 10).then((hash) => {
        const user: IUser = new User({
          username: req.body.username,
          password: hash,
          createdAt: new Date(),
        });
        user
            .save()
            .then((result) => {
              return res.status(200).json({
                message: 'User Created',
                result: result,
              });
            })
            .catch((err) => {
              console.log('error', err);
              return res.status(500).json({error: err});
            });
      });
    }
  });
});

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  let fetchedUser: IUser;
  User.findOne({username: req.body.username})
      .then((user) => {
        console.log(user);
        if (user != null) {
          fetchedUser = user;
          return bcrypt.compare(req.body.password, user.password);
        } else {
          res.status(401).json({
            message: 'Username or Password incorrect',
          });
          return;
        }
      })
      .then((result) => {
        if (!result) {
          return res.status(401).json({
            message: 'Username or Password incorrect',
          });
        }
        const token: string = jwt.sign(
            {
              username: fetchedUser.username,
              userId: fetchedUser._id,
            },
            process.env.JWT_SECRET!,
            {
              expiresIn: '1h',
            },
        );
        const response: IAuthenticatedUserResponse = {
          token: token,
          expiresIn: 3600,
          userId: fetchedUser._id,
          name: fetchedUser.username,
        };
        return res.status(200).send(response);
      })
      .catch((err) => {
        return res.status(401).json({
          error: err,
        });
      });
});

router.get('/users', (req: Request, res: Response) => {
  User.find().then((users) => {
    res.status(200).json({users: users});
  });
});

router.delete('/users/:id', checkAuth, (req, res, next) => {
  SavedItem.deleteMany({owner: req.userData?.userId})
      .then(() => {
        SavedSearch.deleteMany({owner: req.userData?.userId})
            .then(() => {
              User.deleteOne({_id: req.userData?.userId})
                  .then(() => {
                    return res.status(200).json({
                      message: 'deleted',
                    });
                  });
            });
      });
});


router.put('/password', checkAuth, (req, res, next) => {
  const oldPassword = req.body.oldPassword;
  User.findOne({_id: req.userData!.userId})
      .then((user) => {
        if (user === null) {
          res.status(404).json({
            message: 'User does not exist',
          });
          return;
        }
        return bcrypt.compare(oldPassword, user!.password);
      })
      .then((result) => {
        if (!result) {
          return res.status(401).json({
            message: 'Incorrect Password',
          });
        }
        bcrypt.hash(req.body.newPassword, 10).then((newHashedPassword) => {
          User.updateOne(
              {_id: req.userData!.userId},
              {
                password: newHashedPassword,
              },
          ).then((result) => {
            res.status(200).json({
              message: 'Password Updated',
            });
          });
        });
      });
});

export default router;
