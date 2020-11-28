import {model, Schema} from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import ISavedSearch from '../interfaces/ISavedSearch';

const SavedSearchSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  savedItems: {
    type: [String],
    required: true,
  },
});

SavedSearchSchema.plugin(uniqueValidator);

const SavedSearch = model<ISavedSearch>('SavedSearch', SavedSearchSchema);
export default SavedSearch;
