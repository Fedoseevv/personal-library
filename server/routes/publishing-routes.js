const Router = require("express");
const router = Router();
const publishController = require('../controllers/publishing-controller');

router.get('/add', publishController.addPublish);
router.get('/delete', publishController.deletePublish);
router.get('/update', publishController.updatePublish);
router.get('/all', publishController.allPublishes);

module.exports = router;