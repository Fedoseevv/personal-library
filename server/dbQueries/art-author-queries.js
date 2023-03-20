const pool = require('../db-connector');
const {request} = require('express');

const addRec = (id_article, id_author) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO course_work.library.article_author (id_aa, id_article, id_author)" +
            "VALUES (DEFAULT, $1, $2)", [id_article, id_author],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    request.isAdded = true;
                    resolve("Запись успешно добавлена!")
                }
            });
    });
}
const deleteRec = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM course_work.library.article_author WHERE id_aa = $1", [id],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    request.isDeleted = true;
                    resolve("Запись успешно удалена!")
                }
            })
    });
}
const allRec = () => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM course_work.library.article_author",
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.rows);
                }
            })
    });
}
const updateRec = (id_article, id_author) => {
    return new Promise((resolve, reject) => {
        pool.query("UPDATE course_work.library.article_author SET id_article = $1, id_author = $2",
            [id_article, id_author],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    request.isUpdated = true;
                    resolve("Запись успешно обновлена!");
                }
            });
    });
}


module.exports = {
    addRec,
    deleteRec,
    allRec,
    updateRec
}