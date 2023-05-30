const updateAuthor = require("./updateAuthor");

describe("updateAuthor", () => {
  let mockQuery;

  beforeEach(() => {
    mockQuery = jest.fn();
  });

  afterEach(() => {
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });

  it("Тест 1: Автор успешно обновлен", async () => {
    mockQuery.mockImplementation((query, values, callback) => {
      callback(null, {}); // Передаем null в качестве ошибки и {} в качестве результата
    });

    const result = await updateAuthor(
      mockQuery,
      1,
      "John",
      "Doe",
      "Smith",
      "1990-01-01"
    );

    expect(result).toBe("Автор успешно обновлен!");
  });

  it("Тест 2: Автор успешно обновлен", async () => {
    mockQuery.mockImplementation((query, values, callback) => {
      callback(null, {}); // Передаем null в качестве ошибки и {} в качестве результата
    });

    const result = await updateAuthor(
      mockQuery,
      2,
      "Jane",
      "Smith",
      "Doe",
      "1985-05-15"
    );

    expect(result).toBe("Автор успешно обновлен!");
  });

  it("Тест 3: Автор успешно обновлен", async () => {
    mockQuery.mockImplementation((query, values, callback) => {
      callback(null, {}); // Передаем null в качестве ошибки и {} в качестве результата
    });

    const result = await updateAuthor(
      mockQuery,
      3,
      "Michael",
      "Johnson",
      "Brown",
      "1978-12-10"
    );

    expect(result).toBe("Автор успешно обновлен!");
  });

  it("Тест 4: Автор успешно обновлен", async () => {
    mockQuery.mockImplementation((query, values, callback) => {
      callback(null, {}); // Передаем null в качестве ошибки и {} в качестве результата
    });

    const result = await updateAuthor(
      mockQuery,
      4,
      "Emily",
      "Wilson",
      "Anderson",
      "1995-09-20"
    );

    expect(result).toBe("Автор успешно обновлен!");
  });
}); 