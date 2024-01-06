const ApiError = require('../handlers/api-error');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userQueries = require('../dbQueries/user-queries');

const generateJwt = (id, email) => {
    return jwt.sign(
        { id, email },
        process.env.SECRET_KEY,
        {expiresIn: '12h'}
    )
}

class UserController {
    async registration(req, res, next) {
        try {
            const {email, password} = req.body
            const findResult = await userQueries.findUser(email);
            console.log(email, password)
            if (!email || !password || findResult.length > 0) {
                return next(ApiError.badReq('Некорректный email или password. Либо такой пользователь уже существует!'))
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
        try {
            const {email, password} = req.body;
            console.log(req.body);
            const queryResult = await userQueries.findUser(email);
            console.log(queryResult)
            const user = queryResult[0]
            const isMatch = await bcrypt.compareSync(password, user.password);
            if (!isMatch) {
                return next(ApiError.badReq("Неверный пароль!"));
            }
            const token = generateJwt(1, email)
            return res.json({ token: token, userId: user.id_user });
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    }

    async isAuthenticated(req, res, next) {
        const {id, email} = req.body;
        const token = generateJwt(id, email)
        return res.json({token})
    }
}

module.exports = new UserController();