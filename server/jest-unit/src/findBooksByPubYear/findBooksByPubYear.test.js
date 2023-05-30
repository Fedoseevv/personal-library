const findBooksByPubYear = require('./findBooksByPubYear');
/*
// Mock-функция для query метода
const queryMock = jest.fn();

// Тестирование функции findBooksByPubYear
test('findBooksByPubYear возвращает ожидаемый результат', () => {
  // Ожидаемые данные
  const expectedData = [
    {
      id_genre: 1,
      id_book: 1,
      title: 'Book 1',
      year_of_publication: 2021,
      // ...
    },
    {
      id_genre: 2,
      id_book: 2,
      title: 'Book 2',
      year_of_publication: 2021,
      // ...
    },
  ];

  // Мокирование функции query
  queryMock.mockImplementation((query, params, callback) => {
    // Проверка SQL запроса и параметров
    expect(query).toBe("SELECT id_genre, b.id_book, title, year_of_publication, keywords, cover, brief_annotation, \n" +
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
      "\t\tHAVING year_of_publication=$1");
    expect(params).toEqual([2021]);

    // Вызов callback функции с ожидаемыми данными
    callback(null, { rows: expectedData });
  });

  // Вызов функции findBooksByPubYear с мокированной функцией query
  return findBooksByPubYear(queryMock, 2021).then(result => {
    // Проверка, что функция query была вызвана
    expect(queryMock).toHaveBeenCalled();

    // Проверка, что функция findBooksByPubYear возвращает ожидаемые данные
    expect(result).toEqual(expectedData);
  });
});

test('возвращает пустой массив при отсутствии результатов', () => {
    // Мокирование функции query
    queryMock.mockImplementation((query, params, callback) => {
      // Вызов callback функции без данных
      callback(null, { rows: [] });
    });

    // Вызов функции findBooksByPubYear с мокированной функцией query
    return findBooksByPubYear(queryMock, 2022).then(result => {
      // Проверка, что функция query была вызвана
      expect(queryMock).toHaveBeenCalled();

      // Проверка, что функция findBooksByPubYear возвращает пустой массив
      expect(result).toEqual([]);
    });
  });

  test('обрабатывает ошибку', () => {
    // Ожидаемая ошибка
    const expectedError = new Error('Database error');

    // Мокирование функции query
    queryMock.mockImplementation((query, params, callback) => {
      // Вызов callback функции с ошибкой
      callback(expectedError, null);
    });

    // Вызов функции findBooksByPubYear с мокированной функцией query
    return findBooksByPubYear(queryMock, 2021).catch(error => {
      // Проверка, что функция query была вызвана
      expect(queryMock).toHaveBeenCalled();

      // Проверка, что функция findBooksByPubYear выбрасывает ожидаемую ошибку
      expect(error).toEqual(expectedError);
    });
  });

  */


  describe('findBooksByPubYear', () => {
    let mockQuery;
  
    beforeEach(() => {
      mockQuery = jest.fn();
    });
  
    afterEach(() => {
      expect(mockQuery).toHaveBeenCalledTimes(1);
    });
  
    it('Тест 1: Поиск книг по году публикации', async () => {
      const expectedResult = [
        {
          id_genre: 1,
          id_book: 1,
          title: 'Книга 1',
          year_of_publication: 2023,
          keywords: ['ключевое слово 1', 'ключевое слово 2'],
          cover: 'http://example.com/cover1.jpg',
          brief_annotation: 'Аннотация книги 1',
          location: 'Местоположение 1',
          location_obl: 'Местоположение области 1',
          id_publishing_house: 1,
          pub_name: 'Издательство 1',
          city_of_publication: 'Город 1',
          genre: 'Жанр 1',
          ba_array: [1, 2],
          authors_id: [1, 2],
          authors: ['Автор 1', 'Автор 2']
        },
        {
          id_genre: 2,
          id_book: 2,
          title: 'Книга 2',
          year_of_publication: 2023,
          keywords: ['ключевое слово 3', 'ключевое слово 4'],
          cover: 'http://example.com/cover2.jpg',
          brief_annotation: 'Аннотация книги 2',
          location: 'Местоположение 2',
          location_obl: 'Местоположение области 2',
          id_publishing_house: 2,
          pub_name: 'Издательство 2',
          city_of_publication: 'Город 2',
          genre: 'Жанр 2',
          ba_array: [3, 4],
          authors_id: [3, 4],
          authors: ['Автор 3', 'Автор 4']
        }
      ];
  
      mockQuery.mockImplementation((query, values, callback) => {
        callback(null, { rows: expectedResult });
      });
  
      const result = await findBooksByPubYear(mockQuery, 2023);
  
      expect(result).toEqual(expectedResult);
    });
  
    it('Тест 2: Ошибка при выполнении запроса', async () => {
      const expectedError = new Error('Ошибка выполнения запроса');
  
      mockQuery.mockImplementation((query, values, callback) => {
        callback(expectedError, null);
      });
  
      try {
        await findBooksByPubYear(mockQuery, 2023);
      } catch (error) {
        expect(error).toEqual(expectedError);
      }
    });
  });
  /*
  describe('findBooksByPubYear', () => {
    it('должно возвращать книги, опубликованные в указанном году', async () => {
      // Создаем мокирующую функцию query
      const queryMock = jest.fn().mockImplementation((sql, params, callback) => {
        // Эмулируем успешное выполнение запроса и возвращаем результат
        const rows = [
          { id_book: 1, title: 'Book 1', year_of_publication: 2022 },
          { id_book: 2, title: 'Book 2', year_of_publication: 2022 },
        ];
        callback(null, { rows });
      });
  
      // Вызываем функцию findBooksByPubYear с фиктивными аргументами
      const result = await findBooksByPubYear(queryMock, 2022);
  
      // Проверяем, что функция возвращает ожидаемый результат
      expect(result).toEqual([
        { id_book: 1, title: 'Book 1', year_of_publication: 2022 },
        { id_book: 2, title: 'Book 2', year_of_publication: 2022 },
      ]);
  
      // Проверяем, что query была вызвана с ожидаемыми аргументами
      expect(queryMock).toHaveBeenCalledWith(
        expect.stringMatching(/SELECT.*year_of_publication=\$1/),
        [2022],
        expect.any(Function)
      );
    });

    it('должно возвращать пустой массив, если книги не найдены для указанного года', async () => {
      // Создаем мокирующую функцию query
      const queryMock = jest.fn().mockImplementation((sql, params, callback) => {
        // Эмулируем успешное выполнение запроса, но без результатов
        const rows = [];
        callback(null, { rows });
      });
    
      // Вызываем функцию findBooksByPubYear с фиктивными аргументами
      const result = await findBooksByPubYear(queryMock, 2022);
    
      // Проверяем, что функция возвращает пустой массив
      expect(result).toEqual([]);
    
      // Проверяем, что query была вызвана с ожидаемыми аргументами
      expect(queryMock).toHaveBeenCalledWith(
        expect.stringMatching(/SELECT.*year_of_publication=\$1/),
        [2022],
        expect.any(Function)
      );
    });
    
  });
  */