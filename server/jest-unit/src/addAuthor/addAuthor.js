const addAuthor = (query, id, name, patronymic, surname, birthDate) => {
  return new Promise((resolve, reject) => {
    query(
      "INSERT INTO course_work.library.author (id_author, name, patronymic, surname, date_of_birth) VALUES ($1, $2, $3, $4, $5)",
      [id, name, patronymic, surname, birthDate],
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve("Автор успешно добавлен!");
        }
      }
    );
  });
};

module.exports =  addAuthor ;