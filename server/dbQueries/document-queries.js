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
const deleteDocAuthor = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM course_work.library.document_author WHERE id_document = $1", [id],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    request.isDeleted = true;
                    resolve("Запись успешно удален!")
                }
            })
    });
}
const deleteDocCollection = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM course_work.library.document_collection WHERE id_document = $1", [id],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    request.isDeleted = true;
                    resolve("Запись успешно удален!")
                }
            })
    });
}

const allDocuments = () => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT d.id_document, title, date_of_publication, location, location_obl,\n" +
            "        array_agg(da.id_da) as da_array,\n" +
            "        array_agg(a.id_author) as authors_id,\n" +
            "        array_agg(concat(surname, ' ', a.name, ' ', patronymic, ', ', EXTRACT(YEAR FROM date_of_birth), ' г.р.')) AS authors\n" +
            "FROM course_work.library.document d, course_work.library.document_author da, course_work.library.author a\n" +
            "WHERE d.id_document=da.id_document AND da.id_author=a.id_author\n" +
            "GROUP BY d.id_document, title, date_of_publication, location, location_obl",
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
        pool.query("SELECT d.id_document, title, date_of_publication, location, location_obl,\n" +
            "        array_agg(da.id_da) as da_array,\n" +
            "        array_agg(a.id_author) as authors_id,\n" +
            "        array_agg(concat(surname, ' ', a.name, ' ', patronymic, ', ', EXTRACT(YEAR FROM date_of_birth), ' г.р.')) AS authors\n" +
            "FROM course_work.library.document d, course_work.library.document_author da, course_work.library.author a\n" +
            "WHERE d.id_document=da.id_document AND da.id_author=a.id_author\n" +
            "GROUP BY d.id_document, title, date_of_publication, location, location_obl\n" +
            "HAVING d.id_document IN (SELECT id_document\n" +
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
        pool.query("SELECT d.id_document, title, date_of_publication, location, location_obl,\n" +
            "        array_agg(da.id_da) as da_array,\n" +
            "        array_agg(a.id_author) as authors_id,\n" +
            "        array_agg(concat(surname, ' ', a.name, ' ', patronymic, ', ', EXTRACT(YEAR FROM date_of_birth), ' г.р.')) AS authors\n" +
            "FROM course_work.library.document d, course_work.library.document_author da, course_work.library.author a\n" +
            "WHERE d.id_document=da.id_document AND da.id_author=a.id_author\n" +
            "GROUP BY d.id_document, title, date_of_publication, location, location_obl\n" +
            "HAVING d.id_document NOT IN (SELECT id_document\n" +
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
        pool.query("SELECT d.id_document, title, date_of_publication, location, location_obl,\n" +
            "        array_agg(da.id_da) as da_array,\n" +
            "        array_agg(a.id_author) as authors_id,\n" +
            "        array_agg(concat(surname, ' ', a.name, ' ', patronymic, ', ', EXTRACT(YEAR FROM date_of_birth), ' г.р.')) AS authors\n" +
            "FROM course_work.library.document d, course_work.library.document_author da, course_work.library.author a\n" +
            "WHERE d.id_document=da.id_document AND da.id_author=a.id_author\n" +
            "GROUP BY d.id_document, title, date_of_publication, location, location_obl\n" +
            "HAVING d.id_document = $1", [id],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.rows);
                }
            })
    });
}

const findByTitle = (title) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT d.id_document, title, date_of_publication, location, location_obl,\n" +
            "        array_agg(da.id_da) as da_array,\n" +
            "        array_agg(a.id_author) as authors_id,\n" +
            "        array_agg(concat(surname, ' ', a.name, ' ', patronymic, ', ', EXTRACT(YEAR FROM date_of_birth), ' г.р.')) AS authors\n" +
            "FROM course_work.library.document d, course_work.library.document_author da, course_work.library.author a\n" +
            "WHERE d.id_document=da.id_document AND da.id_author=a.id_author\n" +
            "GROUP BY d.id_document, title, date_of_publication, location, location_obl\n" +
            "HAVING LOWER(d.title) LIKE $1", [`%${title.toLowerCase()}%`],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.rows);
                }
            })
    });
}
const findByAuthor = (someName) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT d.id_document, title, date_of_publication, location, location_obl, \n" +
            "                    array_agg(da.id_da) as da_array, \n" +
            "                    array_agg(a.id_author) as authors_id, \n" +
            "                    array_agg(concat(surname, ' ', a.name, ' ', patronymic, ', ', EXTRACT(YEAR FROM date_of_birth), ' г.р.')) AS authors \n" +
            "            FROM course_work.library.document d, course_work.library.document_author da, course_work.library.author a \n" +
            "            WHERE d.id_document=da.id_document AND da.id_author=a.id_author \n" +
            "            GROUP BY d.id_document, title, date_of_publication, location, location_obl \n" +
            "\tHAVING array_to_string(array_agg(LOWER(concat(a.surname, ' ', a.name, ' ', a.patronymic, ', ', EXTRACT(YEAR FROM a.date_of_birth), ' г.р.'))), ',') " +
            "LIKE $1", [`%${someName.toLowerCase()}%`],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.rows);
                }
            })
    });
}
const findByDate = (date) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT d.id_document, title, date_of_publication, location, location_obl,\n" +
            "        array_agg(da.id_da) as da_array,\n" +
            "        array_agg(a.id_author) as authors_id,\n" +
            "        array_agg(concat(surname, ' ', a.name, ' ', patronymic, ', ', EXTRACT(YEAR FROM date_of_birth), ' г.р.')) AS authors\n" +
            "FROM course_work.library.document d, course_work.library.document_author da, course_work.library.author a\n" +
            "WHERE d.id_document=da.id_document AND da.id_author=a.id_author\n" +
            "GROUP BY d.id_document, title, date_of_publication, location, location_obl\n" +
            "HAVING d.date_of_publication=$1", [date],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.rows);
                }
            })
    });
}

const authorsByDocId = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT id_document, array_agg(id_author) as authors " +
            "FROM course_work.library.document_author WHERE id_document=$1 GROUP BY id_document", [id],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.rows);
                }
            })
    })
}

const deleteAllFromCollection = (colId) => {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM course_work.library.document_collection WHERE id_collection=$1", [colId],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve("Записи удалены");
                }
            })
    })
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
    addInCollection,
    findByTitle,
    findByAuthor,
    findByDate,

    deleteDocAuthor,
    deleteDocCollection,
    authorsByDocId,
    deleteAllFromCollection
}