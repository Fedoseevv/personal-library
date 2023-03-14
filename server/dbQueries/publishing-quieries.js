const pool = require('../db-connector');
const {request} = require('express');

const addPublish = (name, city) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO course_work.library.publishing_house (id_publishing_house, name, city_of_publication) VALUES (3, $1, $2)", [name, city],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    request.isAdded = true;
                    resolve("Издательство успешно добавлено!");
                }
            })
    });
}

const deletePublish = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM course_work.library.publishing_house WHERE id_publishing_house = $1", [id],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    request.isAdded = true;
                    resolve("Издательство успешно удалено!");
                }
            })
    });
}

const allPublishes = () => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM course_work.library.publishing_house",
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.rows);
                }
            })
    });
}

const updatePublish = (id, name, city) => {
    return new Promise((resolve, reject) => {
        pool.query("UPDATE course_work.library.publishing_house SET name = $1, city_of_publication = $2 WHERE id_publishing_house = $3", [name, city, id],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    request.isUpdated = true;
                    resolve("Издательство успешно обновлено!")
                }
            })
    });
}

const publishById = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT name FROM course_work.library.publishing_house WHERE id_publishing_house = $1", [id],
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
    addPublish,
    deletePublish,
    allPublishes,
    updatePublish,
    publishById
}