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
const addBookPubHouse = (idBook, idPubHouse) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO course_work.library.book_publishing_house (id_bph, id_book, id_publishing_house) " +
            "VALUES (DEFAULT, $1, $2)", [idBook, idPubHouse],
            (error, result) => {
                if (error) {
                    reject(error)
                } else {
                    resolve("Запись успешно добавлена");
                }
            })
    })
}
const findPubHouse = (name, city) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM course_work.library.publishing_house " +
            "WHERE name=$1 AND city_of_publication=$2", [name, city],
            (error, result) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result.rows);
                }
            })
    })
}
const addPubHouse = (name, city) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO course_work.library.publishing_house (id_publishing_house, name, city_of_publication) " +
            "VALUES (DEFAULT, $1, $2)", [name, city],
            (error, result) => {
                if (error) {
                    reject(error)
                } else {
                    resolve("Запись успешно добавлена");
                }
            })
    })
}
const maxPubHouseId = () => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT MAX(id_publishing_house) as id FROM course_work.library.publishing_house", [],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.rows[0]);
                }
            })
    })
}

const deleteBook = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM course_work.library.book WHERE id_book = $1", [id],
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
const deleteBookAuthor = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM course_work.library.book_author WHERE id_book = $1", [id],
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
const deleteBookCollection = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM course_work.library.book_collection WHERE id_book = $1", [id],
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
const deleteBookPh = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM course_work.library.book_publishing_house WHERE id_book = $1", [id],
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

const allBooks = () => {
    const query = "SELECT id_genre, b.id_book, title, year_of_publication, keywords, cover, brief_annotation, \n" +
        "\t\tlocation, location_obl, b.id_book, ph.id_publishing_house, ph.name as pub_name, \n" +
        "\t\tcity_of_publication, g.name as genre, \n" +
        "\t\tarray_agg(ba.id_ba) as ba_array,\n" +
        "\t\tarray_agg(a.id_author) as authors_id,\n" +
        "\t\tarray_agg(concat(surname, ' ', a.name, ' ', patronymic, ', ', EXTRACT(YEAR FROM date_of_birth), ' г.р.')) AS authors\n" +
        "FROM library.book b LEFT JOIN library.genre g USING(id_genre), library.book_author ba, library.author a,\n" +
        "library.book_publishing_house bph, library.publishing_house ph\n" +
        "WHERE b.id_book=ba.id_book AND ba.id_author=a.id_author AND b.id_book=bph.id_book AND bph.id_publishing_house=ph.id_publishing_house\n" +
        "GROUP BY id_genre, b.id_book, title, year_of_publication, keywords, cover, brief_annotation, \n" +
        "\t\tlocation, location_obl, b.id_book, ph.id_publishing_house, \n" +
        "\t\tph.name, city_of_publication, g.name "

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
        pool.query("SELECT id_genre, b.id_book, title, year_of_publication, keywords, cover, brief_annotation, \n" +
            "        location, location_obl, b.id_book, ph.id_publishing_house, ph.name as pub_name, \n" +
            "        city_of_publication, g.name as genre, \n" +
            "        array_agg(ba.id_ba) as ba_array,\n" +
            "        array_agg(a.id_author) as authors_id,\n" +
            "        array_agg(concat(surname, ' ', a.name, ' ', patronymic, ', ', EXTRACT(YEAR FROM date_of_birth), ' г.р.')) AS authors\n" +
            "        FROM library.book b LEFT JOIN library.genre g USING(id_genre), library.book_author ba, library.author a,\n" +
            "        library.book_publishing_house bph, library.publishing_house ph\n" +
            "        WHERE b.id_book=ba.id_book AND ba.id_author=a.id_author AND b.id_book=bph.id_book AND bph.id_publishing_house=ph.id_publishing_house\n" +
            "        GROUP BY id_genre, b.id_book, title, year_of_publication, keywords, cover, brief_annotation, \n" +
            "        location, location_obl, b.id_book, ph.id_publishing_house, \n" +
            "        ph.name, city_of_publication, g.name\n" +
            "\t\tHAVING b.id_book IN (SELECT id_book\n" +
            "\t\t\tFROM course_work.library.book_collection\n" +
            "\t\t\t\tWHERE id_collection = $1)", [id],
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
        pool.query("SELECT id_genre, b.id_book, title, year_of_publication, keywords, cover, brief_annotation, \n" +
            "        location, location_obl, b.id_book, ph.id_publishing_house, ph.name as pub_name, \n" +
            "        city_of_publication, g.name as genre, \n" +
            "        array_agg(ba.id_ba) as ba_array,\n" +
            "        array_agg(a.id_author) as authors_id,\n" +
            "        array_agg(concat(surname, ' ', a.name, ' ', patronymic, ', ', EXTRACT(YEAR FROM date_of_birth), ' г.р.')) AS authors\n" +
            "        FROM library.book b LEFT JOIN library.genre g USING(id_genre), library.book_author ba, library.author a,\n" +
            "        library.book_publishing_house bph, library.publishing_house ph\n" +
            "        WHERE b.id_book=ba.id_book AND ba.id_author=a.id_author AND b.id_book=bph.id_book AND bph.id_publishing_house=ph.id_publishing_house\n" +
            "        GROUP BY id_genre, b.id_book, title, year_of_publication, keywords, cover, brief_annotation, \n" +
            "        location, location_obl, b.id_book, ph.id_publishing_house, \n" +
            "        ph.name, city_of_publication, g.name\n" +
            "\t\tHAVING b.id_book NOT IN (SELECT id_book\n" +
            "\t\t\tFROM course_work.library.book_collection\n" +
            "\t\t\t\tWHERE id_collection = $1)", [id],
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

const updateBookPublish = (id, pubName, pubCity) => {
    return new Promise((resolve, reject) => {
        pool.query("UPDATE course_work.library.publishing_house SET name=$1, city_of_publication=$2 " +
            "WHERE id_publishing_house=$3", [pubName, pubCity, id],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve("Запись успешно обновлена!");
                }
            })
    })
}

const changePubHouse = (bookId, bookPubHouse) => {
    return new Promise((resolve, reject) => {
        pool.query("UPDATE course_work.library.book_publishing_house SET id_publishing_house=$1 WHERE id_book=$2",
            [bookPubHouse, bookId],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.rows);
                }
            })
    })
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
        pool.query("SELECT id_genre, b.id_book, title, year_of_publication, keywords, cover, brief_annotation, \n" +
            "\t\tlocation, location_obl, b.id_book, ph.id_publishing_house, ph.name as pub_name, \n" +
            "\t\tcity_of_publication, g.name as genre, \n" +
            "\t\tarray_agg(ba.id_ba) as ba_array,\n" +
            "\t\tarray_agg(a.id_author) as authors_id,\n" +
            "\t\tarray_agg(concat(surname, ' ', a.name, ' ', patronymic, ', ', EXTRACT(YEAR FROM date_of_birth), ' г.р.')) AS authors\n" +
            "FROM library.book b LEFT JOIN library.genre g USING(id_genre), library.book_author ba, library.author a,\n" +
            "library.book_publishing_house bph, library.publishing_house ph\n" +
            "WHERE b.id_book=ba.id_book AND ba.id_author=a.id_author AND b.id_book=bph.id_book AND bph.id_publishing_house=ph.id_publishing_house\n" +
            "GROUP BY id_genre, b.id_book, title, year_of_publication, keywords, cover, brief_annotation, \n" +
            "\t\tlocation, location_obl, b.id_book, ph.id_publishing_house, \n" +
            "\t\tph.name, city_of_publication, g.name HAVING b.id_book=$1", [id],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.rows);
                }
            })
    });
}

