const ApiError = require('../handlers/api-error');

module.exports = function (err, req, res, next) {
    if (err instanceof ApiError) { // Если ошибка из нашего списка
        return res.status(err.status).json({message: err.message}); // Тогда отправляем код ошибки и сообщение
    }
    return res.status(500).json({message: "Непредвиденная ошибка"});
}