const  addAuthor  = require("./addAuthor");
/*
describe("addAuthor", () => {
  let mockQuery;

  beforeEach(() => {
    mockQuery = jest.fn();
  });

  afterEach(() => {
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });

  it("Тест 1: Автор добавлен успешно", async () => {
    mockQuery.mockImplementation((query, values, callback) => {
      callback(null, {}); // Передаем null в качестве ошибки и {} в качестве результата
    });

    const result = await addAuthor(
      mockQuery,
      1,
      "John",
      "Doe",
      "Smith",
      "1990-01-01"
    ).catch((error) => {
      // Добавляем обработку ошибки, чтобы тест не завершался аварийно
      throw error;
    });

    expect(result).toBe("Автор успешно добавлен!");
    expect(mockQuery).toHaveBeenCalledWith(
      // Проверяем вызов mockQuery с ожидаемыми аргументами
      "INSERT INTO course_work.library.author (id_author, name, patronymic, surname, date_of_birth) VALUES ($1, $2, $3, $4, $5)",
      [1, "John", "Doe", "Smith", "1990-01-01"],
      expect.any(Function)
    );
  });
});
*/

describe("addAuthor", () => {
  let mockQuery;

  beforeEach(() => {
    mockQuery = jest.fn();
  });

  afterEach(() => {
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });

  it("Тест 1: Автор добавлен успешно", async () => {
    mockQuery.mockImplementation((query, values, callback) => {
      callback(null, {}); // Передаем null в качестве ошибки и {} в качестве результата
    });

    const result = await addAuthor(
      mockQuery,
      1,
      "John",
      "Doe",
      "Smith",
      "1990-01-01"
    );

    expect(result).toBe("Автор успешно добавлен!");
  });

  it("Тест 2: Автор добавлен успешно", async () => {
    mockQuery.mockImplementation((query, values, callback) => {
      callback(null, {}); // Передаем null в качестве ошибки и {} в качестве результата
    });

    const result = await addAuthor(
      mockQuery,
      2,
      "Jane",
      "Smith",
      "Doe",
      "1985-05-15"
    );

    expect(result).toBe("Автор успешно добавлен!");
  });

  it("Тест 3: Автор добавлен успешно", async () => {
    mockQuery.mockImplementation((query, values, callback) => {
      callback(null, {}); // Передаем null в качестве ошибки и {} в качестве результата
    });

    const result = await addAuthor(
      mockQuery,
      3,
      "Michael",
      "Johnson",
      "Brown",
      "1978-12-10"
    );

    expect(result).toBe("Автор успешно добавлен!");
  });

  it("Тест 4: Автор добавлен успешно", async () => {
    mockQuery.mockImplementation((query, values, callback) => {
      callback(null, {}); // Передаем null в качестве ошибки и {} в качестве результата
    });

    const result = await addAuthor(
      mockQuery,
      4,
      "Emily",
      "Wilson",
      "Anderson",
      "1995-09-20"
    );

    expect(result).toBe("Автор успешно добавлен!");
  });

});
/*
it("Тест 5: Ошибка при добавлении автора с пустым именем", async () => {
  const expectedError = new Error("Имя автора не может быть пустым");
  const mockQuery = jest.fn();

  mockQuery.mockImplementation((query, values, callback) => {
    callback(null, {}); // Передаем null в качестве результата
  });

  try {
    await addAuthor(
      mockQuery,
      7,
      "", // Пустая строка в качестве имени
      "Doe",
      "Smith",
      "1990-01-01"
    );
  } catch (error) {
    expect(error).toEqual(expectedError);
  }
});
it("Тест 6: Ошибка при добавлении автора с пустой фамилией", async () => {
  const expectedError = new Error("Фамилия автора не может быть пустой");
  const mockQuery = jest.fn();

  mockQuery.mockImplementation((query, values, callback) => {
    callback(null, {});
  });

  try {
    await addAuthor(
      mockQuery,
      8,
      "John",
      "Doe",
      "", // Пустая строка в качестве фамилии
      "1990-01-01"
    );
  } catch (error) {
    expect(error).toEqual(expectedError);
  }
});
*/
it("Тест 7: Ошибка при добавлении автора с некорректной датой рождения", async () => {
  const expectedError = new Error("Некорректная дата рождения");
  const mockQuery = jest.fn();

  mockQuery.mockImplementation((query, values, callback) => {
    callback(null, {});
  });

  try {
    await addAuthor(
      mockQuery,
      9,
      "John",
      "Doe",
      "Smith",
      "1990-01-99" // Некорректная дата рождения
    );
  } catch (error) {
    expect(error).toEqual(expectedError);
  }
});

