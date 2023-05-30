const updateDocument = (query, id_document, title, date_of_publication, location, location_obl) => {
    return new Promise((resolve, reject) => {
      query(
        "UPDATE course_work.library.document SET title = $1, date_of_publication = $2, location = $3, location_obl = $4, id_user = 1 WHERE id_document = $5",
        [title, date_of_publication, location, location_obl, id_document],
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve("Документ успешно обновлен!");
          }
        }
      );
    });
  };
  
  module.exports = updateDocument;
  