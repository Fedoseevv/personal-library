const ApiError = require('../handlers/api-error');
const publishingQueries = require('../dbQueries/publishing-quieries');

class PublishingController {
    async addPublish(req, res, next) {
        try {
            const {name, city} = req.query;
            if (!name || !city) {
                return next(ApiError.badReq("Неверно указаны параметры запроса!"));
            }
            await publishingQueries.addPublish(name, city)
                .then(response => {
                   return res.status(200).send(response);
                });
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }

    async deletePublish(req, res, next) {
        try {
            const {id} = req.query;
            if (!id) {
                return next(ApiError.badReq("Не указан параметр!"));
            }
            await publishingQueries.deletePublish(id)
                .then(response => {
                    return res.status(200).send(response);
                });
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }

    async allPublishes(req, res) {
        try {
            await publishingQueries.allPublishes()
                .then(response => {
                    return res.status(200).send(response);
                });
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }

    async updatePublish(req, res, next) {
        try {
            const {id, name, city} = req.query;
            if (!name || !id || !city) {
                return next(ApiError.badReq("Неверно указан список параметров!"));
            }
            await publishingQueries.updatePublish(id, name, city)
                .then(response => {
                    return res.status(200).send(response);
                });
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }
}

module.exports = new PublishingController();