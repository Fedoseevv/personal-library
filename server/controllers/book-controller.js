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
                        .then(response => {
                            return res.status(201).json({message: "Запись успешно добавлена"})
                        })
                })

        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }
    async deleteBook(req, res, next) {
        try {
            const {id} = req.body;
            if (!id) {
                return next(ApiError.badReq("Идентификатор книги не указан!"));
            }
            await bookQueries.deleteBookAuthor(id)
            await bookQueries.deleteBookCollection(id)
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
            const {id_book, id_ba, title, year_of_publication, keywords, cover,
                brief_annotation, location, location_obl, id_author, id_genre,
                pub_name, pub_city, id_publishing_house} = req.body;
            if (req.body.isEmpty) {
                return next(ApiError.badReq("Тело запроса пустое!"));
            }
            console.log([id_book, id_ba, title, year_of_publication, keywords,
                cover, brief_annotation, location, location_obl, id_author,
                id_genre, pub_name, pub_city, id_publishing_house].join("\n"))
            await bookQueries.updateBook(id_book, title, year_of_publication, keywords, cover, id_genre, brief_annotation, location, location_obl)
            await bookQueries.updateBookPublish(id_publishing_house, pub_name, pub_city);
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
    async findByTitle(req, res, next) {
        try {
            const {title} = req.body;
            if (!title) {
                return next(ApiError.badReq("Тело запроса пустое!"));
            }
            await bookQueries.findBooksByTitle(title)
                .then(response => {
                    return res.status(200).send(response);
                });
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }
    async findByGenre(req, res, next) {
        try {
            const {genre} = req.body;
            if (!genre) {
                return next(ApiError.badReq("Тело запроса пустое!"));
            }
            await bookQueries.findBooksByGenre(genre)
                .then(response => {
                    return res.status(200).send(response);
                });
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }
    async findByPubHouse(req, res, next) {
        try {
            const {pubHouse} = req.body;
            if (!pubHouse) {
                return next(ApiError.badReq("Тело запроса пустое!"));
            }
            await bookQueries.findBooksByPubHouse(pubHouse)
                .then(response => {
                    return res.status(200).send(response);
                });
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }
    async findByKeywords(req, res, next) {
        try {
            const {keywords} = req.body;
            if (!keywords) {
                return next(ApiError.badReq("Тело запроса пустое!"));
            }
            await bookQueries.findBooksByKeywords(keywords)
                .then(response => {
                    return res.status(200).send(response);
                });
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }
    async findByPubYear(req, res, next) {
        try {
            const {pubYear} = req.body;
            if (!pubYear) {
                return next(ApiError.badReq("Тело запроса пустое!"));
            }
            await bookQueries.findBooksByPubYear(pubYear)
                .then(response => {
                    return res.status(200).send(response);
                });
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }
    async findByAuthor(req, res, next) {
        try {
            const {author} = req.body;
            if (!author) {
                return next(ApiError.badReq("Тело запроса пустое!"));
            }
            await bookQueries.findBooksByAuthor(author)
                .then(response => {
                    return res.status(200).send(response);
                });
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }
    async findByBriefAnn(req, res, next) {
        try {
            const {briefAnnotation} = req.body;
            if (!briefAnnotation) {
                return next(ApiError.badReq("Тело запроса пустое!"));
            }
            await bookQueries.findBooksByBriefAnn(briefAnnotation)
                .then(response => {
                    return res.status(200).send(response);
                });
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }
}

module.exports = new BookController();