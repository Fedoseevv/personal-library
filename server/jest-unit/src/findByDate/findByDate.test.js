const findByDate = require('./findByDate');

describe('findByDate', () => {
  let mockQuery;

  beforeEach(() => {
    mockQuery = jest.fn();
  });

  afterEach(() => {
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });

  it('Тест 1: Поиск статей по дате публикации', async () => {
    const expectedResult = [
      {
        id_article: 1,
        title: 'Статья 1',
        date_of_publication: '2023-05-01',
        hyperlink: 'http://example.com/article1',
        aa_array: [1, 2],
        authors_id: [1, 2],
        authors: ['Александр Николаевич Васильков', 'Ангелина Анатольевна Суркова']
      },
      {
        id_article: 2,
        title: 'Статья 2',
        date_of_publication: '2023-05-01',
        hyperlink: 'http://example.com/article2',
        aa_array: [3, 4],
        authors_id: [3, 4],
        authors: ['Антон Сергеевич Пайфер', 'Федор Андреевич Павлов']
      }
    ];

    mockQuery.mockImplementation((query, values, callback) => {
      callback(null, { rows: expectedResult });
    });

    await findByDate(mockQuery, '2023-05-01');

    expect(mockQuery).toHaveBeenCalledWith(
      "SELECT ar.id_article, title, date_of_publication, hyperlink,\n" +
      "\tarray_agg(aa.id_aa) as aa_array,\n" +
      "\tarray_agg(a.id_author) as authors_id,\n" +
      "\tarray_agg(concat(surname, ' ', a.name, ' ', patronymic, ', ', EXTRACT(YEAR FROM date_of_birth), ' г.р.')) AS authors\n" +
      "FROM course_work.library.article ar, course_work.library.article_author aa, course_work.library.author a\n" +
      "WHERE ar.id_article=aa.id_article AND aa.id_author=a.id_author\n" +
      "GROUP BY ar.id_article, title, date_of_publication, hyperlink\n" +
      "HAVING date_of_publication=$1",
      ['2023-05-01'],
      expect.any(Function)
    );
  });

  it('Тест 1: Поиск статей по дате публикации', async () => {
    const expectedResult = [
      {
        id_article: 1,
        title: 'Статья 1',
        date_of_publication: '2023-05-01',
        hyperlink: 'http://example.com/article1',
        aa_array: [1, 2],
        authors_id: [1, 2],
        authors: ['Александр Николаевич Васильков', 'Ангелина Анатольевна Суркова']
      },
      {
        id_article: 2,
        title: 'Статья 2',
        date_of_publication: '2023-05-01',
        hyperlink: 'http://example.com/article2',
        aa_array: [3, 4],
        authors_id: [3, 4],
        authors: ['Антон Сергеевич Пайфер', 'Федор Андреевич Павлов']
      }
    ];

    mockQuery.mockImplementation((query, values, callback) => {
      callback(null, { rows: expectedResult });
    });

    const result = await findByDate(mockQuery, '2023-05-01');

    expect(result).toEqual(expectedResult);
  });
  
  it('Тест 2: Ошибка при выполнении запроса', async () => {
    const expectedError = new Error('Ошибка выполнения запроса');

    mockQuery.mockImplementation((query, values, callback) => {
      callback(expectedError, null);
    });

    try {
      await findByDate(mockQuery, '2023-05-01');
    } catch (error) {
      expect(error).toEqual(expectedError);
    }
  });
  it('Тест 3: Несуществующая дата', async () => {
    const expectedResult = [];
  
    mockQuery.mockImplementation((query, values, callback) => {
      callback(null, { rows: expectedResult });
    });
  
    const result = await findByDate(mockQuery, '2023-02-30');
  
    expect(result).toEqual(expectedResult);
  });

  it('Тест 6: Пустой результат для даты без статей', async () => {
    const expectedResult = [];
  
    mockQuery.mockImplementation((query, values, callback) => {
      callback(null, { rows: expectedResult });
    });
  
    const result = await findByDate(mockQuery, '2023-06-01');
  
    expect(result).toEqual(expectedResult);
  });
  
  it('Тест 7: Ошибка при выполнении запроса для несуществующей даты', async () => {
    const expectedError = new Error('Ошибка выполнения запроса');
  
    mockQuery.mockImplementation((query, values, callback) => {
      callback(expectedError, null);
    });
  
    try {
      await findByDate(mockQuery, '2023-02-30');
    } catch (error) {
      expect(error).toEqual(expectedError);
    }
  });
  it('Тест 6: Поиск статей по дате публикации', async () => {
    const expectedResult = [
      {
        id_article: 3,
        title: 'Статья 3',
        date_of_publication: '2023-05-02',
        hyperlink: 'http://example.com/article3',
        aa_array: [5, 6],
        authors_id: [5, 6],
        authors: ['Автор 5', 'Автор 6']
      },
      {
        id_article: 4,
        title: 'Статья 4',
        date_of_publication: '2023-05-02',
        hyperlink: 'http://example.com/article4',
        aa_array: [7, 8],
        authors_id: [7, 8],
        authors: ['Автор 7', 'Автор 8']
      }
    ];
  
    mockQuery.mockImplementation((query, values, callback) => {
      callback(null, { rows: expectedResult });
    });
  
    const result = await findByDate(mockQuery, '2023-05-02');
  
    expect(result).toEqual(expectedResult);
  });
  
  it('Тест 7: Ошибка при выполнении запроса', async () => {
    const expectedError = new Error('Ошибка выполнения запроса');
  
    mockQuery.mockImplementation((query, values, callback) => {
      callback(expectedError, null);
    });
  
    try {
      await findByDate(mockQuery, '2023-05-02');
    } catch (error) {
      expect(error).toEqual(expectedError);
    }
  });
  
  
});

