const pool = require('../db-connector');
const {request} = require('express');

const addDocument = (title, dateOfPub, location, locationObl, idUser) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO course_work.library.document (id_document, title, date_of_publication, location, location_obl, id_user) " +
            "VALUES(DEFAULT, $1, $2, $3, $4, $5)", [title, dateOfPub, location, locationObl, idUser],
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

const maxDocId = () => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT MAX(id_document) as max_id FROM course_work.library.document", [],
            (error, result) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result.rows[0])
                }
            })
    })
}

const addDocAuthor = (docId, authorId) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO course_work.library.document_author (id_da, id_document, id_author) VALUES (DEFAULT, $1, $2)",
            [docId, authorId],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    request.isAdded = true;
                    resolve("Запись успешно добавлена")
                }
            })
    })
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
        pool.query("SELECT * \n" +
            "FROM course_work.library.document d, course_work.library.document_author da, course_work.library.author a\n" +
            "WHERE d.id_document=da.id_document AND da.id_author=a.id_author",
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.rows);
                }
            })
    });
}

const docInCollection = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT *\n" +
            "FROM course_work.library.document d, course_work.library.document_author da, course_work.library.author a\n" +
            "WHERE d.id_document=da.id_document AND da.id_author=a.id_author\n" +
            "AND d.id_document IN (SELECT id_document\n" +
            "FROM course_work.library.document_collection\n" +
            "WHERE id_collection = $1)", [id],
            (error, result) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result.rows);
                }
            })
    })
}

const docNotInCollection = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT *\n" +
            "FROM course_work.library.document d, course_work.library.document_author da, course_work.library.author a\n" +
            "WHERE d.id_document=da.id_document AND da.id_author=a.id_author\n" +
            "AND d.id_document NOT IN (SELECT id_document\n" +
            "FROM course_work.library.document_collection\n" +
            "WHERE id_collection = $1)", [id],
            (error, result) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result.rows);
                }
            })
    })
}

const updateDocument = (id_document, title, date_of_publication, location, location_obl) => {
    return new Promise((resolve, reject) => {
        pool.query("UPDATE course_work.library.document SET title = $1, date_of_publication = $2, location = $3, location_obl = $4, id_user = 1 WHERE id_document = $5",
            [title, date_of_publication, location, location_obl, id_document],
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
const updateDocumentAuthor = (id_da, id_document, id_author) => {
    return new Promise((resolve, reject) => {
        pool.query("UPDATE course_work.library.document_author SET id_document = $1, id_author = $2 WHERE id_da = $3", [id_document, id_author, id_da],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    request.isUpdated = true;
                    resolve("Запись успешно обновлена!");
                }
            })
    })
}

const deleteFromCollection = (docId, colId) => {
  return new Promise((resolve, reject) => {
      pool.query("DELETE FROM course_work.library.document_collection WHERE id_document=$1 AND id_collection=$2", [docId, colId],
          (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve("Запись успешно удалена!");
            }
          })
  })
}

const addInCollection = (docId, colId) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO course_work.library.document_collection (id_dc, id_document, id_collection) VALUES (DEFAULT, $1, $2)", [docId, colId],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve("Запись успешно добавлена!");
                }
            })
    })
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
    documentById,
    maxDocId,
    addDocAuthor,
    updateDocumentAuthor,
    docInCollection,
    docNotInCollection,
    deleteFromCollection,
    addInCollection
}