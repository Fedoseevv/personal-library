const ApiError = require('../handlers/api-error');
const bookQueries = require('../dbQueries/book-queries');

class BookController {
    async addBook(req, res, next) {
        try {
            const {title, year, keywords, cover, id_genre, annotation, expansion, location, user} = req.body;
            if (req.body.isEmpty) {
                return next(ApiError.badReq("Тело запроса пустое!"));
            }
            await bookQueries.addBook(title, year, keywords, cover, id_genre, annotation, expansion, location, user)
                .then(response => {
                    return res.status(200).send(response);
                });
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }

}

module.exports = new BookController();