const ApiError = require('../handlers/api-error');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userQueries = require('../dbQueries/user-queries');

const generateJwt = (id, email) => {
    return jwt.sign(
        { id, email },
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserController {
    async registration(req, res, next) {
        try {
            const {email, password} = req.body
            console.log(email, password)
            if (!email || !password) {
                return next(ApiError.badReq('Некорректный email или password'))
            }
            const hashPassword = await bcrypt.hash(password, 5);
            await userQueries.registerUser(email, hashPassword)
                .then(response => {
                   res.json(response);
                });
        } catch (e) {
            res.status(400).json({message: e.message});
        }
    }

    async login(req, res, next) {
        const {email, password} = req.body;
        await userQueries.findUser(email)
            .then(async response => {
               if (!response) {
                   return next(ApiError.badReq("Пользователь не найден!"));
               }
               const isMatch = await bcrypt.compareSync(password, response.password);
               if (!isMatch) {
                   return next(ApiError.badReq("Неверный пароль!"));
               }
                const token = generateJwt(response.id, email)
                return res.json({token});
            });

    }

    async isAuthenticated(req, res, next) {
        const {id, email} = req.body;
        const token = generateJwt(id, email)
        return res.json({token})
    }
}

module.exports = new UserController();