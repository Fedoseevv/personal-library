const pool = require('../db-connector');
const {request} = require('express');

const addBook = (title, year, keywords, cover, id_genre, annotation, location, locationObl) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO course_work.library.book (id_book, title, year_of_publication, keywords, cover, id_genre, brief_annotation, location, location_obl, id_user) " +
            "VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, $9)", [title, year, keywords, cover, id_genre, annotation, location, locationObl, 1],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    request.isAdded = true;
                    resolve(result.rows[0])
                }
            })
    });
}

const maxBookId = () => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT MAX(id_book) as max_id FROM course_work.library.book", [],
            (error, result) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result.rows[0])
                }
            })
    })
}

const addBookAuthor = (bookId, authorId) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO course_work.library.book_author (id_ba, id_book, id_author) VALUES (DEFAULT, $1, $2)",
            [bookId, authorId],
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

const deleteBook = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM course_work.library.book WHERE id = $1", [id],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    request.isDeleted = true;
                    resolve("Книга успешно удалена!")
                }
            })
    });
}

const allBooks = () => {
    const query = "SELECT *, g.name AS genre \n" +
        "FROM library.book b LEFT JOIN library.genre g USING(id_genre), library.book_author ba, library.author a\n" +
        "WHERE b.id_book=ba.id_book AND ba.id_author=a.id_author"
    return new Promise((resolve, reject) => {
        pool.query(query,
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.rows);
                }
            })
    });
}

const booksInCollection = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT *, g.name AS genre\n" +
            "FROM library.book b LEFT JOIN library.genre g USING(id_genre), library.book_author ba, library.author a\n" +
            "WHERE b.id_book=ba.id_book AND ba.id_author=a.id_author \n" +
            "AND b.id_book IN (SELECT id_book\n" +
            "FROM course_work.library.book_collection\n" +
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

const booksNotInCollection = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT *, g.name AS genre\n" +
            "FROM library.book b LEFT JOIN library.genre g USING(id_genre), library.book_author ba, library.author a\n" +
            "WHERE b.id_book=ba.id_book AND ba.id_author=a.id_author \n" +
            "AND b.id_book NOT IN (SELECT id_book\n" +
            "FROM course_work.library.book_collection\n" +
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

const updateBook = (id_book, title, year_of_publication, keywords, cover, id_genre, brief_annotation, location, location_obl) => {
    return new Promise((resolve, reject) => {
        pool.query("UPDATE course_work.library.book SET title = $1, year_of_publication = $2, keywords = $3, cover = $4, id_genre = $5, brief_annotation = $6, location = $7, location_obl = $8, id_user = 1 WHERE id_book = $9",
            [title, year_of_publication, keywords, cover, id_genre, brief_annotation, location, location_obl, id_book],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    request.isUpdated = true;
                    resolve("Книга успешно обновлена!")
                }
            })
    });
}

const updateBookAuthor = (id_ba, id_book, id_author) => {
    return new Promise((resolve, reject) => {
        pool.query("UPDATE course_work.library.book_author SET id_book = $1, id_author = $2 WHERE id_ba = $3", [id_book, id_author, id_ba],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    request.isUpdated = true;
                    resolve("Запись успешно обновлена!")
                }
            })
    })
}

const deleteFromCollection = (bookId, colId) => {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM course_work.library.book_collection WHERE id_book=$1 AND id_collection=$2", [bookId, colId],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve("Запись успешно удалена!")
                }
            })
    })
}

const addInCollection = (bookId, colId) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO course_work.library.book_collection (id_bc, id_book, id_collection) VALUES (DEFAULT, $1, $2)", [bookId, colId],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve("Запись успешно добавлена!")
                }
            })
    })
}

const bookById = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT name FROM course_work.library.book WHERE id_book = $1", [id],
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
    addBook,
    deleteBook,
    allBooks,
    updateBook,
    bookById,
    addBookAuthor,
    maxBookId,
    updateBookAuthor,
    booksInCollection,
    booksNotInCollection,
    deleteFromCollection,
    addInCollection
}