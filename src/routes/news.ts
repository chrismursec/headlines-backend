import {strict} from 'assert';
import {table} from 'console';
import {Router, Request, Response, NextFunction} from 'express';
import {getNewsByCategory, getNewsBySearchTerm, getTopHeadlines} from '../helpers/news';
import ISavedItem from '../interfaces/ISavedItem';
import ISavedSearch from '../interfaces/ISavedSearch';
import checkAuth from '../middleware/check-auth.middleware';
import SavedItem from '../models/SavedItem.model';
import SavedSearch from '../models/SavedSearch.model';

const router: Router = Router();


router.get('/homepagetabs', async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.query);
  const category = req.query!.category!.toString();
  const page = req.query!.page! as string;
  const pageNumber = parseInt(page);
  const output = await getNewsByCategory(category, pageNumber);
  res.status(200).json({output});
});


router.post('/search', async (req: Request, res: Response, next: NextFunction) => {
  const searchTerm = req.body.searchTerm;
  console.log(searchTerm);
  const output = await getNewsBySearchTerm(searchTerm);
  res.status(200).json({output});
});

router.get('/favourites', checkAuth, (req: Request, res: Response, next: NextFunction) => {
  const savedSearch = SavedSearch.findOne({owner: req.userData?.userId})
      .then((data) => {
        if (data) {
          res.status(200).send(data.savedItems);
        }
      });
});


router.post('/addtofav', checkAuth, (req: Request, res: Response, next: NextFunction) => {
  const searchTerm = req.body.searchTerm;

  SavedSearch.findOne({owner: req.userData!.userId})
      .then((documentExists) => {
        if (documentExists === null) {
          const savedSearch: ISavedSearch = new SavedSearch({
            owner: req.userData?.userId,
            savedItems: searchTerm,
          });
          savedSearch.save()
              .then((result) => {
                return res.status(201).json({
                  message: 'resource posted',
                  result: result,
                });
              });
        }

        if (documentExists != null) {
          const currentTerms = documentExists.savedItems;
          if (currentTerms.includes(searchTerm)) {
            return res.status(400).json({
              error: {
                message: 'this item is already saved',
              },
            });
          }
          const savedSearch: ISavedSearch = new SavedSearch({
            _id: documentExists._id,
            owner: documentExists.owner,
            savedItems: [...currentTerms, searchTerm],
          });
          SavedSearch.updateOne({_id: documentExists._id, owner: documentExists.owner}, savedSearch )
              .then((result) => {
                if (result.ok > 0) {
                  res.status(200).json({message: 'Added to favourites'});
                } else {
                  res.status(401).json({message: 'Not added to favourites'});
                }
              });
        }
      });
});


router.post('/saveitem', checkAuth, (req: Request, res: Response) => {
  const itemToSave = req.body.item;
  console.log(itemToSave);
  console.log(req.userData!.userId);

  const savedItem: ISavedItem = new SavedItem({
    owner: req.userData!.userId,
    title: itemToSave.title,
    description: itemToSave.description,
    source: itemToSave.source,
    date: itemToSave.date,
    dateString: itemToSave.dateString,
    url: itemToSave.url,
    imageUrl: itemToSave.imageUrl,
  });

  savedItem.save()
      .then((data) => {
        console.log(data);
        return res.status(200).json({
          savedItem: data,
        });
      });
});

router.get('/saveitem', checkAuth, (req: Request, res: Response) => {
  SavedItem.find({owner: req.userData!.userId})
      .then((documents) => {
        return res.status(200).json({
          items: documents,
        });
      });
});

router.delete(('/saveitem/:id'), checkAuth, (req: Request, res: Response) => {
  SavedItem.deleteOne({owner: req.userData!.userId, _id: req.params.id})
      .then((result) => {
        console.log(result);
        if (result.n! > 0) {
          res.status(200).json({message: 'Deleted'});
        } else {
          res.status(401).json({message: 'Not Authorized'});
        }
      });
});


export default router;
