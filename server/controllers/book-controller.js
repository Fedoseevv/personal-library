const ApiError = require('../handlers/api-error');
const bookQueries = require('../dbQueries/book-queries');

class BookController {
    async addBook(req, res, next) {
        try {
            const {title, year, keywords, cover, id_genre, annotation, expansion, location, locationObl, user} = req.body;
            if (req.body.isEmpty) {
                return next(ApiError.badReq("Тело запроса пустое!"));
            }
            await bookQueries.addBook(title, year, keywords, cover, id_genre, annotation, expansion, location, locationObl, user)
                .then(response => {
                    return res.status(200).send(response);
                });
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }
    async deleteBook(req, res, next) {
        try {
            const {id} = req.query;
            if (!id) {
                return next(ApiError.badReq("Идентификатор книги не указан!"));
            }
            await bookQueries.deleteBook(id)
                .then(response => {
                    return res.status(200).send(response);
                });
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }
    async allBooks(req, res) {
        try {
            await bookQueries.allBooks()
                .then(response => {
                    return res.status(200).send(response);
                });
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }
    async updateBook(req, res, next) {
        try {
            const {id, title, year, keywords, cover, id_genre, annotation, expansion, location, locationObl, user} = req.body;
            if (req.body.isEmpty) {
                return next(ApiError.badReq("Тело запроса пустое!"));
            }
            await bookQueries.updateBook(id, title, year, keywords, cover, id_genre, annotation, expansion, location, locationObl, user)
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }
    async bookById(req, res, next) {
        try {
            const {id} = req.query;
            if (!id) {
                return next(ApiError.badReq("Идентификатор книги не указан!"));
            }
            await bookQueries.bookById(id)
                .then(response => {
                    return res.status(200).send(response);
                });
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }
}

module.exports = new BookController();