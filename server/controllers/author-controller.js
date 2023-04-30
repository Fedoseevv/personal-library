const ApiError = require('../handlers/api-error');
const authorQueries = require('../dbQueries/author-queries');

class AuthorController {
    async addAuthor(req, res, next) {
        try {
            const {name, patronymic, surname, birthDate} = req.body;
            console.log(name, patronymic, surname, birthDate)
            if (req.body.isEmpty) {
                return next(ApiError.badReq("Тело запроса пустое!"));
            }
            const result = await authorQueries.maxId()
            await authorQueries.addAuthor(result.id + 1, name, patronymic, surname, birthDate)
                .then(response => {
                    return res.status(200).json({message: response});
                });
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }
    async deleteAuthor(req, res, next) {
        try {
            const {id} = req.body;
            console.log(id);
            if (!id) {
                return next(ApiError.badReq("Идентификатор автора не указан!"));
            }
            await authorQueries.deleteAuthor(id)
                .then(response => {
                    return res.status(200).json({message: response});
                });
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }

    async allAuthors(req, res) {
        try {
            await authorQueries.allAuthors()
                .then(response => {
                    return res.status(200).send(response);
                });
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }

    async updateAuthor(req, res, next) {
        try {
            const {authorId, name, patronymic, surname, birthDate} = req.body;
            if (req.body.isEmpty) {
                return next(ApiError.badReq("Тело запроса пустое!"));
            }
            console.log(authorId, name, patronymic, surname, birthDate);
            await authorQueries.updateAuthor(authorId, name, patronymic, surname, birthDate)
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }

    async authorById(req, res, next) {
        try {
            const {id} = req.query;
            if (!id) {
                return next(ApiError.badReq("Идентификатор документа не указан!"));
            }
            await authorQueries.authorById(id)
                .then(response => {
                   return res.status(200).send(response);
                });
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }
}

module.exports = new AuthorController();