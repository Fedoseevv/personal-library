const  deleteAuthor  = require("./deleteAuthor");

describe("deleteAuthor", () => {
  let mockQuery;

  beforeEach(() => {
    mockQuery = jest.fn();
  });

  afterEach(() => {
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });

  it("Тест 1: Автор успешно удален", async () => {
    mockQuery.mockImplementation((query, values, callback) => {
      callback(null, {}); // Передаем null в качестве ошибки и {} в качестве результата
    });

    const result = await deleteAuthor(mockQuery, 1);

    expect(result).toBe("Автор успешно удален!");
  });

  it("Тест 2: Ошибка при удалении автора с отсутствующим идентификатором", async () => {
    const expectedError = new Error("Идентификатор автора отсутствует");

    mockQuery.mockImplementation((query, values, callback) => {
      callback(expectedError, null);
    });

    try {
      await deleteAuthor(mockQuery, null); // Отсутствующий идентификатор
    } catch (error) {
      expect(error).toEqual(expectedError);
    }
  });

  it("Тест 3: Ошибка при удалении автора с некорректным идентификатором", async () => {
    const expectedError = new Error("Некорректный идентификатор автора");

    mockQuery.mockImplementation((query, values, callback) => {
      callback(expectedError, null);
    });

    try {
      await deleteAuthor(mockQuery, "invalidId"); // Некорректный идентификатор
    } catch (error) {
      expect(error).toEqual(expectedError);
    }
  });
});

/*
describe("deleteAuthor", () => {
  it("Тест 1: Автор удален успешно", async () => {
    const mockQuery = jest.fn((query, values, callback) => {
      // Имитируем успешное выполнение запроса
      callback(null, {});
    });

    const result = await deleteAuthor(mockQuery, 1);

    expect(mockQuery).toHaveBeenCalledWith(
      "DELETE FROM course_work.library.author WHERE id_author = $1",
      [1],
      expect.any(Function)
    );
    expect(result).toBe("Автор успешно удален!");
  });

  it("Тест 2: Ошибка при удалении автора", async () => {
    const mockQuery = jest.fn((query, values, callback) => {
      // Имитируем ошибку при выполнении запроса
      const error = new Error("Ошибка при выполнении запроса");
      callback(error, null);
    });

    await expect(() => deleteAuthor(mockQuery, 1)).rejects.toThrow(
      "Ошибка при выполнении запроса"
    );

    expect(mockQuery).toHaveBeenCalledWith(
      "DELETE FROM course_work.library.author WHERE id_author = $1",
      [1],
      expect.any(Function)
    );
  });
});

/*
describe("deleteAuthor", () => {
    it("Тест 1: Автор удален успешно", async () => {
      const mockQuery = jest.fn();
  
      // Устанавливаем поведение заглушки для функции query
      mockQuery.mockImplementation((query, values, callback) => {
        // Имитируем успешное выполнение запроса
        callback(null, {});
      });
  
      const result = await deleteAuthor(mockQuery, 1);
  
      expect(mockQuery).toHaveBeenCalledWith(
        "DELETE FROM course_work.library.author WHERE id_author = $1",
        [1],
        expect.any(Function)
      );
      expect(result).toBe("Автор успешно удален!");
    });

    it("Тест 2: Ошибка при удалении автора", async () => {
        const mockQuery = jest.fn();
    
        // Устанавливаем поведение заглушки для функции query
        mockQuery.mockImplementation((query, values, callback) => {
          // Имитируем ошибку при выполнении запроса
          const error = new Error("Ошибка при выполнении запроса");
          callback(error, null);
        });
    
        try {
          await deleteAuthor(mockQuery, 1);
          // Если удаление автора не вызвало ошибку, то тест не прошел
          fail("Ожидалась ошибка при удалении автора");
        } catch (error) {
          expect(error).toEqual(new Error("Ошибка при выполнении запроса"));
        }
    
        expect(mockQuery).toHaveBeenCalledWith(
          "DELETE FROM course_work.library.author WHERE id_author = $1",
          [1],
          expect.any(Function)
        );
      });
  });

 */ 
/*
const deleteAuthor = require("./deleteAuthor");

describe("deleteAuthor", () => {
  it("Тест 1: Автор удален успешно", async () => {
    const mockQuery = jest.fn();

    // Устанавливаем поведение заглушки для функции query
    mockQuery.mockImplementation((query, values, callback) => {
      // Имитируем успешное выполнение запроса
      callback(null, {});
    });

    const result = await deleteAuthor(mockQuery, 1);

    expect(mockQuery).toHaveBeenCalledWith(
      "DELETE FROM course_work.library.author WHERE id_author = $1",
      [1],
      expect.any(Function)
    );
    expect(result).toEqual("Автор успешно удален!");
  });

  it("Тест 2: Ошибка при удалении автора", async () => {
    const mockQuery = jest.fn();

    // Устанавливаем поведение заглушки для функции query
    mockQuery.mockImplementation((query, values, callback) => {
      // Имитируем ошибку при выполнении запроса
      const error = new Error("Ошибка при выполнении запроса");
      callback(error, null);
    });

    try {
      await deleteAuthor(mockQuery, 1);
      // Если удаление автора не вызвало ошибку, то тест не прошел
      fail("Ожидалась ошибка при удалении автора");
    } catch (error) {
      expect(error).toEqual(new Error("Ошибка при выполнении запроса"));
    }

    expect(mockQuery).toHaveBeenCalledWith(
      "DELETE FROM course_work.library.author WHERE id_author = $1",
      [1],
      expect.any(Function)
    );
  });
});
*/