it("Тест 8: Ошибка при добавлении автора с отсутствующим идентификатором", async () => {
  const expectedError = new Error("Идентификатор автора отсутствует");
  const mockQuery = jest.fn();

  mockQuery.mockImplementation((query, values, callback) => {
    callback(null, {});
  });

  try {
    await addAuthor(
      mockQuery,
      null, // Отсутствующий идентификатор
      "John",
      "Doe",
      "Smith",
      "1990-01-01"
    );
  } catch (error) {
    expect(error).toEqual(expectedError);
  }
});


/*
describe("addAuthor", () => {
  it("Тест 1: Автор добавлен успешно", () => {
    const mockQuery = jest.fn((query, values, callback) => {
      callback(null, {});
    });

    const result = addAuthor(
      mockQuery,
      1,
      "John",
      "Doe",
      "Smith",
      "1990-01-01"
    );

    expect(mockQuery).toHaveBeenCalledWith(
      "INSERT INTO course_work.library.author (id_author, name, patronymic, surname, date_of_birth) VALUES ($1, $2, $3, $4, $5)",
      [1, "John", "Doe", "Smith", "1990-01-01"],
      expect.any(Function)
    );

    expect(result).toBe("Автор успешно добавлен!");
  });

  it("Тест 2: Автор добавлен успешно", () => {
    const mockQuery = jest.fn((query, values, callback) => {
      callback(null, {});
    });

    const result = addAuthor(
      mockQuery,
      2,
      "Jane",
      "Smith",
      "Doe",
      "1985-05-15"
    );

    expect(mockQuery).toHaveBeenCalledWith(
      "INSERT INTO course_work.library.author (id_author, name, patronymic, surname, date_of_birth) VALUES ($1, $2, $3, $4, $5)",
      [2, "Jane", "Smith", "Doe", "1985-05-15"],
      expect.any(Function)
    );

    expect(result).toBe("Автор успешно добавлен!");
  });

  it("Тест 3: Автор добавлен успешно", () => {
    const mockQuery = jest.fn((query, values, callback) => {
      callback(null, {});
    });

    const result = addAuthor(
      mockQuery,
      3,
      "Michael",
      "Johnson",
      "Brown",
      "1978-12-10"
    );

    expect(mockQuery).toHaveBeenCalledWith(
      "INSERT INTO course_work.library.author (id_author, name, patronymic, surname, date_of_birth) VALUES ($1, $2, $3, $4, $5)",
      [3, "Michael", "Johnson", "Brown", "1978-12-10"],
      expect.any(Function)
    );

    expect(result).toBe("Автор успешно добавлен!");
  });

  it("Тест 4: Автор добавлен успешно", () => {
    const mockQuery = jest.fn((query, values, callback) => {
      callback(null, {});
    });

    const result = addAuthor(
      mockQuery,
      4,
      "Emily",
      "Wilson",
      "Anderson",
      "1995-09-20"
    );

    expect(mockQuery).toHaveBeenCalledWith(
      "INSERT INTO course_work.library.author (id_author, name, patronymic, surname, date_of_birth) VALUES ($1, $2, $3, $4, $5)",
      [4, "Emily", "Wilson", "Anderson", "1995-09-20"],
      expect.any(Function)
    );

    expect(result).toBe("Автор успешно добавлен!");
  });

  it("Тест 5: Ошибка при добавлении автора", () => {
    const mockQuery = jest.fn();

    mockQuery.mockImplementation((query, values, callback) => {
      const error = new Error("Ошибка при выполнении запроса");
      callback(error, null);
    });

    try {
      addAuthor(mockQuery, 1, "Иван", "Иванович", "Иванов", "2000-01-01");
      fail("Ожидалась ошибка при добавлении автора");
    } catch (error) {
      expect(error).toEqual(new Error("Ошибка при выполнении запроса"));
    }

    expect(mockQuery).toHaveBeenCalledWith(
      "INSERT INTO course_work.library.author (id_author, name, patronymic, surname, date_of_birth) VALUES ($1, $2, $3, $4, $5)",
      [1, "Иван", "Иванович", "Иванов", "2000-01-01"],
      expect.any(Function)
    );
  });

  it("Тест 6: Ошибка при добавлении автора", () => {
    const mockQuery = jest.fn();

    mockQuery.mockImplementation((query, values, callback) => {
      const error = new Error("Ошибка при выполнении запроса");
      callback(error, null);
    });

    try {
      addAuthor(mockQuery, 7, "Иван", " ", "Иванов", "2000-01-01");
      fail("Ожидалась ошибка при добавлении автора");
    } catch (error) {
      expect(error).toEqual(new Error("Ошибка при выполнении запроса"));
    }

    expect(mockQuery).toHaveBeenCalledWith(
      "INSERT INTO course_work.library.author (id_author, name, patronymic, surname, date_of_birth) VALUES ($1, $2, $3, $4, $5)",
      [7, "Иван", " ", "Иванов", "2000-01-01"],
      expect.any(Function)
    );
  });
});
*/

