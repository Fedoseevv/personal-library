const pool = require('../db-connector');
const {request} = require('express');

const addAuthor = (name, patronymic, surname, birthDate) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO course_work.library.author (id_author, name, patronymic, surname, date_of_birth)" +
            "VALUES (DEFAULT, $1, $2, $3, $4)", [name, patronymic, surname, birthDate],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    request.isAdded = true;
                    resolve("Автор успешно добавлен!");
                }
            })
    });
}

const deleteAuthor = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM course_work.library.author WHERE id = $1", [id],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    request.isDeleted = true;
                    resolve("Документ успешно удален!")
                }
            })
    });
}

const allAuthors = () => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM course_work.library.author",
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.rows);
                }
            })
    });
}

const updateAuthor = (authorId, name, patronymic, surname, birthDate) => {
    return new Promise((resolve, reject) => {
        pool.query("UPDATE course_work.library.author SET name = $1, patronymic = $2, surname = $3, date_of_birth = $4 WHERE id_author = $5",
            [name, patronymic, surname, birthDate, authorId],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    request.isUpdated = true;
                    resolve("Автор успешно обновлен!")
                }
            });
    });
}

const authorById = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT name FROM course_work.library.author WHERE id_author = $1", [id],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.rows);
                }
            })
    });
}

module.exports = {
    addAuthor,
    deleteAuthor,
    allAuthors,
    updateAuthor,
    authorById
}