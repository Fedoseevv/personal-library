const Router = require("express");
const router = Router();
const genreControllers = require('../controllers/genre-controller');

router.get('/add', genreControllers.addGenre);
router.get('/delete', genreControllers.deleteGenre);
router.get('/update', genreControllers.updateGenre);
router.get('/all', genreControllers.allGenres);

module.exports = router;