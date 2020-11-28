import express, {Request, Response} from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import config from './config/keys';
import userRoute from './routes/users';
import newsRoute from './routes/news';
const app = express();

app.set('port', config.PORT || 3000);

mongoose
    .connect(config.MONGODB_URI!, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
    .then(() => {
      console.log('Connected to mongo');
    })
    .catch((err) => {
      console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
      process.exit();
    });
app.use(cors());
app.use(express.json());
app.use('/api/auth', userRoute);
app.use('/api/news', newsRoute);
export default app;
