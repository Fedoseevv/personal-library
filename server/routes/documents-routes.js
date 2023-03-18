const Router = require("express");
const router = Router();
const docControllers = require('../controllers/document-controller');

router.post('/add', docControllers.addDocument);
router.post('delete', docControllers.deleteDocument);
router.post('/update', docControllers.updateBook);
router.get('/all', docControllers.allDocuments);
router.get('/:id', docControllers.docById);

module.exports = router;