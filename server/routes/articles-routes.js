const Router = require("express");
const router = Router();

router.post('/add')
router.post('/delete')
router.get('/all')
router.get('/:id')

module.exports = router;