const findByDate = (query, date) => {
  return new Promise((resolve, reject) => {
    query(
      "SELECT ar.id_article, title, date_of_publication, hyperlink,\n" +
        "\tarray_agg(aa.id_aa) as aa_array,\n" +
        "\tarray_agg(a.id_author) as authors_id,\n" +
        "\tarray_agg(concat(surname, ' ', a.name, ' ', patronymic, ', ', EXTRACT(YEAR FROM date_of_birth), ' г.р.')) AS authors\n" +
        "FROM course_work.library.article ar, course_work.library.article_author aa, course_work.library.author a\n" +
        "WHERE ar.id_article=aa.id_article AND aa.id_author=a.id_author\n" +
        "GROUP BY ar.id_article, title, date_of_publication, hyperlink\n" +
        "HAVING date_of_publication=$1",
      [date],
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.rows);
        }
      }
    );
  });
};

module.exports = findByDate;
