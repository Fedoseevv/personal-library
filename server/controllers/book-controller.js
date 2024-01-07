const uuid = require('uuid');
const ApiError = require('../handlers/api-error');
const bookQueries = require('../dbQueries/book-queries');
const PDFDocument = require("pdfkit");

class BookController {
    async addBook(req, res, next) {
        try {
            const {title, year, keywords, cover, id_genre,
                annotation, location, locationObl, id_authors, pubHouse, pubCity, userId} = req.body;

            console.log(req.body)
            if (req.body.isEmpty) {
                return next(ApiError.badReq("Тело запроса пустое!"));
            }
            await bookQueries.addBook(title, year, keywords, cover, id_genre, annotation, location, locationObl, userId)
            const targetPubHouses = await bookQueries.findPubHouse(pubHouse, pubCity);
            const targetPubHouse = targetPubHouses[0]

            if (targetPubHouse === undefined) {
                await bookQueries.maxBookId()
                    .then(async response => {
                        const bookId = response["max_id"]
                        for(const id of id_authors) {
                            await bookQueries.addBookAuthor(bookId, id);
                        }

                        await bookQueries.addPubHouse(pubHouse, pubCity);
                        await bookQueries.maxPubHouseId()
                            .then(async response => {
                                const pubId = response["id"]
                                await bookQueries.addBookPubHouse(bookId, pubId)
                                    .then(response => {
                                        return res.status(201).json({message: "Запись успешно добавлена!"});
                                    })
                            })
                    })
            } else {
                await bookQueries.maxBookId()
                    .then(async response => {
                        const bookId = response["max_id"]
                        for(const id of id_authors) {
                            await bookQueries.addBookAuthor(bookId, id);
                        }

                        await bookQueries.addBookPubHouse(bookId, targetPubHouse.id_publishing_house)
                            .then(response => {
                                return res.status(201).json({message: "Запись успешно добавлена!"});
                            })
                    })
            }

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
            await bookQueries.deleteBookPh(id)
            await bookQueries.deleteBookCollection(id)
            await bookQueries.deleteBook(id)
                .then(response => {
                    return res.status(200).json({message: response});
                });
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }
    async allBooks(req, res) {
        try {
            const id = req.params.id
            await bookQueries.allBooks(id)
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
            const {id, userId} = req.body;
            await bookQueries.booksNotInCollection(id, userId)
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
                brief_annotation, location, location_obl, id_authors, id_genre,
                pub_name, pub_city, id_publishing_house} = req.body;
            if (req.body.isEmpty) {
                return next(ApiError.badReq("Тело запроса пустое!"));
            }
            console.log(req.body)
            await bookQueries.updateBook(id_book, title, year_of_publication, keywords, cover, id_genre, brief_annotation, location, location_obl)

            // Для издательства может поменяться название. Смотрим, если изменилось название или город,
            // Тогда добавляем новую строчку, иначе ничего не делаем
            const query = await bookQueries.findPubHouse(pub_name, pub_city)
            const targetPubHouse = query[0]
            if (targetPubHouse === undefined) {
                await bookQueries.addPubHouse(pub_name, pub_city);
                const ourPubHouse = await bookQueries.maxPubHouseId();
                const idPubHouse = ourPubHouse.id;
                console.log(idPubHouse);
                // Удаляем старую привязку
                await bookQueries.deleteBookPh(id_book);
                // Привязываем новую
                await bookQueries.addBookPubHouse(id_book, idPubHouse)
            } else {
                console.log(targetPubHouse);
                await bookQueries.changePubHouse(id_book, targetPubHouse.id_publishing_house);
            }

            console.log(id_authors)
            const authorQuery = await bookQueries.authorsByBookId(id_book)
            const currentAuthors = authorQuery[0].authors;
            console.log(currentAuthors)
            if (id_authors.length === currentAuthors.length &&
                id_authors.sort().every((value, index) =>
                    value === currentAuthors.sort()[index])) {
                console.log("Авторы не изменились")
            } else {
                console.log("авторы изменились")
                // Удаляем привязку для всех старых
                await bookQueries.deleteBookAuthor(id_book);
                // Добавляем привязку для всех новых
                for(const id of id_authors) {
                    await bookQueries.addBookAuthor(id_book, id);
                }
            }

            return res.status(200).json({message: "Запись успешно обновлена"});
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
            const {title, userId} = req.body;
            if (!title || !userId) {
                return next(ApiError.badReq("Тело запроса пустое!"));
            }
            await bookQueries.findBooksByTitle(title, userId)
                .then(response => {
                    return res.status(200).send(response);
                });
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }
    async findByGenre(req, res, next) {
        try {
            const {genre, userId} = req.body;
            if (!genre || !userId) {
                return next(ApiError.badReq("Тело запроса пустое!"));
            }
            await bookQueries.findBooksByGenre(genre, userId)
                .then(response => {
                    return res.status(200).send(response);
                });
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }
    async findByPubHouse(req, res, next) {
        try {
            const {pubHouse, userId} = req.body;
            console.log(pubHouse)
            if (!pubHouse || !userId) {
                return next(ApiError.badReq("Тело запроса пустое!"));
            }
            await bookQueries.findBooksByPubHouse(pubHouse, userId)
                .then(response => {
                    return res.status(200).send(response);
                });
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }
    async findByKeywords(req, res, next) {
        try {
            const {keywords, userId} = req.body;
            if (!keywords || !userId) {
                return next(ApiError.badReq("Тело запроса пустое!"));
            }
            await bookQueries.findBooksByKeywords(keywords, userId)
                .then(response => {
                    return res.status(200).send(response);
                });
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }
    async findByPubYear(req, res, next) {
        try {
            const {pubYear, userId} = req.body;
            if (!pubYear || !userId) {
                return next(ApiError.badReq("Тело запроса пустое!"));
            }
            console.log(pubYear)
            await bookQueries.findBooksByPubYear(pubYear, userId)
                .then(response => {
                    return res.status(200).send(response);
                });
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }
    async findByAuthor(req, res, next) {
        try {
            const {author, userId} = req.body;
            if (!author || !userId) {
                return next(ApiError.badReq("Тело запроса пустое!"));
            }
            await bookQueries.findBooksByAuthor(author, userId)
                .then(response => {
                    return res.status(200).send(response);
                });
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }
    async findByBriefAnn(req, res, next) {
        try {
            const {briefAnnotation, userId} = req.body;
            if (!briefAnnotation || !userId) {
                return next(ApiError.badReq("Тело запроса пустое!"));
            }
            await bookQueries.findBooksByBriefAnn(briefAnnotation, userId)
                .then(response => {
                    return res.status(200).send(response);
                });
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }

    async generateReport(req, res, next) {
        const id = req.params.id;
        console.log(id)
        const books = await bookQueries.bookById(id)
        const book = books[0]

        const doc = new PDFDocument({ margin: 35 });
        doc.page.margins = { top: 72, left: 100, bottom: 72, right: 50 };
        doc.font('D:\\downloads\\Times New Roman\\target.ttf');
        doc.fontSize(18).text('Отчет о выбранной книге', {align: 'center', paragraphGap: 25, underline: true});

        doc.fontSize(14).text(`Название книги: ${book.title}`, {align: "center", paragraphGap: 10});
        doc.fontSize(12).text(`Год публикации: ${book.year_of_publication}`, {align: "justify"});
        doc.fontSize(12).text(`Ключевые слова: ${book.keywords}`, {align: "justify"});
        doc.fontSize(12).text(`Жанр: ${book.genre}`, {align: "justify"});
        doc.fontSize(12).text(`Краткая аннотация: ${book.brief_annotation}`, {align: "justify"});
        doc.fontSize(12).text(`Расположение на компьютере: ${book.location.replace("myproto://", "")}`, {align: "justify"});
        doc.fontSize(12).text(`Автор: ${book.authors}`, {align: "justify"});
        doc.fontSize(12).text(`Издательство: ${book.pub_name}`, {align: "justify"});
        doc.fontSize(12).text(`Город издания: ${book.city_of_publication}`, {align: "justify", lineGap: 10});

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=book.pdf');
        doc.pipe(res);
        doc.end();
    }
}

module.exports = new BookController();