const findBooksByTitle = (title) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT id_genre, b.id_book, title, year_of_publication, keywords, cover, brief_annotation, \n" +
            "        location, location_obl, b.id_book, ph.id_publishing_house, ph.name as pub_name, \n" +
            "        city_of_publication, g.name as genre, \n" +
            "        array_agg(ba.id_ba) as ba_array,\n" +
            "        array_agg(a.id_author) as authors_id,\n" +
            "        array_agg(concat(surname, ' ', a.name, ' ', patronymic, ', ', EXTRACT(YEAR FROM date_of_birth), ' г.р.')) AS authors\n" +
            "        FROM library.book b LEFT JOIN library.genre g USING(id_genre), library.book_author ba, library.author a,\n" +
            "        library.book_publishing_house bph, library.publishing_house ph\n" +
            "        WHERE b.id_book=ba.id_book AND ba.id_author=a.id_author AND b.id_book=bph.id_book AND bph.id_publishing_house=ph.id_publishing_house\n" +
            "        GROUP BY id_genre, b.id_book, title, year_of_publication, keywords, cover, brief_annotation, \n" +
            "        location, location_obl, b.id_book, ph.id_publishing_house, \n" +
            "        ph.name, city_of_publication, g.name\n" +
            "\t\tHAVING LOWER(title) LIKE $1", [`%${title.toLowerCase()}%`],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.rows);
                }
            })
    });
}

