const findBooksByTitle = (title, query) => {
    return new Promise((resolve, reject) => {
      query(
        "SELECT id_genre, b.id_book, title, year_of_publication, keywords, cover, brief_annotation, \n" +
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
          "\t\tHAVING LOWER(title) LIKE $1",
        [`%${title.toLowerCase()}%`],
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
  
  module.exports = findBooksByTitle;
  