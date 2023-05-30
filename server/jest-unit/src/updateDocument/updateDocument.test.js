const updateDocument = require('./updateDocument');

describe("updateDocument", () => {
  let mockQuery;

  beforeEach(() => {
    mockQuery = jest.fn();
  });

  afterEach(() => {
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });

  it("Тест 1: Документ успешно обновлен", async () => {
    mockQuery.mockImplementation((query, values, callback) => {
      callback(null, {}); // Передаем null в качестве ошибки и {} в качестве результата
    });
  
    const result = await updateDocument(
      mockQuery,
      1,
      "New Title",
      "2023-05-20",
      "Library",
      "Some Obl"
    );
  
    expect(result).toBe("Документ успешно обновлен!");
    expect(mockQuery).toHaveBeenCalledWith(
      // Проверяем вызов mockQuery с ожидаемыми аргументами
      "UPDATE course_work.library.document SET title = $1, date_of_publication = $2, location = $3, location_obl = $4, id_user = 1 WHERE id_document = $5",
      ["New Title", "2023-05-20", "Library", "Some Obl", 1],
      expect.any(Function)
    );
  });
  
  

  it("Тест 2: Документ успешно обновлен", async () => {
    mockQuery.mockImplementation((query, values, callback) => {
      callback(null, {});
    });

    const result = await updateDocument(
      mockQuery,
      2,
      "Updated Title",
      "2023-05-21",
      "Location",
      "Location Obl"
    );

    expect(result).toBe("Документ успешно обновлен!");
  });

  it("Тест 3: Документ успешно обновлен", async () => {
    mockQuery.mockImplementation((query, values, callback) => {
      callback(null, {});
    });

    const result = await updateDocument(
      mockQuery,
      3,
      "Modified Title",
      "2023-05-22",
      "New Location",
      "New Obl"
    );

    expect(result).toBe("Документ успешно обновлен!");
  });

  it("Тест 4: Документ успешно обновлен", async () => {
    mockQuery.mockImplementation((query, values, callback) => {
      callback(null, {});
    });

    const result = await updateDocument(
      mockQuery,
      4,
      "Changed Title",
      "2023-05-23",
      "Different Location",
      "Different Obl"
    );

    expect(result).toBe("Документ успешно обновлен!");
  });

  it("Тест 5: Ошибка при обновлении документа с пустым заголовком", async () => {
    const expectedError = new Error("Заголовок документа не может быть пустым");

    mockQuery.mockImplementation((query, values, callback) => {
      callback(null, {});
    });

    try {
      await updateDocument(
        mockQuery,
        7,
        "", // Пустая строка в качестве заголовка
        "2023-05-24",
        "Location",
        "Obl"
      );
    } catch (error) {
      expect(error).toEqual(expectedError);
    }
  }); 
});
