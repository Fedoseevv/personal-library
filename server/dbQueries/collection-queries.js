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

const booksInCollections = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT\n" +
            "  id_collection,\n" +
            "  name,\n" +
            "  CASE WHEN array_agg(CAST(id_book AS TEXT)) @> ARRAY[$1::TEXT] THEN true ELSE false END AS isIn\n" +
            "FROM\n" +
            "  library.collection\n" +
            "LEFT JOIN\n" +
            "  library.book_collection USING (id_collection)\n" +
            "GROUP BY\n" +
            "  id_collection,\n" +
            "  name", [id],
            (error, result) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result.rows);
                }
            })
    })
}
const docInCollections = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT\n" +
            "  id_collection,\n" +
            "  name,\n" +
            "  CASE WHEN array_agg(CAST(id_document AS TEXT)) @> ARRAY[$1::TEXT] THEN true ELSE false END AS isIn\n" +
            "FROM\n" +
            "  library.collection\n" +
            "LEFT JOIN\n" +
            "  library.document_collection USING (id_collection)\n" +
            "GROUP BY\n" +
            "  id_collection,\n" +
            "  name", [id],
            (error, result) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result.rows);
                }
            })
    })
}
const articleInCollections = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT\n" +
            "  id_collection,\n" +
            "  name,\n" +
            "  CASE WHEN array_agg(CAST(id_article AS TEXT)) @> ARRAY[$1::TEXT] THEN true ELSE false END AS isIn\n" +
            "FROM\n" +
            "  library.collection\n" +
            "LEFT JOIN\n" +
            "  library.article_collection USING (id_collection)\n" +
            "GROUP BY\n" +
            "  id_collection,\n" +
            "  name", [id],
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