const Router = require("express");
const router = Router();
const bookControllers = require('../controllers/book-controller');

router.post('/add', bookControllers.addBook);
router.post('delete', bookControllers.deleteBook);
router.post('/update', bookControllers.updateBook);
router.get('/all', bookControllers.allBooks);
router.get('/:id', bookControllers.bookById);
router.post('/inCollection', bookControllers.booksInCollection);
router.post('/notInCollection', bookControllers.booksNotInCollection);
router.post('/deleteFromCollection', bookControllers.deleteFromCollection);
router.post('/addInCollection', bookControllers.addInCollection);

module.exports = router;