const pool = require('../db-connector');
const {request} = require('express');

const addArticle = (title, link, publishDate, userId) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO course_work.library.article (id_article, title, hyperlink, date_of_publication, id_user) " +
            "VALUES (DEFAULT, $1, $2, $3, $4)", [title, link, publishDate, userId],
            (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    results.isAdded = true;
                    resolve("Статья успешно добавлена");
                }
            })
    });
}

const deleteArticle = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM course_work.library.article WHERE id_article = $1", [id],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    request.isDeleted = true;
                    resolve("Статья успешно удалена!")
                }
            })
    });
}

const allArticles = () => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM course_work.library.article",
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.rows);
                }
            })
    });
}

const updateArticle = (idArt, title, link, publishDate, userId) => {
    return new Promise((resolve, reject) => {
       pool.query("UPDATE course_work.library.article SET title = $1, hyperlink = $2, date_of_publication = $3, id_user = $4 WHERE id_article = $5",
           [title, link, publishDate, userId, idArt],
           (error, result) => {
            if (error) {
                reject(error);
            } else {
                result.isUpdated = true;
                resolve("Статья успешно обновлена!");
            }
           });
    });
}

const articleById = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT name FROM course_work.library.article WHERE id_article = $1", [id],
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
    addArticle,
    deleteArticle,
    allArticles,
    updateArticle,
    articleById
}