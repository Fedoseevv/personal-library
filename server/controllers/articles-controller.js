const ApiError = require('../handlers/api-error');
const articleQueries = require('../dbQueries/article-queries');
const PDFDocument = require("pdfkit");

class ArticlesController {
    async addArticle(req, res, next) {
        try {
            const {title, linkArt, dateOfPub, id_authors, userId} = req.body;
            console.log(req.body)
            if (req.body.isEmpty) {
                return next(ApiError.badReq("Тело запроса пустое!"));
            }

            const url = "http://127.0.0.1:5000/extract_kw"
            const jsonData = { url: `${linkArt}` }
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Указываем, что отправляем JSON данные
                },
                body: JSON.stringify(jsonData) // Преобразуем JSON данные в строку
            };

            fetch(url, requestOptions)
                .then(resp => resp.json())
                .then(async data => {
                    console.log(data)
                    const keywords = data.res.join(";");
                    await articleQueries.addArticle(title, linkArt, dateOfPub, userId, keywords)
                    await articleQueries.maxArtId(userId)
                        .then(response => {
                            const artId = response["max_id"]
                            for(const id of id_authors) {
                                articleQueries.addRec(artId, id);
                            }
                        })
                    return res.status(201).json({message: "Запись успешно добавлена!"});
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
            const id = req.params.id
            await articleQueries.allArticles(id)
                .then(response => {
                    return res.status(200).send(response);
                });
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }
    async artInCollection(req, res) {
        try {
            const {id, userId} = req.body;
            await articleQueries.articlesInCollection(id, userId)
                .then(response => {
                    return res.status(200).send(response);
                })
        } catch (e) {
            return res.status(400).json({ message: e.message });
        }
    }
    async artNotInCollection(req, res) {
        try {
            const {id, userId} = req.body;
            await articleQueries.articlesNotInCollection(id, userId)
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
            const {id_article, id_aa, title, date_of_publication, hyperlink, id_authors, keywords, userId} = req.body;
            if (req.body.isEmpty) {
                return next(ApiError.badReq("Тело запроса пустое!"));
            }
            console.log(req.body);
            await articleQueries.updateArticle(id_article, title, hyperlink, date_of_publication, userId, keywords)

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
            const {title, userId} = req.body;
            if (!title) {
                return next(ApiError.badReq("Тело запроса пустое!"));
            }
            await articleQueries.findByTitle(title, userId)
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
            if (!author) {
                return next(ApiError.badReq("Тело запроса пустое!"));
            }
            await articleQueries.findByAuthor(author, userId)
                .then(response => {
                    return res.status(200).send(response);
                });
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }
    async findByDate(req, res, next) {
        try {
            const {date, userId} = req.body;
            console.log(date)
            await articleQueries.findByDate(date, userId)
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
            console.log(keywords)
            await articleQueries.findByKeywords(keywords, userId)
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
        doc.fontSize(12).text(`Ключевые слова: ${article.keywords.split(";").join(", ")}`, {align: "justify"});

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=article.pdf');
        doc.pipe(res);
        doc.end();
    }
}

module.exports = new ArticlesController();