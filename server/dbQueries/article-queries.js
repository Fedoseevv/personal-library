const pool = require('../db-connector');
const {request} = require('express');

const addArticle = (title, link, publishDate, userId, keywords) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO course_work.library.article (id_article, title, hyperlink, date_of_publication, id_user, keywords) " +
            "VALUES (DEFAULT, $1, $2, $3, $4, $5)", [title, link, publishDate, userId, keywords],
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

const maxArtId = () => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT MAX(id_article) as max_id FROM course_work.library.article", [],
            (error, result) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result.rows[0])
                }
            })
    })
}

const addRec = (id_article, id_author) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO course_work.library.article_author (id_aa, id_article, id_author)" +
            "VALUES (DEFAULT, $1, $2)", [id_article, id_author],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    request.isAdded = true;
                    resolve("Запись успешно добавлена!")
                }
            });
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
const deleteAuthorArticle = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM course_work.library.article_author WHERE id_article = $1", [id],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    request.isDeleted = true;
                    resolve("Запись успешно удалена!")
                }
            })
    });
}
const deleteArticleCollection = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM course_work.library.article_collection WHERE id_article = $1", [id],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    request.isDeleted = true;
                    resolve("Запись успешно удалена!")
                }
            })
    });
}

const allArticles = (userId) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT ar.id_user, ar.id_article, title, date_of_publication, hyperlink, keywords,\n" +
            "\tarray_agg(aa.id_aa) as aa_array,\n" +
            "\tarray_agg(a.id_author) as authors_id,\n" +
            "\tarray_agg(concat(surname, ' ', a.name, ' ', patronymic, ', ', EXTRACT(YEAR FROM date_of_birth), ' г.р.')) AS authors\n" +
            "FROM course_work.library.article ar, course_work.library.article_author aa, course_work.library.author a\n" +
            "WHERE ar.id_article=aa.id_article AND aa.id_author=a.id_author AND ar.id_user = $1\n" +
            "GROUP BY ar.id_article, title, date_of_publication, hyperlink, keywords", [userId],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.rows);
                }
            })
    });
}

const articlesInCollection = (id, userId) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT ar.id_user, ar.id_article, title, date_of_publication, hyperlink, keywords,\n" +
            "\tarray_agg(aa.id_aa) as aa_array,\n" +
            "\tarray_agg(a.id_author) as authors_id,\n" +
            "\tarray_agg(concat(surname, ' ', a.name, ' ', patronymic, ', ', EXTRACT(YEAR FROM date_of_birth), ' г.р.')) AS authors\n" +
            "FROM course_work.library.article ar, course_work.library.article_author aa, course_work.library.author a\n" +
            "WHERE ar.id_article=aa.id_article AND aa.id_author=a.id_author AND ar.id_user = $2\n" +
            "GROUP BY ar.id_article, title, date_of_publication, hyperlink, keywords\n" +
            "HAVING ar.id_article IN (SELECT id_article\n" +
            "FROM course_work.library.article_collection\n" +
            "WHERE id_collection = $1)", [id, userId],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.rows);
                }
            })
    })
}

const articlesNotInCollection = (id, userId) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT ar.id_article, title, date_of_publication, hyperlink, keywords,\n" +
            "\tarray_agg(aa.id_aa) as aa_array,\n" +
            "\tarray_agg(a.id_author) as authors_id,\n" +
            "\tarray_agg(concat(surname, ' ', a.name, ' ', patronymic, ', ', EXTRACT(YEAR FROM date_of_birth), ' г.р.')) AS authors\n" +
            "FROM course_work.library.article ar, course_work.library.article_author aa, course_work.library.author a\n" +
            "WHERE ar.id_article=aa.id_article AND aa.id_author=a.id_author AND ar.id_user = $2\n" +
            "GROUP BY ar.id_article, title, date_of_publication, hyperlink, keywords\n" +
            "HAVING ar.id_article NOT IN (SELECT id_article\n" +
            "FROM course_work.library.article_collection\n" +
            "WHERE id_collection = $1)", [id, userId],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.rows);
                }
            })
    })
}

const updateArticle = (id_article, title, hyperlink, date_of_publication, userId, keywords) => {
    return new Promise((resolve, reject) => {
       pool.query("UPDATE course_work.library.article SET title = $1, hyperlink = $2, date_of_publication = $3, id_user = $5, keywords = $6 " +
           "WHERE id_article = $4",
           [title, hyperlink, date_of_publication, id_article, userId, keywords],
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
const updateArticleAuthor = (id_aa, id_author, id_article) => {
    return new Promise((resolve, reject) => {
        pool.query("UPDATE course_work.library.article_author SET id_author = $1, id_article = $2 WHERE id_aa = $3", [id_author, id_article, id_aa],
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

const deleteFromCollection = (artId, colId) => {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM course_work.library.article_collection WHERE id_article=$1 AND id_collection=$2", [artId, colId],
            (error, result) => {
                if (error) {
                    reject(error)
                } else {
                    request.isDeleted = true;
                    resolve("Запись успешно удалена!")
                }
            })
    })
}

const addInCollection = (artId, colId) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO course_work.library.article_collection (id_ac, id_article, id_collection) VALUES (DEFAULT, $1, $2)", [artId, colId],
            (error, result) => {
                if (error) {
                    reject(error)
                } else {
                    request.isDeleted = true;
                    resolve("Запись успешно добавлена!")
                }
            })
    })
}

const articleById = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT ar.id_article, title, date_of_publication, hyperlink, keywords,\n" +
            "\tarray_agg(aa.id_aa) as aa_array,\n" +
            "\tarray_agg(a.id_author) as authors_id,\n" +
            "\tarray_agg(concat(surname, ' ', a.name, ' ', patronymic, ', ', EXTRACT(YEAR FROM date_of_birth), ' г.р.')) AS authors\n" +
            "FROM course_work.library.article ar, course_work.library.article_author aa, course_work.library.author a\n" +
            "WHERE ar.id_article=aa.id_article AND aa.id_author=a.id_author\n" +
            "GROUP BY ar.id_article, title, date_of_publication, hyperlink, keywords\n" +
            "HAVING ar.id_article = $1", [id],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.rows);
                }
            })
    });
}