const findBooksByGenre = (genre) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT id_genre, b.id_book, title, year_of_publication, keywords, cover, brief_annotation, \n" +
            "        location, location_obl, b.id_book, ph.id_publishing_house, ph.name as pub_name, \n" +
            "        city_of_publication, g.name as genre, \n" +
            "        array_agg(ba.id_ba) as ba_array,\n" +
            "        array_agg(a.id_author) as authors_id,\n" +
            "        array_agg(concat(surname, ' ', a.name, ' ', patronymic, ', ', EXTRACT(YEAR FROM date_of_birth), ' г.р.')) AS authors\n" +
            "        FROM library.book b LEFT JOIN library.genre g USING(id_genre), library.book_author ba, library.author a,\n" +
            "        library.book_publishing_house bph, library.publishing_house ph\n" +
            "        WHERE b.id_book=ba.id_book AND ba.id_author=a.id_author AND b.id_book=bph.id_book AND bph.id_publishing_house=ph.id_publishing_house\n" +
            "        GROUP BY id_genre, b.id_book, title, year_of_publication, keywords, cover, brief_annotation, \n" +
            "        location, location_obl, b.id_book, ph.id_publishing_house, \n" +
            "        ph.name, city_of_publication, g.name\n" +
            "\t\tHAVING LOWER(genre) LIKE $1", [`%${genre.toLowerCase()}%`],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.rows);
                }
            })
    });
}

const findBooksByPubHouse = (pubHouse) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT id_genre, b.id_book, title, year_of_publication, keywords, cover, brief_annotation, \n" +
            "        location, location_obl, b.id_book, ph.id_publishing_house, ph.name as pub_name, \n" +
            "        city_of_publication, g.name as genre, \n" +
            "        array_agg(ba.id_ba) as ba_array,\n" +
            "        array_agg(a.id_author) as authors_id,\n" +
            "        array_agg(concat(surname, ' ', a.name, ' ', patronymic, ', ', EXTRACT(YEAR FROM date_of_birth), ' г.р.')) AS authors\n" +
            "        FROM library.book b LEFT JOIN library.genre g USING(id_genre), library.book_author ba, library.author a,\n" +
            "        library.book_publishing_house bph, library.publishing_house ph\n" +
            "        WHERE b.id_book=ba.id_book AND ba.id_author=a.id_author AND b.id_book=bph.id_book AND bph.id_publishing_house=ph.id_publishing_house\n" +
            "        GROUP BY id_genre, b.id_book, title, year_of_publication, keywords, cover, brief_annotation, \n" +
            "        location, location_obl, b.id_book, ph.id_publishing_house, \n" +
            "        ph.name, city_of_publication, g.name\n" +
            "\t\tHAVING  LOWER(ph.name) LIKE $1", [`%${pubHouse.toLowerCase()}%`],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.rows);
                }
            })
    });
}

