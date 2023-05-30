const deleteAuthor = (query, id) => {
    return new Promise((resolve, reject) => {
      query(
        "DELETE FROM course_work.library.author WHERE id_author = $1",
        [id],
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve("Автор успешно удален!");
          }
        }
      );
    });
  };
  
  module.exports = deleteAuthor;
  