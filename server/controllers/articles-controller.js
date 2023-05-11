const ApiError = require('../handlers/api-error');
const articleQueries = require('../dbQueries/article-queries');
const PDFDocument = require("pdfkit");

class ArticlesController {
    async addArticle(req, res, next) {
        try {
            const {title, linkArt, dateOfPub, id_authors} = req.body;
            console.log(req.body)
            if (req.body.isEmpty) {
                return next(ApiError.badReq("Тело запроса пустое!"));
            }
            await articleQueries.addArticle(title, linkArt, dateOfPub, 1)
            await articleQueries.maxArtId()
                .then(response => {
                    const artId = response["max_id"]
                    for(const id of id_authors) {
                        articleQueries.addRec(artId, id);
                    }
                })
            return res.status(201).json({message: "Запись успешно добавлена!"});
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
            const {id_article, id_aa, title, date_of_publication, hyperlink, id_authors} = req.body;
            if (req.body.isEmpty) {
                return next(ApiError.badReq("Тело запроса пустое!"));
            }
            console.log(req.body);
            await articleQueries.updateArticle(id_article, title, hyperlink, date_of_publication)

            const authorQuery = await articleQueries.authorsByArtId(id_article);
            const currentAuthors = authorQuery[0].authors;
            console.log(currentAuthors)
            if (id_authors.length === currentAuthors.length &&
                id_authors.sort().every((value, index) =>
                    value === currentAuthors.sort()[index])) {
                console.log("Авторы не изменились")
            } else {
                console.log("авторы изменились")
                await articleQueries.deleteAuthorArticle(id_article);
                for(const id of id_authors) {
                    await articleQueries.addRec(id_article, id)
                }
            }
            return res.status(200).json({message: "Запись успешно обновлена!"});
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
    async generateReport(req, res, next) {
        const id = req.params.id;
        console.log(id)
        const articles = await articleQueries.articleById(id)
        const article = articles[0]

        const doc = new PDFDocument({ margin: 35 });
        doc.page.margins = { top: 72, left: 100, bottom: 72, right: 50 };
        doc.font('D:\\downloads\\Times New Roman\\target.ttf');
        doc.fontSize(18).text('Отчет о выбранной статье', {align: 'center', paragraphGap: 25, underline: true});

        doc.fontSize(14).text(`Название статьи: ${article.title}`, {align: "center", paragraphGap: 10});
        doc.fontSize(12).text(`Дата публикации: ${new Date(article.date_of_publication).toLocaleDateString()}`, {align: "justify"});
        doc.fontSize(12).text(`Ссылка на статью: ${article.hyperlink}`, {align: "justify"});
        doc.fontSize(12).text(`Автор(-ы): ${article.authors}`, {align: "justify"});

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=article.pdf');
        doc.pipe(res);
        doc.end();
    }
}

module.exports = new ArticlesController();