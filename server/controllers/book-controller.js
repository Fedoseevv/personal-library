const uuid = require('uuid');
const ApiError = require('../handlers/api-error');
const bookQueries = require('../dbQueries/book-queries');

class BookController {
    async addBook(req, res, next) {
        try {
            const {title, year, keywords, cover, id_genre, annotation, location, locationObl, id_author} = req.body;

            console.log(req.body)
            if (req.body.isEmpty) {
                return next(ApiError.badReq("Тело запроса пустое!"));
            }
            await bookQueries.addBook(title, year, keywords, cover, id_genre, annotation, location, locationObl)
            await bookQueries.maxBookId()
                .then(response => {
                    const bookId = response["max_id"]
                    bookQueries.addBookAuthor(bookId, id_author)
                })

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
    async booksInCollection(req, res) {
        try {
            const {id} = req.body;
            await bookQueries.booksInCollection(id)
                .then(response => {
                    return res.status(200).send(response);
                });
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }
    async booksNotInCollection(req, res) {
        try {
            const {id} = req.body;
            await bookQueries.booksNotInCollection(id)
                .then(response => {
                    return res.status(200).send(response);
                });
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }
    async updateBook(req, res, next) {
        try {
            const {id_book, id_ba, title, year_of_publication, keywords, cover, brief_annotation, location, location_obl, id_author, id_genre} = req.body;
            if (req.body.isEmpty) {
                return next(ApiError.badReq("Тело запроса пустое!"));
            }
            console.log([id_book, id_ba, title, year_of_publication, keywords, cover, brief_annotation, location, location_obl, id_author, id_genre].join("\n"))
            await bookQueries.updateBook(id_book, title, year_of_publication, keywords, cover, id_genre, brief_annotation, location, location_obl)
            await bookQueries.updateBookAuthor(id_ba, id_book, id_author)
                .then(response => {
                    return res.status(201).json({message: response});
                })
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }

    async deleteFromCollection(req, res) {
        try {
            const {bookId, colId} = req.body;
            console.log(bookId, colId)
            await bookQueries.deleteFromCollection(bookId, colId)
                .then(response => {
                    return res.status(200).json({message: response});
                })

        } catch (e) {
            return res.status(400).json({ message: e.message });
        }
    }
    async addInCollection(req, res) {
        try {
            const {bookId, colId} = req.body;
            console.log(bookId, colId)
            await bookQueries.addInCollection(bookId, colId)
                .then(response => {
                    return res.status(200).json({message: response});
                })

        } catch (e) {
            return res.status(400).json({ message: e.message });
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