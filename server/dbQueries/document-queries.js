const pool = require('../db-connector');
const {request} = require('express');

const addDocument = (title, dateOfPub, idExpans, location, locationObl, idUser) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO course_work.library.document (id_document, title, date_of_publication, id_expansion, location, location_obl, id_user) " +
            "VALUES(DEFAULT, $1, $2, $3, $4, $5, $6)", [title, dateOfPub, idExpans, location, locationObl, idUser],
            (error, result) => {
            if (error) {
                reject(error);
            } else {
                request.isAdded = true;
                resolve("Документ успешно добавлен!");
            }
            });
    });
}

const deleteDocument = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM course_work.library.document WHERE id_document = $1", [id],
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

const allDocuments = () => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM course_work.library.document",
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.rows);
                }
            })
    });
}

const updateDocument = (idDoc, title, dateOfPub, idExpans, location, locationObl, idUser) => {
    return new Promise((resolve, reject) => {
        pool.query("UPDATE course_work.library.document SET title = $1, date_of_publication = $2, id_expansion = $3, location = $4, location_obl = $5, id_user = $6 WHERE id_document = $7",
            [title, dateOfPub, idExpans, location, locationObl, idUser, idDoc],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    request.isUpdated = true;
                    resolve("Документ успешно обновлен!");
                }
            });
    });
}

const documentById = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT name FROM course_work.library.document WHERE id_book = $1", [id],
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
    addDocument,
    deleteDocument,
    allDocuments,
    updateDocument,
    documentById
}