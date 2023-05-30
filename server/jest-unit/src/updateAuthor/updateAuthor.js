const updateAuthor = (query, authorId, name, patronymic, surname, birthDate) => {
    return new Promise((resolve, reject) => {
      query(
        "UPDATE course_work.library.author SET name = $1, patronymic = $2, surname = $3, date_of_birth = $4 WHERE id_author = $5",
        [name, patronymic, surname, birthDate, authorId],
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve("Автор успешно обновлен!");
          }
        }
      );
    });
  };
  
  module.exports = updateAuthor;
  