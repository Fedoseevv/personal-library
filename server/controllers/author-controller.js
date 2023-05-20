const ApiError = require('../handlers/api-error');
const authorQueries = require('../dbQueries/author-queries');
const bookQueries = require('../dbQueries/book-queries');
const documentQueries = require("../dbQueries/document-queries");
const articleQueries = require("../dbQueries/article-queries");

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
            const docRes = await authorQueries.docsByAuthor(id)
            const docs = docRes.map(item => item.id_document)

            const bookRes = await authorQueries.booksByAuthor(id)
            const books = bookRes.map(item => item.id_book)

            const articleRes = await authorQueries.articleByAuthor(id)
            const articles = articleRes.map(item => item.id_article)

            console.log(docs)
            console.log(books)
            console.log(articles)
            for(const id of books) {
                await bookQueries.deleteBookAuthor(id)
                await bookQueries.deleteBookPh(id)
                await bookQueries.deleteBookCollection(id)
                await bookQueries.deleteBook(id)
            }
            for (const id of docs) {
                await documentQueries.deleteDocAuthor(id)
                await documentQueries.deleteDocCollection(id)
                await documentQueries.deleteDocument(id)
            }
            for (const id of articles) {
                await articleQueries.deleteAuthorArticle(id)
                await articleQueries.deleteArticleCollection(id)
                await articleQueries.deleteArticle(id)
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