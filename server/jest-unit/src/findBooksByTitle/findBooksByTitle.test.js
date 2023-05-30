const findBooksByTitle = require("./findBooksByTitle");

describe("findBooksByTitle", () => {
  let mockQuery;

  beforeEach(() => {
    mockQuery = jest.fn();
  });

  afterEach(() => {
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });

  it("Тест 1: Возвращает список книг по заголовку", async () => {
    const expectedBooks = [
      {
        id_genre: 1,
        id_book: 1,
        title: "Book 1",
        year_of_publication: 2020,
        keywords: ["keyword1", "keyword2"],
        cover: "cover1.jpg",
        brief_annotation: "Annotation 1",
        location: "Library 1",
        location_obl: "Obl 1",
        id_publishing_house: 1,
        pub_name: "Publishing House 1",
        city_of_publication: "City 1",
        genre: "Genre 1",
        ba_array: [1, 2],
        authors_id: [1, 2],
        authors: ["Author 1", "Author 2"],
      },
      // Другие книги...
    ];

    mockQuery.mockImplementation((query, values, callback) => {
      callback(null, { rows: expectedBooks });
    });

    const result = await findBooksByTitle("Book 1", mockQuery);

    expect(result).toEqual(expectedBooks);
  });

  it("Тест 2: Возвращает пустой список, если книги не найдены", async () => {
    const expectedBooks = [];

    mockQuery.mockImplementation((query, values, callback) => {
      callback(null, { rows: expectedBooks });
    });

    const result = await findBooksByTitle("Non-existent Book", mockQuery);

    expect(result).toEqual(expectedBooks);
  });

  it("Тест 3: Ошибка при выполнении запроса", async () => {
    const expectedError = new Error("Ошибка выполнения запроса");

    mockQuery.mockImplementation((query, values, callback) => {
      callback(expectedError);
    });

    try {
      await findBooksByTitle("Book", mockQuery);
    } catch (error) {
      expect(error).toEqual(expectedError);
    }
  });
});


/*
describe('findBooksByTitle', () => {
  test('Должен возвращать соответствующие книги', async () => {
    const queryMock = jest.fn((query, params, callback) => {
      const error = null;
      const result = {
        rows: [
          { id: 1, title: 'Book 1' },
          { id: 2, title: 'Book 2' },
          // Дополнительные ожидаемые результаты
        ],
      };
      callback(error, result);
    });

    const title = 'test';
    const books = await findBooksByTitle(title, queryMock);

    expect(books).toEqual([
      { id: 1, title: 'Book 1' },
      { id: 2, title: 'Book 2' },
      // Ожидаемые результаты
    ]);

    expect(queryMock).toHaveBeenCalledWith(
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
      expect.any(Function)
    );
  });

  test('Должен отклоняться с ошибкой, если запрос завершается неудачно', async () => {
    const queryMock = jest.fn((query, params, callback) => {
      const error = new Error('Ошибка выполнения запроса к базе данных');
      const result = null;
      callback(error, result);
    });

    const title = 'test';
    await expect(findBooksByTitle(title, queryMock)).rejects.toThrow('Ошибка выполнения запроса к базе данных');
    expect(queryMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Array),
      expect.any(Function)
    );
  });
  
/*
const findBooksByTitle = require('./findBooksByTitle');
describe('findBooksByTitle', () => {
  test('should return matching books', async () => {
    const expectedQuery = "SELECT id_genre, b.id_book, title, year_of_publication, keywords, cover, brief_annotation, \n" +
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
      "\t\tHAVING LOWER(title) LIKE $1";

    const expectedTitle = 'test';
    const expectedResults = [
      { id: 1, title: 'Book 1' },
      { id: 2, title: 'Book 2' },
      // Дополнительные ожидаемые результаты
    ];

    const queryMock = jest.fn((query, params, callback) => {
      expect(query).toEqual(expectedQuery);
      expect(params).toEqual([`%${expectedTitle.toLowerCase()}%`]);

      const error = null;
      const result = {
        rows: expectedResults,
      };

      callback(error, result);
    });

    const books = await findBooksByTitle(expectedTitle, queryMock);

    expect(books).toEqual(expectedResults);
    expect(queryMock).toHaveBeenCalledWith(
      expectedQuery,
      [`%${expectedTitle.toLowerCase()}%`],
      expect.any(Function)
    );
  });

  test('should reject with an error if query fails', async () => {
    const expectedQuery = expect.any(String);
    const expectedParams = expect.any(Array);
    const expectedError = new Error('Database query failed');

    const queryMock = jest.fn((query, params, callback) => {
      expect(query).toEqual(expectedQuery);
      expect(params).toEqual(expectedParams);

      const error = expectedError;
      const result = null;

      callback(error, result);
    });

    const title = 'test';
    await expect(findBooksByTitle(title, queryMock)).rejects.toThrow(expectedError);
    expect(queryMock).toHaveBeenCalledWith(
      expectedQuery,
      expectedParams,
      expect.any(Function)
    );
  });
});
*/
