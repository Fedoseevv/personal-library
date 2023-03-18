const Router = require("express");
const router = Router();
const articlesController = require('../controllers/articles-controller');


router.post('/add', articlesController.addArticle);
router.post('delete', articlesController.deleteArticle);
router.post('/update', articlesController.updateArticle);
router.get('/all', articlesController.allArticles);
router.get('/:id', articlesController.articleById);

module.exports = router;