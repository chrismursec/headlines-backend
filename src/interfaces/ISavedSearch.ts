import {Document} from 'mongoose';

interface ISavedSearch extends Document{
  owner: string;
  savedItems: string[];
}
export default ISavedSearch;
