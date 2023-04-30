const ApiError = require('../handlers/api-error');
const articleQueries = require('../dbQueries/article-queries');

class ArticlesController {
    async addArticle(req, res, next) {
        try {
            const {title, linkArt, dateOfPub, authorId} = req.body;
            console.log(req.body)
            if (req.body.isEmpty) {
                return next(ApiError.badReq("Тело запроса пустое!"));
            }
            await articleQueries.addArticle(title, linkArt, dateOfPub, 1)
            await articleQueries.maxArtId()
                .then(response => {
                    const artId = response["max_id"]
                    articleQueries.addRec(artId, authorId)
                        .then(resp => {
                            return res.status(201).json({message: "Запись успешно добавлена!"});
                        })
                })

        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }

    async deleteArticle(req, res, next) {
        try {
            const {id} = req.body;
            if (!id) {
                return next(ApiError.badReq("Идентификатор статьи не указан!"));
            }
            await articleQueries.deleteAuthorArticle(id)
            await articleQueries.deleteArticleCollection(id)
            await articleQueries.deleteArticle(id)
                .then(response => {
                    return res.status(200).json({message: response});
                });
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }
    async allArticles(req, res) {
        try {
            await articleQueries.allArticles()
                .then(response => {
                    return res.status(200).send(response);
                });
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }
    async artInCollection(req, res) {
        try {
            const {id} = req.body;
            await articleQueries.articlesInCollection(id)
                .then(response => {
                    return res.status(200).send(response);
                })
        } catch (e) {
            return res.status(400).json({ message: e.message });
        }
    }
    async artNotInCollection(req, res) {
        try {
            const {id} = req.body;
            await articleQueries.articlesNotInCollection(id)
                .then(response => {
                    return res.status(200).send(response);
                })
        } catch (e) {
            return res.status(400).json({ message: e.message });
        }
    }

    async deleteFromCollection(req, res) {
        try {
            const {artId, colId} = req.body;
            console.log(artId, colId)
            await articleQueries.deleteFromCollection(artId, colId)
                .then(response => {
                    return res.status(200).json({message: response});
                })

        } catch (e) {
            return res.status(400).json({ message: e.message });
        }
    }
    async addInCollection(req, res) {
        try {
            const {artId, colId} = req.body;
            console.log(artId, colId)
            await articleQueries.addInCollection(artId, colId)
                .then(response => {
                    return res.status(200).json({message: response});
                })

        } catch (e) {
            return res.status(400).json({ message: e.message });
        }
    }

    async updateArticle(req, res, next) {
        try {
            const {id_article, id_aa, title, date_of_publication, hyperlink, id_author} = req.body;
            if (req.body.isEmpty) {
                return next(ApiError.badReq("Тело запроса пустое!"));
            }
            console.log([id_article, id_aa, title, date_of_publication, hyperlink, id_author].join("\n"))
            await articleQueries.updateArticle(id_article, title, hyperlink, date_of_publication)
            await articleQueries.updateArticleAuthor(id_aa, id_author, id_article)
                .then(response => {
                    return res.status(201).json({message: response});
                })
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }
    async articleById(req, res, next) {
        try {
            const {id} = req.query;
            if (!id) {
                return next(ApiError.badReq("Идентификатор статьи не указан!"));
            }
            await articleQueries.articleById(id)
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
            await articleQueries.findByTitle(title)
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
            await articleQueries.findByAuthor(author)
                .then(response => {
                    return res.status(200).send(response);
                });
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }
    async findByDate(req, res, next) {
        try {
            const {date} = req.body;
            console.log(date)
            await articleQueries.findByDate(date)
                .then(response => {
                    return res.status(200).send(response);
                });
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }
}

module.exports = new ArticlesController();