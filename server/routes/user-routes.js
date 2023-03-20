const Router = require("express");
const router = Router();
const userController = require("../controllers/user-controller");
const authMiddleware = require('../middleware/auth-moddleware');

router.post('/login', userController.login);
router.post('/register', userController.registration)
router.get('/auth', authMiddleware, userController.isAuthenticated);

module.exports = router;