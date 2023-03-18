const ApiError = require('../handlers/api-error');
const articleQueries = require('../dbQueries/article-queries');

class ArticlesController {
    async addArticle(req, res, next) {
        try {
            const {title, link, publishDate, userId} = req.body;
            if (req.body.isEmpty) {
                return next(ApiError.badReq("Тело запроса пустое!"));
            }
            await articleQueries.addArticle(title, link, publishDate, userId)
                .then(response => {
                    return res.status(200).send(response);
                });
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }
    async deleteArticle(req, res, next) {
        try {
            const {id} = req.query;
            if (!id) {
                return next(ApiError.badReq("Идентификатор статьи не указан!"));
            }
            await articleQueries.deleteArticle(id)
                .then(response => {
                    return res.status(200).send(response);
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
    async updateArticle(req, res, next) {
        try {
            const {idArt, title, link, publishDate, userId} = req.body;
            if (req.body.isEmpty) {
                return next(ApiError.badReq("Тело запроса пустое!"));
            }
            await articleQueries.updateArticle(idArt, title, link, publishDate, userId)
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
}

module.exports = new ArticlesController();