/*
describe("addAuthor", () => {
  it("Тест 1: Автор добавлен успешно", async () => {
    // Создаем фейковую реализацию pool.query (Создаем мок (фейковую функцию) для pool.query)
    const mockQuery = jest.fn((query, values, callback) => {
      callback(null, {}); // Имитируем успешное выполнение запроса
    });

    // Вызываем функцию addAuthor с фейковым pool и входными данными
    const result = await addAuthor(
      mockQuery,// Фейковый pool с мокированной функцией query
      1,
      "John",
      "Doe",
      "Smith",
      "1990-01-01"
    );

    // Проверяем, что mockQuery был вызван с ожидаемыми аргументами
    expect(mockQuery).toHaveBeenCalledWith(
      "INSERT INTO course_work.library.author (id_author, name, patronymic, surname, date_of_birth) VALUES ($1, $2, $3, $4, $5)",
      [1, "John", "Doe", "Smith", "1990-01-01"],
      expect.any(Function)// Ожидаем, что третий аргумент является функцией обратного вызова
    );
    // Проверяем, что результат соответствует ожидаемому значению
    expect(result).toBe("Автор успешно добавлен!");
  });

  it("Тест 2: Автор добавлен успешно", async () => {
    const mockQuery = jest.fn((query, values, callback) => {
      callback(null, {});
    });

    const result = await addAuthor(
      mockQuery,
      2,
      "Jane",
      "Smith",
      "Doe",
      "1985-05-15"
    );

    expect(mockQuery).toHaveBeenCalledWith(
      "INSERT INTO course_work.library.author (id_author, name, patronymic, surname, date_of_birth) VALUES ($1, $2, $3, $4, $5)",
      [2, "Jane", "Smith", "Doe", "1985-05-15"],
      expect.any(Function)
    );
    expect(result).toBe("Автор успешно добавлен!");
  });

  it("Тест 3: Автор добавлен успешно", async () => {
    const mockQuery = jest.fn((query, values, callback) => {
      callback(null, {});
    });

    const result = await addAuthor(
      mockQuery,
      3,
      "Michael",
      "Johnson",
      "Brown",
      "1978-12-10"
    );

    expect(mockQuery).toHaveBeenCalledWith(
      "INSERT INTO course_work.library.author (id_author, name, patronymic, surname, date_of_birth) VALUES ($1, $2, $3, $4, $5)",
      [3, "Michael", "Johnson", "Brown", "1978-12-10"],
      expect.any(Function)
    );
    expect(result).toBe("Автор успешно добавлен!");
  });

  it("Тест 4: Автор добавлен успешно", async () => {
    const mockQuery = jest.fn((query, values, callback) => {
      callback(null, {});
    });

    const result = await addAuthor(
      mockQuery,
      4,
      "Emily",
      "Wilson",
      "Anderson",
      "1995-09-20"
    );

    expect(mockQuery).toHaveBeenCalledWith(
      "INSERT INTO course_work.library.author (id_author, name, patronymic, surname, date_of_birth) VALUES ($1, $2, $3, $4, $5)",
      [4, "Emily", "Wilson", "Anderson", "1995-09-20"],
      expect.any(Function)
    );
    expect(result).toBe("Автор успешно добавлен!");
  });

  it("Тест 5: Ошибка при добавлении автора", async () => {
    const mockQuery = jest.fn();

    // Устанавливаем поведение заглушки для функции query
    mockQuery.mockImplementation((query, values, callback) => {
      // Имитируем ошибку при выполнении запроса
      const error = new Error("Ошибка при выполнении запроса");
      callback(error, null);
    });

    try {
      await addAuthor(mockQuery, 1, "Иван", "Иванович", "Иванов", "2000-01-01");
      // Если добавление автора не вызвало ошибку, то тест не прошел
      fail("Ожидалась ошибка при добавлении автора");
    } catch (error) {
      expect(error).toEqual(new Error("Ошибка при выполнении запроса"));
    }

    expect(mockQuery).toHaveBeenCalledWith(
      "INSERT INTO course_work.library.author (id_author, name, patronymic, surname, date_of_birth) VALUES ($1, $2, $3, $4, $5)",
      [1, "Иван", "Иванович", "Иванов", "2000-01-01"],
      expect.any(Function)
    );
  });

  it("Тест 6: Ошибка при добавлении автора", async () => {
    const mockQuery = jest.fn();

    // Устанавливаем поведение заглушки для функции query
    mockQuery.mockImplementation((query, values, callback) => {
      // Имитируем ошибку при выполнении запроса
      const error = new Error("Ошибка при выполнении запроса");
      callback(error, null);
    });

    try {
      await addAuthor(mockQuery, 7, "Иван", " ", "Иванов", "2000-01-01");
      // Если добавление автора не вызвало ошибку, то тест не прошел
      fail("Ожидалась ошибка при добавлении автора");
    } catch (error) {
      expect(error).toEqual(new Error("Ошибка при выполнении запроса"));
    }

    expect(mockQuery).toHaveBeenCalledWith(
      "INSERT INTO course_work.library.author (id_author, name, patronymic, surname, date_of_birth) VALUES ($1, $2, $3, $4, $5)",
      [7, "Иван", " ", "Иванов", "2000-01-01"],
      expect.any(Function)
    );
  });
  */

  /*
  Без jest, собственная mock-функция
  describe("addAuthor", () => {
    it("Тест 1: Автор добавлен успешно", async () => {
      let queryArguments;
      const mockQuery = (query, values, callback) => {
        queryArguments = [query, values, callback];
        callback(null, {});
      };
  
      const fakePool = {
        query: mockQuery
      };
  
      const result = await addAuthor(
        fakePool,
        1,
        "John",
        "Doe",
        "Smith",
        "1990-01-01"
      );
  
      expect(queryArguments[0]).toBe(
        "INSERT INTO course_work.library.author (id_author, name, patronymic, surname, date_of_birth) VALUES ($1, $2, $3, $4, $5)"
      );
      expect(queryArguments[1]).toEqual([1, "John", "Doe", "Smith", "1990-01-01"]);
      expect(typeof queryArguments[2]).toBe("function");
      expect(result).toBe("Автор успешно добавлен!");
    });
  });  
  //*****************************************
  //это с jest, ЛУЧШЕ
  describe("addAuthor", () => {
  it("Тест 1: Автор добавлен успешно", async () => {
    const expectedQuery = "INSERT INTO course_work.library.author (id_author, name, patronymic, surname, date_of_birth) VALUES ($1, $2, $3, $4, $5)";
    const expectedValues = [1, "John", "Doe", "Smith", "1990-01-01"];
    const expectedResponse = "Автор успешно добавлен!";
  
    const mockQuery = jest.fn((query, values, callback) => {
      expect(query).toEqual(expectedQuery);
      expect(values).toEqual(expectedValues);
      callback(null, {});
    });
  
    const result = await addAuthor(
      mockQuery,
      1,
      "John",
      "Doe",
      "Smith",
      "1990-01-01"
    );
  
    expect(result).toBe(expectedResponse);
  });
  it("Тест 2: Второй автор добавлен успешно", async () => {
    const expectedQuery = "INSERT INTO course_work.library.author (id_author, name, patronymic, surname, date_of_birth) VALUES ($1, $2, $3, $4, $5)";
    const expectedValues = [2, "Jane", "Smith", "Doe", "1995-02-02"];
    const expectedResponse = "Автор успешно добавлен!";
  
    const mockQuery = jest.fn((query, values, callback) => {
      expect(query).toEqual(expectedQuery);
      expect(values).toEqual(expectedValues);
      callback(null, {});
    });
  
    const result = await addAuthor(
      mockQuery,
      2,
      "Jane",
      "Smith",
      "Doe",
      "1995-02-02"
    );
  
    expect(result).toBe(expectedResponse);
  });

  it("Тест 3: Третий автор добавлен успешно", async () => {
    const expectedQuery = "INSERT INTO course_work.library.author (id_author, name, patronymic, surname, date_of_birth) VALUES ($1, $2, $3, $4, $5)";
    const expectedValues = [3, "Michael", "Johnson", "Brown", "1985-05-05"];
    const expectedResponse = "Автор успешно добавлен!";
  
    const mockQuery = jest.fn((query, values, callback) => {
      expect(query).toEqual(expectedQuery);
      expect(values).toEqual(expectedValues);
      callback(null, {});
    });
  
    const result = await addAuthor(
      mockQuery,
      3,
      "Michael",
      "Johnson",
      "Brown",
      "1985-05-05"
    );
  
    expect(result).toBe(expectedResponse);
  });

  it("Тест 3: Ошибка при добавлении третьего автора", async () => {
  const expectedQuery = "INSERT INTO course_work.library.author (id_author, name, patronymic, surname, date_of_birth) VALUES ($1, $2, $3, $4, $5)";
  const expectedValues = [3, "Michael", "Johnson", "Brown", "1985-05-05"];
  const expectedError = new Error("Ошибка при выполнении запроса");

  const mockQuery = jest.fn((query, values, callback) => {
    expect(query).toEqual(expectedQuery);
    expect(values).toEqual(expectedValues);
    callback(expectedError, null);
  });

  try {
    await addAuthor(
      mockQuery,
      3,
      "Michael",
      "Johnson",
      "Brown",
      "1985-05-05"
    );
    // Если добавление автора не вызвало ошибку, то тест не прошел
    fail("Ожидалась ошибка при добавлении третьего автора");
  } catch (error) {
    expect(error).toEqual(expectedError);
  }

  expect(mockQuery).toHaveBeenCalledWith(
    expectedQuery,
    expectedValues,
    expect.any(Function)
  );
});
*/