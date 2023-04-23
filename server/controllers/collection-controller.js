const ApiError = require('../handlers/api-error');
const collectionQueries = require('../dbQueries/collection-queries');

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
            await collectionQueries.allCollections()
                .then(response => {
                    return res.status(200).send(response);
                })
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }
}

module.exports = new CollectionController();