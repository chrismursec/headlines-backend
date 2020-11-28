import {Document} from 'mongoose';

interface ISavedItem extends Document{
  owner: string;
  title: string;
  description: string;
  source: string;
  date: Date;
  dateString: string;
  url: string;
  imageUrl: string;
}
export default ISavedItem;
