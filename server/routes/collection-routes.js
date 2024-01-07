const Router = require("express");
const router = Router();
const collectionControllers = require('../controllers/collection-controller');

router.get('/all/:id', collectionControllers.allCollections);
router.post('/add', collectionControllers.addCollection);
router.post('/delete', collectionControllers.deleteCollection);
router.get('/report/:id', collectionControllers.getCollectionsReport);
router.post('/booksInCollection', collectionControllers.booksInCollection);
router.post('/docInCollection', collectionControllers.docInCollection);
router.post('/articleInCollection', collectionControllers.articleInCollection);

router.post('/updateBook', collectionControllers.updateCollectionsBook);
router.post('/updateDoc', collectionControllers.updateCollectionsDoc);
router.post('/updateArticle', collectionControllers.updateCollectionsArticle);

module.exports = router;