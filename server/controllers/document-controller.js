const ApiError = require('../handlers/api-error');
const documentQueries = require('../dbQueries/document-queries');

class DocumentController {
    async addDocument(req, res, next) {
        try {
            const {title, dateOfPub, idExpans, location, locationObl, idUser} = req.body;
            if (req.body.isEmpty) {
                return next(ApiError.badReq("Тело запроса пустое!"));
            }
            await documentQueries.addDocument(title, dateOfPub, idExpans, location, locationObl, idUser)
                .then(response => {
                    return res.status(200).send(response);
                });
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
    async updateBook(req, res, next) {
        try {
            const {idDoc, title, dateOfPub, idExpans, location, locationObl, idUser} = req.body;
            if (req.body.isEmpty) {
                return next(ApiError.badReq("Тело запроса пустое!"));
            }
            await documentQueries.updateDocument(idDoc, title, dateOfPub, idExpans, location, locationObl, idUser)
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