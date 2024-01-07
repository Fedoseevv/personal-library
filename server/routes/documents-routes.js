const Router = require("express");
const router = Router();
const docControllers = require('../controllers/document-controller');

router.post('/add', docControllers.addDocument);
router.post('/delete', docControllers.deleteDocument);
router.post('/update', docControllers.updateDocument);
router.get('/all/:id', docControllers.allDocuments);
router.get('/:id', docControllers.docById);
router.post('/inCollection', docControllers.docInCollection);
router.post('/notInCollection', docControllers.docNotInCollection);
router.post('/deleteFromCollection', docControllers.deleteFromCollection);
router.post('/addInCollection', docControllers.addInCollection);

router.post('/find/title', docControllers.findByTitle);
router.post('/find/author', docControllers.findByAuthor);
router.post('/find/date', docControllers.findByDate);
router.get('/report/:id', docControllers.generateReport);

module.exports = router;