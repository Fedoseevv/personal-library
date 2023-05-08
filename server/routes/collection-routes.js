const Router = require("express");
const router = Router();
const collectionControllers = require('../controllers/collection-controller');

router.get('/all', collectionControllers.allCollections);
router.post('/add', collectionControllers.addCollection);
router.post('/delete', collectionControllers.deleteCollection);
router.get('/report/:id', collectionControllers.getCollectionsReport);

module.exports = router;