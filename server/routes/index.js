const Router = require("express");
const router = Router();

const userRouter = require('./user-routes');
const booksRouter = require('./books-routes');
const filesRouter = require('./files-routes');
const artRouter = require('./articles-routes');
const genreRouter = require('./genres-routes');
const publishRouter = require('./publishing-routes');
const documentRouter = require('./documents-routes');
const authorRouter = require('./author-routes');
const collectionRouter = require('./collection-routes');

router.use('/collections', collectionRouter);
router.use('/user', userRouter);
router.use('/genre', genreRouter);
router.use('/publishing', publishRouter);

router.use('/author', authorRouter);
router.use('/books', booksRouter);
router.use('/documents', documentRouter);
router.use('/files', filesRouter);
router.use('/articles', artRouter);

module.exports = router;