const pool = require('../db-connector');
const {request} = require('express');

const addCollection = (title) => {
    return new Promise((resolve, reject) => {
       pool.query("INSERT INTO course_work.library.collection (id_collection, name, date_of_creation) VALUES (DEFAULT, $1, DEFAULT)",
           [title], (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    request.isAdded = true;
                    resolve("Запись успешно добавлена!");
                }
           })
    });
}

const deleteCollection = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM course_work.library.collection WHERE id_collection = $1", [id],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    request.isDeleted = true;
                    resolve(result.rows[0]);
                }
            })
    })
}

const allCollections = () => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM course_work.library.collection", [],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.rows);
                }
            })
    })
}

const collectionById = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM course_work.library.collection WHERE id_collection = $1", [id],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.rows);
                }
            })
    })
}

module.exports = {
    addCollection,
    deleteCollection,
    allCollections,
    collectionById
}