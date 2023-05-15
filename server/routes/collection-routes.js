const Router = require("express");
const router = Router();
const collectionControllers = require('../controllers/collection-controller');

router.get('/all', collectionControllers.allCollections);
router.post('/add', collectionControllers.addCollection);
router.post('/delete', collectionControllers.deleteCollection);
router.get('/report/:id', collectionControllers.getCollectionsReport);
router.get('/booksInCollection/:id', collectionControllers.booksInCollection);
router.get('/docInCollection/:id', collectionControllers.docInCollection);
router.get('/articleInCollection/:id', collectionControllers.articleInCollection);

router.post('/updateBook', collectionControllers.updateCollectionsBook);
router.post('/updateDoc', collectionControllers.updateCollectionsDoc);
router.post('/updateArticle', collectionControllers.updateCollectionsArticle);

module.exports = router;