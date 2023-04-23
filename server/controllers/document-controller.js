const ApiError = require('../handlers/api-error');
const documentQueries = require('../dbQueries/document-queries');

class DocumentController {
    async addDocument(req, res, next) {
        try {
            const {title, dateOfPub, location, locationObl, authorId} = req.body;
            console.log(req.body)
            if (req.body.isEmpty) {
                return next(ApiError.badReq("Тело запроса пустое!"));
            }
            await documentQueries.addDocument(title, dateOfPub, location, locationObl, 1)
            await documentQueries.maxDocId()
                .then(response => {
                    const docId = response["max_id"]
                    documentQueries.addDocAuthor(docId, authorId)
                })

        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }
    async deleteDocument(req, res, next) {
        try {
            const {id} = req.query;
            if (!id) {
                return next(ApiError.badReq("Идентификатор документа не указан!"));
            }
            await documentQueries.deleteDocument(id)
                .then(response => {
                    return res.status(200).send(response);
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

    async updateBook(req, res, next) {
        try {
            const {id_document, id_da, title, date_of_publication, location, location_obl, id_author} = req.body;
            if (req.body.isEmpty) {
                return next(ApiError.badReq("Тело запроса пустое!"));
            }
            console.log([id_document, id_da, title, date_of_publication, location, location_obl, id_author].join("\n"))
            await documentQueries.updateDocument(id_document, title, date_of_publication, location, location_obl)
            await documentQueries.updateDocumentAuthor(id_da, id_document, id_author)
                .then(response => {
                    return res.status(201).json({message: response});
                })
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
}

module.exports = new DocumentController();