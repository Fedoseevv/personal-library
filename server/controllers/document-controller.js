const ApiError = require('../handlers/api-error');
const documentQueries = require('../dbQueries/document-queries');
const PDFDocument = require("pdfkit");

class DocumentController {
    async addDocument(req, res, next) {
        try {
            const {title, dateOfPub, location, locationObl, authorsId} = req.body;
            console.log(req.body)
            if (req.body.isEmpty) {
                return next(ApiError.badReq("Тело запроса пустое!"));
            }
            await documentQueries.addDocument(title, dateOfPub, location, locationObl, 1)
            await documentQueries.maxDocId()
                .then(async response => {
                    const docId = response["max_id"]
                    for(const id of authorsId) {
                        await documentQueries.addDocAuthor(docId, id);
                    }
                })
            return res.status(201).json({message: "Запись успешно добавлена!"});
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }
    async deleteDocument(req, res, next) {
        try {
            const {id} = req.body;
            if (!id) {
                return next(ApiError.badReq("Идентификатор документа не указан!"));
            }
            await documentQueries.deleteDocAuthor(id)
            await documentQueries.deleteDocCollection(id)
            await documentQueries.deleteDocument(id)
                .then(response => {
                    return res.status(200).json({message: response});
                });
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }
    async allDocuments(req, res) {
        try {
            await documentQueries.allDocuments()
                .then(response => {
                    return res.status(200).send(response);
                });
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }
    async docInCollection(req, res) {
        try {
            const {id} = req.body;
            await documentQueries.docInCollection(id)
                .then(response => {
                    return res.status(200).send(response);
                })
        } catch (e) {
            return res.status(400).json({ message: e.message });
        }
    }
    async docNotInCollection(req, res) {
        try {
            const {id} = req.body;
            await documentQueries.docNotInCollection(id)
                .then(response => {
                    return res.status(200).send(response);
                })
        } catch (e) {
            return res.status(400).json({ message: e.message });
        }
    }

    async deleteFromCollection(req, res) {
        try {
            const {docId, colId} = req.body;
            console.log(docId, colId)
            await documentQueries.deleteFromCollection(docId, colId)
                .then(response => {
                    return res.status(200).json({message: response});
                })

        } catch (e) {
            return res.status(400).json({ message: e.message });
        }
    }
    async addInCollection(req, res) {
        try {
            const {docId, colId} = req.body;
            console.log(docId, colId)
            await documentQueries.addInCollection(docId, colId)
                .then(response => {
                    return res.status(200).json({message: response});
                })

        } catch (e) {
            return res.status(400).json({ message: e.message });
        }
    }

    async updateDocument(req, res, next) {
        try {
            const {id_document, id_da, title, date_of_publication, location, location_obl, id_authors} = req.body;
            if (req.body.isEmpty) {
                return next(ApiError.badReq("Тело запроса пустое!"));
            }
            console.log(req.body);
            await documentQueries.updateDocument(id_document, title, date_of_publication, location, location_obl)

            console.log(id_authors)
            const authorQuery = await documentQueries.authorsByDocId(id_document);
            const currentAuthors = authorQuery[0].authors;
            console.log(currentAuthors)
            if (id_authors.length === currentAuthors.length &&
                id_authors.sort().every((value, index) =>
                    value === currentAuthors.sort()[index])) {
                console.log("Авторы не изменились")
            } else {
                console.log("авторы изменились")
                await documentQueries.deleteDocAuthor(id_document)
                for(const id of id_authors) {
                    await documentQueries.addDocAuthor(id_document, id);
                }
            }

            return res.status(200).json({message: "Запись успешно обновлена"});
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }
    async docById(req, res, next) {
        try {
            const {id} = req.query;
            if (!id) {
                return next(ApiError.badReq("Идентификатор документа не указан!"));
            }
            await documentQueries.documentById(id)
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
            console.log(title)
            if (!title) {
                return next(ApiError.badReq("Тело запроса пустое!"));
            }
            await documentQueries.findByTitle(title)
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
            console.log(author)
            if (!author) {
                return next(ApiError.badReq("Тело запроса пустое!"));
            }
            await documentQueries.findByAuthor(author)
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

            await documentQueries.findByDate(date)
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
        const docs = await documentQueries.documentById(id);
        const document = docs[0];

        const doc = new PDFDocument({ margin: 35 });
        doc.page.margins = { top: 72, left: 100, bottom: 72, right: 50 };
        doc.font('D:\\downloads\\Times New Roman\\target.ttf');
        doc.fontSize(18).text('Отчет о выбранном документе', {align: 'center', paragraphGap: 25, underline: true});

        doc.fontSize(14).text(`Название документа: ${document.title}`, {align: "center", paragraphGap: 10});
        doc.fontSize(12).text(`Дата публикации: ${new Date(document.date_of_publication).toLocaleDateString()}`, {align: "justify"});
        doc.fontSize(12).text(`Расположение на компьютере: ${document.location.replace("myproto://", "")}`, {align: "justify"});
        doc.fontSize(12).text(`Автор(-ы): ${document.authors}`, {align: "justify"});

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=book.pdf');
        doc.pipe(res);
        doc.end();
    }
}

module.exports = new DocumentController();