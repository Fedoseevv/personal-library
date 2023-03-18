const Router = require("express");
const router = Router();
const bookControllers = require('../controllers/book-controller');

router.post('/add', bookControllers.addBook);
router.post('delete', bookControllers.deleteBook);
router.post('/update', bookControllers.updateBook);
router.get('/all', bookControllers.allBooks);
router.get('/:id', bookControllers.bookById);

module.exports = router;