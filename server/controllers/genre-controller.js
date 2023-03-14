const ApiError = require('../handlers/api-error');
const genreQueries = require('../dbQueries/genre-queries');

class GenreController {
    async addGenre(req, res, next) {
        try {
            const {name} = req.query;
            if (!name) {
                return next(ApiError.badReq("Не указан жанр!"));
            }
            await genreQueries.addGenre(name)
                .then(response => {
                    return res.status(200).send(response);
                });
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }

    async deleteGenre(req, res, next) {
        try {
            const {name} = req.query;
            if (!name) {
                return next(ApiError.badReq("Не указан жанр!"));
            }
            await genreQueries.deleteGenre(name)
                .then(response => {
                    return res.status(200).send(response);
                });
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }

    async allGenres(req, res) {
        try {
            await genreQueries.allGenres()
                .then(response => {
                    return res.status(200).send(response);
                });
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }

    async updateGenre(req, res, next) {
        try {
            const {id, name} = req.query;
            if (!name || !id) {
                return next(ApiError.badReq("Неверно указан список параметров!"));
            }
            await genreQueries.updateGenre(id, name)
                .then(response => {
                    return res.status(200).send(response);
                });
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    }
}

module.exports = new GenreController();