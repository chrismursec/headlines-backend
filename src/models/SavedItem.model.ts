import {model, Schema} from 'mongoose';
import ISavedItem from '../interfaces/ISavedItem';

const SavedItemSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  dateString: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },

});


const SavedItem = model<ISavedItem>('SavedItem', SavedItemSchema);
export default SavedItem;
