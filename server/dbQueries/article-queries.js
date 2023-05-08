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

const allArticles = () => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT ar.id_article, title, date_of_publication, hyperlink,\n" +
            "\tarray_agg(aa.id_aa) as aa_array,\n" +
            "\tarray_agg(a.id_author) as authors_id,\n" +
            "\tarray_agg(concat(surname, ' ', a.name, ' ', patronymic, ', ', EXTRACT(YEAR FROM date_of_birth), ' г.р.')) AS authors\n" +
            "FROM course_work.library.article ar, course_work.library.article_author aa, course_work.library.author a\n" +
            "WHERE ar.id_article=aa.id_article AND aa.id_author=a.id_author\n" +
            "GROUP BY ar.id_article, title, date_of_publication, hyperlink",
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.rows);
                }
            })
    });
}

const articlesInCollection = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT ar.id_article, title, date_of_publication, hyperlink,\n" +
            "\tarray_agg(aa.id_aa) as aa_array,\n" +
            "\tarray_agg(a.id_author) as authors_id,\n" +
            "\tarray_agg(concat(surname, ' ', a.name, ' ', patronymic, ', ', EXTRACT(YEAR FROM date_of_birth), ' г.р.')) AS authors\n" +
            "FROM course_work.library.article ar, course_work.library.article_author aa, course_work.library.author a\n" +
            "WHERE ar.id_article=aa.id_article AND aa.id_author=a.id_author\n" +
            "GROUP BY ar.id_article, title, date_of_publication, hyperlink\n" +
            "HAVING ar.id_article IN (SELECT id_article\n" +
            "FROM course_work.library.article_collection\n" +
            "WHERE id_collection = $1)", [id],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.rows);
                }
            })
    })
}

const articlesNotInCollection = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT ar.id_article, title, date_of_publication, hyperlink,\n" +
            "\tarray_agg(aa.id_aa) as aa_array,\n" +
            "\tarray_agg(a.id_author) as authors_id,\n" +
            "\tarray_agg(concat(surname, ' ', a.name, ' ', patronymic, ', ', EXTRACT(YEAR FROM date_of_birth), ' г.р.')) AS authors\n" +
            "FROM course_work.library.article ar, course_work.library.article_author aa, course_work.library.author a\n" +
            "WHERE ar.id_article=aa.id_article AND aa.id_author=a.id_author\n" +
            "GROUP BY ar.id_article, title, date_of_publication, hyperlink\n" +
            "HAVING ar.id_article NOT IN (SELECT id_article\n" +
            "FROM course_work.library.article_collection\n" +
            "WHERE id_collection = $1)", [id],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.rows);
                }
            })
    })
}

const updateArticle = (id_article, title, hyperlink, date_of_publication) => {
    return new Promise((resolve, reject) => {
       pool.query("UPDATE course_work.library.article SET title = $1, hyperlink = $2, date_of_publication = $3, id_user = 1 WHERE id_article = $4",
           [title, hyperlink, date_of_publication, id_article],
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
        pool.query("SELECT ar.id_article, title, date_of_publication, hyperlink,\n" +
            "\tarray_agg(aa.id_aa) as aa_array,\n" +
            "\tarray_agg(a.id_author) as authors_id,\n" +
            "\tarray_agg(concat(surname, ' ', a.name, ' ', patronymic, ', ', EXTRACT(YEAR FROM date_of_birth), ' г.р.')) AS authors\n" +
            "FROM course_work.library.article ar, course_work.library.article_author aa, course_work.library.author a\n" +
            "WHERE ar.id_article=aa.id_article AND aa.id_author=a.id_author\n" +
            "GROUP BY ar.id_article, title, date_of_publication, hyperlink\n" +
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

const findByTitle = (title) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT ar.id_article, title, date_of_publication, hyperlink,\n" +
            "\tarray_agg(aa.id_aa) as aa_array,\n" +
            "\tarray_agg(a.id_author) as authors_id,\n" +
            "\tarray_agg(concat(surname, ' ', a.name, ' ', patronymic, ', ', EXTRACT(YEAR FROM date_of_birth), ' г.р.')) AS authors\n" +
            "FROM course_work.library.article ar, course_work.library.article_author aa, course_work.library.author a\n" +
            "WHERE ar.id_article=aa.id_article AND aa.id_author=a.id_author\n" +
            "GROUP BY ar.id_article, title, date_of_publication, hyperlink\n" +
            "HAVING LOWER(ar.title) LIKE $1",
            [`%${title.toLowerCase()}%`],
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
        pool.query("SELECT ar.id_article, title, date_of_publication, hyperlink,\n" +
            "\tarray_agg(aa.id_aa) as aa_array,\n" +
            "\tarray_agg(a.id_author) as authors_id,\n" +
            "\tarray_agg(concat(surname, ' ', a.name, ' ', patronymic, ', ', EXTRACT(YEAR FROM date_of_birth), ' г.р.')) AS authors\n" +
            "FROM course_work.library.article ar, course_work.library.article_author aa, course_work.library.author a\n" +
            "WHERE ar.id_article=aa.id_article AND aa.id_author=a.id_author\n" +
            "GROUP BY ar.id_article, title, date_of_publication, hyperlink\n" +
            "HAVING (LOWER(a.name) LIKE $1 OR LOWER(a.patronymic) LIKE $1 OR LOWER(a.surname) LIKE $1)",
            [`%${someName.toLowerCase()}%`],
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
        pool.query("SELECT *\n" +
            "FROM course_work.library.article ar, course_work.library.article_author aa, course_work.library.author a\n" +
            "WHERE ar.id_article=aa.id_article AND aa.id_author=a.id_author AND " +
            "ar.date_of_publication=$1",
            [`${date}`],
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
    deleteAuthorArticle,
    deleteArticleCollection,
    authorsByArtId
}