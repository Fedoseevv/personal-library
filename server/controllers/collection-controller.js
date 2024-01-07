const PDFDocument = require('pdfkit');
const fs = require('fs');
const ApiError = require('../handlers/api-error');
const collectionQueries = require('../dbQueries/collection-queries');
const bookQueries = require("../dbQueries/book-queries");
const docQueries = require("../dbQueries/document-queries");
const artQueries = require("../dbQueries/article-queries");

class CollectionController {
    async addCollection(req, res, next) {
        try {
            const {name} = req.body;
            console.log(name);
            if (req.body.isEmpty) {
                return next(ApiError.badReq("Тело запроса пустое!"));
            }
            await collectionQueries.addCollection(name)
                .then(response => {
                    return res.status(201).json({message: response});
                })
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }

    async deleteCollection(req, res, next) {
        try {
            const {id} = req.body;
            if (!id) {
                return next(ApiError.badReq("Идентификатор коллекции не указан!"));
            }
            await bookQueries.deleteAllFromCollection(id)
            await docQueries.deleteAllFromCollection(id)
            await artQueries.deleteAllFromCollection(id)
            await collectionQueries.deleteCollection(id)
                .then(response => {
                    return res.status(200).json({message: response});
                })
        } catch (e) {
            return res.status(400).json({ message: e.message });
        }
    }

    async allCollections(req, res) {
        try {
            const userId = req.params.id
            await collectionQueries.allCollections(userId)
                .then(response => {
                    return res.status(200).send(response);
                })
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }

    async booksInCollection(req, res, next) {
        try {
            const {id, userId} = req.body
            if (!id) {
                return next(ApiError.badReq("Идентификатор коллекции не указан!"));
            }
            const data = await collectionQueries.booksInCollections(id, userId)
                .then(response => {
                    return res.status(200).send(response);
                })
        } catch (e) {
            return res.status(400).json({ message: e.message });
        }
    }
    async docInCollection(req, res, next) {
        try {
            const {id, userId} = req.body
            if (!id) {
                return next(ApiError.badReq("Идентификатор коллекции не указан!"));
            }
            const data = await collectionQueries.docInCollections(id, userId)
                .then(response => {
                    return res.status(200).send(response);
                })
        } catch (e) {
            return res.status(400).json({ message: e.message });
        }
    }
    async articleInCollection(req, res, next) {
        try {
            const {id, userId} = req.body
            if (!id) {
                return next(ApiError.badReq("Идентификатор коллекции не указан!"));
            }
            const data = await collectionQueries.articleInCollections(id, userId)
                .then(response => {
                    return res.status(200).send(response);
                })
        } catch (e) {
            return res.status(400).json({ message: e.message });
        }
    }

    async updateCollectionsBook(req, res) {
        try {
            const id = req.body.bookId
            const data = req.body.collections
            console.log(data)
            // Удаляем все старые записи о коллекциях
            for (const col of data) {
                await bookQueries.deleteFromCollection(id, col.id_collection)
            }
            // Добавляем все коллекции, где isin = true
            for (const col of data) {
                if (col.isin) {
                    await bookQueries.addInCollection(id, col.id_collection)
                }
            }
            return res.status(200).json({message: "Запись успешно обновлена!"});
        } catch (e) {
            return res.status(400).json({ message: e.message });
        }
    }
    async updateCollectionsDoc (req, res) {
        const id = req.body.docId
        const data = req.body.collections
        console.log(data)
        // Удаляем все старые записи о коллекциях
        for (const col of data) {
            await docQueries.deleteFromCollection(id, col.id_collection)
        }
        // Добавляем все коллекции, где isin = true
        for (const col of data) {
            if (col.isin) {
                await docQueries.addInCollection(id, col.id_collection)
            }
        }
        return res.status(200).json({message: "Запись успешно обновлена!"});

    }
    async updateCollectionsArticle(req, res) {
        const id = req.body.articleId
        console.log(id)
        const data = req.body.collections
        console.log(data)
        // Удаляем все старые записи о коллекциях
        for (const col of data) {
            await artQueries.deleteFromCollection(id, col.id_collection)
        }
        // Добавляем все коллекции, где isin = true
        for (const col of data) {
            if (col.isin) {
                await artQueries.addInCollection(id, col.id_collection)
            }
        }
        return res.status(200).json({message: "Запись успешно обновлена!"});
    }

    async getCollectionsReport(req, res) {
        const id = req.params.id;

        const collections = await collectionQueries.collectionById(id)
        const collection = collections[0];
        const books = await bookQueries.booksInCollection(id)
        const docs = await docQueries.docInCollection(id)
        const articles = await artQueries.articlesInCollection(id)

        const doc = new PDFDocument({ margin: 35 });
        doc.page.margins = { top: 72, left: 100, bottom: 72, right: 50 };
        doc.font('D:\\downloads\\Times New Roman\\target.ttf');
        doc.fontSize(18).text('Отчет о содержании выбранной коллекции', {align: 'center', paragraphGap: 25, underline: true});
        doc.fontSize(16).text(`Название коллекции: ${collection.name}`, {align: 'center', paragraphGap: 5});
        doc.fontSize(16).text(`Дата создания коллекции: ${(new Date(collection.date_of_creation)).toLocaleDateString()}`, {align: 'center', paragraphGap: 25});

        for (const item of books) {
            doc.fontSize(14).text(`Название книги: ${item.title}`, {align: "center", paragraphGap: 10});
            doc.fontSize(12).text(`Год публикации: ${item.year_of_publication}`, {align: "justify"});
            doc.fontSize(12).text(`Ключевые слова: ${item.keywords}`, {align: "justify"});
            doc.fontSize(12).text(`Жанр: ${item.genre}`, {align: "justify"});
            doc.fontSize(12).text(`Краткая аннотация: ${item.brief_annotation}`, {align: "justify"});
            doc.fontSize(12).text(`Расположение на компьютере: ${item.location.replace("myproto://", "")}`, {align: "justify"});
            doc.fontSize(12).text(`Автор(-ы): ${item.authors}`, {align: "justify"});
            doc.fontSize(12).text(`Издательство: ${item.pub_name}`, {align: "justify"});
            doc.fontSize(12).text(`Город издания: ${item.city_of_publication}`, {align: "justify", lineGap: 10});
        }

        for(const item of docs) {
            doc.fontSize(14).text(`Название документа: ${item.title}`, {align: "center", paragraphGap: 10});
            doc.fontSize(12).text(`Дата публикации: ${(new Date(item.date_of_publication)).toLocaleDateString()}`, {align: "justify"});
            doc.fontSize(12).text(`Расположение на компьютере: ${item.location.replace("myproto://", "")}`, {align: "justify"});
            doc.fontSize(12).text(`Автор(-ы): ${item.authors}`, {align: "justify", lineGap: 10});
        }

        for(const item of articles) {
            doc.fontSize(14).text(`Название статьи: ${item.title}`, {align: "center", paragraphGap: 10});
            doc.fontSize(12).text(`Дата публикации: ${(new Date(item.date_of_publication)).toLocaleDateString()}`, {align: "justify"});
            doc.fontSize(12).text(`Автор(-ы): ${item.authors}`, {align: "justify"});
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=Collection.pdf');
        doc.pipe(res);
        doc.end();
    }
}

module.exports = new CollectionController();