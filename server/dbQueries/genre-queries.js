const pool = require('../db-connector');
const {request} = require('express');

const addGenre = (name) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO course_work.library.genre (id_genre, name) VALUES (2, $1)", [name],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    request.isAdded = true;
                    resolve("Жанр успешно добавлен!")
                }
            })
    });
}

const deleteGenre = (name) => {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM course_work.library.genre WHERE name = $1", [name],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    request.isDeleted = true;
                    resolve("Жанр успешно удален!")
                }
            })
    });
}

const allGenres = () => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM course_work.library.genre",
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.rows);
                }
            })
    });
}

const updateGenre = (id, name) => {
    return new Promise((resolve, reject) => {
        pool.query("UPDATE course_work.library.genre SET name = $1 WHERE id_genre = $2", [name, id],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    request.isUpdated = true;
                    resolve("Жанр успешно обновлен!")
                }
            })
    });
}

const genreById = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT name FROM course_work.library.genre WHERE id_genre = $1", [id],
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
    addGenre,
    deleteGenre,
    allGenres,
    updateGenre,
    genreById
}