const findBooksByKeywords = (keywords) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT id_genre, b.id_book, title, year_of_publication, keywords, cover, brief_annotation, \n" +
            "        location, location_obl, b.id_book, ph.id_publishing_house, ph.name as pub_name, \n" +
            "        city_of_publication, g.name as genre, \n" +
            "        array_agg(ba.id_ba) as ba_array,\n" +
            "        array_agg(a.id_author) as authors_id,\n" +
            "        array_agg(concat(surname, ' ', a.name, ' ', patronymic, ', ', EXTRACT(YEAR FROM date_of_birth), ' г.р.')) AS authors\n" +
            "        FROM library.book b LEFT JOIN library.genre g USING(id_genre), library.book_author ba, library.author a,\n" +
            "        library.book_publishing_house bph, library.publishing_house ph\n" +
            "        WHERE b.id_book=ba.id_book AND ba.id_author=a.id_author AND b.id_book=bph.id_book AND bph.id_publishing_house=ph.id_publishing_house\n" +
            "        GROUP BY id_genre, b.id_book, title, year_of_publication, keywords, cover, brief_annotation, \n" +
            "        location, location_obl, b.id_book, ph.id_publishing_house, \n" +
            "        ph.name, city_of_publication, g.name\n" +
            "\t\tHAVING LOWER(keywords) LIKE $1", [`%${keywords.toLowerCase()}%`],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.rows);
                }
            })
    });
}
const findBooksByPubYear = (pubYear) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT id_genre, b.id_book, title, year_of_publication, keywords, cover, brief_annotation, \n" +
            "        location, location_obl, b.id_book, ph.id_publishing_house, ph.name as pub_name, \n" +
            "        city_of_publication, g.name as genre, \n" +
            "        array_agg(ba.id_ba) as ba_array,\n" +
            "        array_agg(a.id_author) as authors_id,\n" +
            "        array_agg(concat(surname, ' ', a.name, ' ', patronymic, ', ', EXTRACT(YEAR FROM date_of_birth), ' г.р.')) AS authors\n" +
            "        FROM library.book b LEFT JOIN library.genre g USING(id_genre), library.book_author ba, library.author a,\n" +
            "        library.book_publishing_house bph, library.publishing_house ph\n" +
            "        WHERE b.id_book=ba.id_book AND ba.id_author=a.id_author AND b.id_book=bph.id_book AND bph.id_publishing_house=ph.id_publishing_house\n" +
            "        GROUP BY id_genre, b.id_book, title, year_of_publication, keywords, cover, brief_annotation, \n" +
            "        location, location_obl, b.id_book, ph.id_publishing_house, \n" +
            "        ph.name, city_of_publication, g.name\n" +
            "\t\tHAVING year_of_publication=$1", [`%${pubYear}%`],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.rows);
                }
            })
    });

}
const findBooksByAuthor = (author) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT id_genre, b.id_book, title, year_of_publication, keywords, cover, brief_annotation, \n" +
            "        location, location_obl, b.id_book, ph.id_publishing_house, ph.name as pub_name, \n" +
            "        city_of_publication, g.name as genre, \n" +
            "        array_agg(ba.id_ba) as ba_array,\n" +
            "        array_agg(a.id_author) as authors_id,\n" +
            "        array_agg(concat(surname, ' ', a.name, ' ', patronymic, ', ', EXTRACT(YEAR FROM date_of_birth), ' г.р.')) AS authors\n" +
            "        FROM library.book b LEFT JOIN library.genre g USING(id_genre), library.book_author ba, library.author a,\n" +
            "        library.book_publishing_house bph, library.publishing_house ph\n" +
            "        WHERE b.id_book=ba.id_book AND ba.id_author=a.id_author AND b.id_book=bph.id_book AND bph.id_publishing_house=ph.id_publishing_house\n" +
            "        GROUP BY id_genre, b.id_book, title, year_of_publication, keywords, cover, brief_annotation, \n" +
            "        location, location_obl, b.id_book, ph.id_publishing_house, \n" +
            "        ph.name, city_of_publication, g.name\n" +
            "\t\tHAVING (LOWER(name) LIKE $1 OR LOWER(patronymic) LIKE $1 OR LOWER(surname) LIKE $1)",
            [`%${author.toLowerCase()}%`],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.rows);
                }
            })
    });

}
const findBooksByBriefAnn = (briefAnn) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT id_genre, b.id_book, title, year_of_publication, keywords, cover, brief_annotation, \n" +
            "        location, location_obl, b.id_book, ph.id_publishing_house, ph.name as pub_name, \n" +
            "        city_of_publication, g.name as genre, \n" +
            "        array_agg(ba.id_ba) as ba_array,\n" +
            "        array_agg(a.id_author) as authors_id,\n" +
            "        array_agg(concat(surname, ' ', a.name, ' ', patronymic, ', ', EXTRACT(YEAR FROM date_of_birth), ' г.р.')) AS authors\n" +
            "        FROM library.book b LEFT JOIN library.genre g USING(id_genre), library.book_author ba, library.author a,\n" +
            "        library.book_publishing_house bph, library.publishing_house ph\n" +
            "        WHERE b.id_book=ba.id_book AND ba.id_author=a.id_author AND b.id_book=bph.id_book AND bph.id_publishing_house=ph.id_publishing_house\n" +
            "        GROUP BY id_genre, b.id_book, title, year_of_publication, keywords, cover, brief_annotation, \n" +
            "        location, location_obl, b.id_book, ph.id_publishing_house, \n" +
            "        ph.name, city_of_publication, g.name\n" +
            "\t\tHAVING LOWER(brief_annotation) LIKE $1", [`%${briefAnn.toLowerCase()}%`],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.rows);
                }
            })
    });
}

const authorsByBookId = (bookId) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT id_book, array_agg(id_author) as authors " +
            "FROM course_work.library.book_author WHERE id_book=$1 GROUP BY id_book", [bookId],
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
    addInCollection,
    findBooksByTitle,
    findBooksByGenre,
    findBooksByPubHouse,
    findBooksByKeywords,
    findBooksByPubYear,
    findBooksByAuthor,
    findBooksByBriefAnn,

    deleteBookAuthor,
    deleteBookCollection,

    updateBookPublish,
    addPubHouse,
    addBookPubHouse,
    maxPubHouseId,
    deleteBookPh,
    findPubHouse,
    changePubHouse,
    authorsByBookId
}