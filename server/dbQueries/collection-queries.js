const pool = require('../db-connector');
const {request} = require('express');

const addCollection = (title, userId) => {
    return new Promise((resolve, reject) => {
       pool.query("INSERT INTO course_work.library.collection (id_collection, name, date_of_creation, id_user) VALUES (DEFAULT, $1, DEFAULT, $2)",
           [title, userId], (error, result) => {
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

const allCollections = (userId) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM course_work.library.collection where id_user=$1", [userId],
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

const booksInCollections = (id, userId) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT\n" +
            "  id_collection,\n" +
            "  name,\n" +
            "  CASE WHEN array_agg(CAST(id_book AS TEXT)) @> ARRAY[$1::TEXT] THEN true ELSE false END AS isIn\n" +
            "FROM\n" +
            "  library.collection\n" +
            "LEFT JOIN\n" +
            "  library.book_collection USING (id_collection)\n" +
            "WHERE id_user=$2\n" +
            "GROUP BY\n" +
            "  id_collection,\n" +
            "  name", [id, userId],
            (error, result) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result.rows);
                }
            })
    })
}
const docInCollections = (id, userId) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT\n" +
            "  id_collection,\n" +
            "  name,\n" +
            "  CASE WHEN array_agg(CAST(id_document AS TEXT)) @> ARRAY[$1::TEXT] THEN true ELSE false END AS isIn\n" +
            "FROM\n" +
            "  library.collection\n" +
            "LEFT JOIN\n" +
            "  library.document_collection USING (id_collection)\n" +
            "WHERE id_user=$2\n" +
            "GROUP BY\n" +
            "  id_collection,\n" +
            "  name", [id, userId],
            (error, result) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result.rows);
                }
            })
    })
}
const articleInCollections = (id, userId) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT\n" +
            "  id_collection,\n" +
            "  name,\n" +
            "  CASE WHEN array_agg(CAST(id_article AS TEXT)) @> ARRAY[$1::TEXT] THEN true ELSE false END AS isIn\n" +
            "FROM\n" +
            "  library.collection\n" +
            "LEFT JOIN\n" +
            "  library.article_collection USING (id_collection)\n" +
            "WHERE id_user=$2\n" +
            "GROUP BY\n" +
            "  id_collection,\n" +
            "  name", [id, userId],
            (error, result) => {
                if (error) {
                    reject(error)
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
    collectionById,
    booksInCollections,
    docInCollections,
    articleInCollections
}