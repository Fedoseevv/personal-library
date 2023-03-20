const Router = require("express");
const router = Router();
const authorController = require('../controllers/author-controller');

router.post('/add', authorController.addAuthor);
router.post('delete', authorController.deleteAuthor);
router.post('/update', authorController.updateAuthor);
router.get('/all', authorController.allAuthors);
router.get('/:id', authorController.authorById);

module.exports = router;