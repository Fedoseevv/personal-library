const ApiError = require('../handlers/api-error');

class UserController {
    async registration(req, res) {

    }

    async login(req, res) {

    }

    async isAuthenticated(req, res, next) {
        const {id} = req.query;
        if (!id) {
            return next(ApiError.badReq('Не указан id'));
        }
        res.json(id);
    }
}

module.exports = new UserController();