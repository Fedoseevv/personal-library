const pool = require('../db-connector');
const {request} = require('express');

const addBook = (title, year, keywords, cover, id_genre, annotation, expansion, location, locationObl, user) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO course_work.library.book (id_book, title, year_of_publication, keywords, cover, id_genre, brief_annotation, id_expansion, location, location_obl, id_user) " +
            "VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", [title, year, keywords, cover, id_genre, annotation, expansion, location, locationObl, user],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    request.isAdded = true;
                    resolve("Книга успешно добавлена!")
                }
            })
    });
}

const deleteBook = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM course_work.library.book WHERE id = $1", [id],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    request.isDeleted = true;
                    resolve("Книга успешно удалена!")
                }
            })
    });
}

const allBooks = () => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM course_work.library.book",
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.rows);
                }
            })
    });
}

const updateBook = (id, title, year, keywords, cover, id_genre, annotation, expansion, location, locationObl, user) => {
    return new Promise((resolve, reject) => {
        pool.query("UPDATE course_work.library.book SET title = $1, year_of_publication = $2, keywords = $3, cover = $4, id_genre = $5, brief_annotation = $6, id_expansion = $7, location = $8, location_obl = $9, id_user = $10 WHERE id_book = $11",
            [title, year, keywords, cover, id_genre, annotation, expansion, location, locationObl, user, id],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    request.isUpdated = true;
                    resolve("Книга успешно обновлена!")
                }
            })
    });
}

const bookById = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT name FROM course_work.library.book WHERE id_book = $1", [id],
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
    addBook,
    deleteBook,
    allBooks,
    updateBook,
    bookById
}