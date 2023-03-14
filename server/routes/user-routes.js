const Router = require("express");
const router = Router();
const userController = require("../controllers/user-controller");

router.post('/login', userController.login);
router.post('/registration', userController.registration);
router.get('/auth', userController.isAuthenticated);

module.exports = router;