const findByTitle = (title, userId) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT ar.id_user, ar.id_article, title, date_of_publication, hyperlink, keywords,\n" +
            "\tarray_agg(aa.id_aa) as aa_array,\n" +
            "\tarray_agg(a.id_author) as authors_id,\n" +
            "\tarray_agg(concat(surname, ' ', a.name, ' ', patronymic, ', ', EXTRACT(YEAR FROM date_of_birth), ' г.р.')) AS authors\n" +
            "FROM course_work.library.article ar, course_work.library.article_author aa, course_work.library.author a\n" +
            "WHERE ar.id_article=aa.id_article AND aa.id_author=a.id_author AND ar.id_user = $2\n" +
            "GROUP BY ar.id_article, title, date_of_publication, hyperlink, keywords\n" +
            "HAVING LOWER(ar.title) LIKE $1",
            [`%${title.toLowerCase()}%`, userId],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.rows);
                }
            })
    });
}
const findByAuthor = (someName, userId) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT ar.id_user, ar.id_article, title, date_of_publication, hyperlink, keywords,\n" +
            "\tarray_agg(aa.id_aa) as aa_array,\n" +
            "\tarray_agg(a.id_author) as authors_id,\n" +
            "\tarray_agg(concat(surname, ' ', a.name, ' ', patronymic, ', ', EXTRACT(YEAR FROM date_of_birth), ' г.р.')) AS authors\n" +
            "FROM course_work.library.article ar, course_work.library.article_author aa, course_work.library.author a\n" +
            "WHERE ar.id_article=aa.id_article AND aa.id_author=a.id_author AND ar.id_user = $2\n" +
            "GROUP BY ar.id_article, title, date_of_publication, hyperlink, keywords\n" +
            "HAVING array_to_string(array_agg(LOWER(concat(a.surname, ' ', a.name, ' ', a.patronymic, ', ', EXTRACT(YEAR FROM a.date_of_birth), ' г.р.'))), ',') LIKE $1",
            [`%${someName.toLowerCase()}%`, userId],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.rows);
                }
            })
    });
}
const findByDate = (date, userId) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT ar.id_article, title, date_of_publication, hyperlink, keywords,\n" +
            "\tarray_agg(aa.id_aa) as aa_array,\n" +
            "\tarray_agg(a.id_author) as authors_id,\n" +
            "\tarray_agg(concat(surname, ' ', a.name, ' ', patronymic, ', ', EXTRACT(YEAR FROM date_of_birth), ' г.р.')) AS authors\n" +
            "FROM course_work.library.article ar, course_work.library.article_author aa, course_work.library.author a\n" +
            "WHERE ar.id_article=aa.id_article AND aa.id_author=a.id_author AND ar.id_user = $2\n" +
            "GROUP BY ar.id_article, title, date_of_publication, hyperlink, keywords\n" +
            "HAVING date_of_publication=$1",
            [date, userId],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.rows);
                }
            })
    });
}

const findByKeywords = (keywords, userId) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT ar.id_article, title, date_of_publication, hyperlink, keywords,\n" +
            "\tarray_agg(aa.id_aa) as aa_array,\n" +
            "\tarray_agg(a.id_author) as authors_id,\n" +
            "\tarray_agg(concat(surname, ' ', a.name, ' ', patronymic, ', ', EXTRACT(YEAR FROM date_of_birth), ' г.р.')) AS authors\n" +
            "FROM course_work.library.article ar, course_work.library.article_author aa, course_work.library.author a\n" +
            "WHERE ar.id_article=aa.id_article AND aa.id_author=a.id_author AND ar.id_user = $2\n" +
            "GROUP BY ar.id_article, title, date_of_publication, hyperlink, keywords\n" +
            "HAVING keywords like $1",
            [`%${keywords}%`, userId],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.rows);
                }
            })
    });
}

const authorsByArtId = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT id_article, array_agg(id_author) as authors " +
            "FROM course_work.library.article_author WHERE id_article=$1 GROUP BY id_article", [id],
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
        pool.query("DELETE FROM course_work.library.article_collection WHERE id_collection=$1", [colId],
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
    addArticle,
    deleteArticle,
    allArticles,
    updateArticle,
    articleById,
    maxArtId,
    addRec,
    updateArticleAuthor,
    articlesInCollection,
    articlesNotInCollection,
    deleteFromCollection,
    addInCollection,
    findByTitle,
    findByAuthor,
    findByDate,
    findByKeywords,
    deleteAuthorArticle,
    deleteArticleCollection,
    authorsByArtId,
    deleteAllFromCollection
}