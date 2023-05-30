import {useCallback, useEffect, useState} from "react";
import { RadioGroup, RadioButton } from 'react-radio-buttons';
import './SearchPage.css';
import {useInput} from "../../hooks/validationHook";
import {useHttp} from "../../hooks/httpHook";
import {Loader} from "../../components/loader/Loader";
import {RecordModal} from "../DocRecords/RecordModal/RecordModal";
import {Modal} from "../../components/modal/Modal";

export const SearchPage = () => {
    // const fieldVal = useInput('', {isEmpty: true, minLength: 1});
    const [fieldVal, setFieldVal] = useState('')
    const {loading, request} = useHttp();
    const [isSearched, setIsSearched] = useState(false)

    const [selectedValue, setSelectedValue] = useState('books');
    const [ searchField, setSearchField ] = useState('Название');

    const handleOnChange = (value) => {
        setSearchField("Название")
        setFieldVal("")
        setSelectedValue(value);
    };

    const [ books, setBooks ] = useState([]);
    const [ docs, setDocs ] = useState([]);
    const [ articles, setArticles ] = useState([]);



    const changeField = (e) => {
        setFieldVal("")
        setSearchField(e.target.value)
    }

    const searchSources = async () => {
        console.log(`selectedValue: ${selectedValue}`)
        console.log(`selectedField: ${searchField}`)
        console.log(`fieldVal: ${fieldVal}`)
        setIsSearched(true);
        if (selectedValue === "articles") {
            if (searchField === "Название") {
                const body = { title: fieldVal }
                const fetched = request('/api/articles/find/title', 'POST', body)
                    .then(response => {
                        setArticles(response);
                        setBooks([]);
                        setDocs([]);
                    })

            } else if (searchField === "Автор") {
                const body = { author: fieldVal }
                const fetched = request('/api/articles/find/author', 'POST', body)
                    .then(response => {
                        setArticles(response);
                        setBooks([]);
                        setDocs([]);
                    })

            } else if (searchField === "Дата публикации") {
                const body = { date: fieldVal }
                console.log(body)
                const fetched = request('/api/articles/find/date', 'POST', body)
                    .then(response => {
                        setArticles(response);
                        setBooks([]);
                        setDocs([]);
                    })
            }
        }

        else if (selectedValue === "docs") {
            if (searchField === "Название") {
                const body = { title: fieldVal }
                const fetched = request('/api/documents/find/title', 'POST', body)
                    .then(response => {
                        setArticles([]);
                        setBooks([]);
                        setDocs(response);
                    })
            } else if (searchField === "Автор") {
                const body = { author: fieldVal }
                const fetched = request('/api/documents/find/author', 'POST', body)
                    .then(response => {
                        setArticles([]);
                        setBooks([]);
                        setDocs(response);
                    })

            }  else if (searchField === "Дата публикации") {
                const body = { date: fieldVal }
                console.log(body)
                const fetched = request('/api/documents/find/date', 'POST', body)
                    .then(response => {
                        setArticles([]);
                        setBooks([]);
                        setDocs(response);
                    })
            }
        }

        else if (selectedValue === "books") {
            if (searchField === "Название") {
                const body = { title: fieldVal }
                const fetched = request('/api/books/find/title', 'POST', body)
                    .then(response => {
                        setBooks(response);
                        setArticles([]);
                        setDocs([]);
                    })
            } else if (searchField === "Жанр") {
                const body = { genre: fieldVal }
                const fetched = request('/api/books/find/genre', 'POST', body)
                    .then(response => {
                        setBooks(response);
                        setArticles([]);
                        setDocs([]);
                    })
            } else if (searchField === "Издательство") {
                const body = { pubHouse: fieldVal }
                const fetched = request('/api/books/find/pubHouse', 'POST', body)
                    .then(response => {
                        setBooks(response);
                        setArticles([]);
                        setDocs([]);
                    })
            } else if (searchField === "Ключевые слова") {
                const body = { keywords: fieldVal }
                const fetched = request('/api/books/find/keywords', 'POST', body)
                    .then(response => {
                        setBooks(response);
                        setArticles([]);
                        setDocs([]);
                    })
            } else if (searchField === "Год публикации") {
                console.log("yes")
                const body = { pubYear: fieldVal }
                const fetched = request('/api/books/find/pubYear', 'POST', body)
                    .then(response => {
                        setBooks(response);
                        setArticles([]);
                        setDocs([]);
                    })
            } else if (searchField === "Автор") {
                const body = { author: fieldVal }
                const fetched = request('/api/books/find/author', 'POST', body)
                    .then(response => {
                        setBooks(response);
                        setArticles([]);
                        setDocs([]);
                    })
            } else if (searchField === "Краткая аннотация") {
                const body = { briefAnnotation: fieldVal }
                const fetched = request('/api/books/find/briefAnnotation', 'POST', body)
                    .then(response => {
                        setBooks(response);
                        setArticles([]);
                        setDocs([]);
                    })
            }
        }
    }

    const bookFields = {
        title: "Название",
        genre: "Жанр",
        pubHouse: "Издательство",
        keywords: "Ключевые слова",
        pubYear: "Год публикации",
        author: "Автор",
        briefAnn: "Краткая аннотация"
    }
    const docFields = {
        title: "Название",
        author: "Автор",
        datePub: "Дата публикации"
    }
    const artFields = {
        title: "Название",
        author: "Автор",
        datePub: "Дата публикации"
    }


    return (
        <div className={"staff"}>
            <div className={"search_title"}>Поиск</div>
            <div className={"search_subtitle"}>Выберите категорию</div>

            <RadioGroup className={"search_radio__group"} onChange={handleOnChange} value={selectedValue}>
                <RadioButton value="books">Книги</RadioButton>
                <RadioButton value="docs">Документы</RadioButton>
                <RadioButton value="articles">Статьи</RadioButton>
            </RadioGroup>
            <div className={"search_subtitle"}>Выберите критерий поиска</div>
            <div className={selectedValue === "books" ? "emp_role" : "hide_block"}>
                <select className="auth_form__role search_form__field"
                        name="author" id="author"
                        onChange={changeField}>
                    {
                        Object.keys(bookFields).map(item => {
                            return <option key={item}>{bookFields[item]}</option>
                        })
                    }
                </select>
            </div>
            <div className={selectedValue === "docs" ? "emp_role" : "hide_block"}>
                <select className="auth_form__role search_form__field"
                        name="author" id="author"
                        onChange={changeField}>
                    {
                        Object.keys(docFields).map(item => {
                            return <option key={item}>{docFields[item]}</option>
                        })
                    }
                </select>
            </div>
            <div className={selectedValue === "articles" ? "emp_role" : "hide_block"}>
                <select className="auth_form__role search_form__field"
                        name="author" id="author"
                        value={searchField}
                        onChange={changeField}>
                    {
                        Object.keys(artFields).map(item => {
                            return <option key={item}>{artFields[item]}</option>
                        })
                    }
                </select>
            </div>
            <div className="addPat_form__input search_field__input">
                <input
                    placeholder="Введите значение для поиска"
                    id="pub_year"
                    type="text"
                    name="pub_year"
                    value={fieldVal}
                    onChange={e => setFieldVal(e.target.value)}/>
            </div>
            <button
                onClick={searchSources}
                className="standard_btn addPat_form__btn search_btn search_btn__main"
                disabled={loading || fieldVal.length === 0}
            >Найти
            </button>
            <InformationWindow request={request} isSearched={isSearched} loading={loading} articles={articles} docs={docs} books={books} />
        </div>
    )
}

const InformationWindow = ({articles, docs, books, loading, isSearched, request }) => {

    console.log(`isSearched: ${isSearched}`)
    if (loading) {
        return <Loader />
    }

    if (articles.length === 0 && docs.length === 0 && books.length === 0 && isSearched) {
        return <h1 style={{fontWeight: 300, fontSize: 35}}>Ничего не найдено</h1>
    }

    return (
        <>
            {articles.length > 0 ? <div className={"informationWindow"}>

                <ArticlesListInfo articles={articles} loading={loading} />
            </div> : ''}
            {docs.length > 0 ? <div className={"informationWindow"}>

                <DocsListInfo docs={docs} loading={loading} />
            </div> : ''}
            {books.length > 0 ? <div className={"informationWindow"}>


                    <BooksListInfo books={books} loading={loading} request={request} />

            </div> : ''}
        </>

    )
}

const BookItem = ({ item, loading }) => {
    const [ allCollections, setAllCollections ] = useState([]);
    const [ modalActive, setModalActive ] = useState(false);

    const fetchAllSources = async () => {
        const collectionsFetched = await fetch(`/api/collections/booksInCollection/${item.id_book}`);
        const data = await collectionsFetched.json();
        console.log(data)
        setAllCollections(data);
    }

    const openModal = async () => {
        await fetchAllSources()
        setModalActive(true);
    }

    const downloadPdf = async () => {
        try {
            // Выполняем GET-запрос на сервер
            const response = await fetch(`/api/books/report/${item.id_book}`);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            // Создаем ссылку для скачивания PDF-файла
            const link = document.createElement('a');
            link.href = url;
            link.download = 'book.pdf';

            // Добавляем ссылку на страницу и нажимаем на нее
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error(err);
        }
    };

    const changeCollections = (e) => {
        const updatedCollections = allCollections.map(item => {
            if (item.id_collection == e.target.value) {
                return {
                    ...item,
                    isin: !item.isin
                };
            }
            return item;
        });

        setAllCollections(updatedCollections);
    };

    const saveCollections = async () => {
        const body = {
            bookId: item.id_book,
            collections: allCollections
        }
        const response = await fetch("/api/collections/updateBook", {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json"
            },
        });
        const data = await response.json(); // Распарсили ответ
        if (!response.ok) {
            throw new Error(data.message || 'Что-то пошло не так');
        }
        setModalActive(false);
    }

    if (loading) {
        return <Loader />
    }


    return (
        <div className={"staff_item"} style={{width: "1300px"}}>
            <div className="staff_item__title">Название книги: '{item.title}'</div>

            <div className="staff_item__wrap">
                <div className="book_img__wrap">
                    <img src={item.cover} alt=""/>
                </div>
                <div className="staff_item__container">
                    <div className="staff_item__info">Год издания: <span>{item.year_of_publication} г.</span></div>
                    <div className="staff_item__info">Жанр: <span>{item.genre}</span></div>
                    <div className="staff_item__info">Краткая аннотация: <span>{item.brief_annotation}</span></div>
                    <div className="staff_item__info">Расположение на компьютере: <span>{item.location.replace("myproto://", "")}</span></div>
                    <div className="staff_item__info">Ключевые слова: <span>{item.keywords.toLowerCase().split(';').join(", ")}</span></div>
                    <div className="staff_item__info">Автор(-ы): <span>{item.authors.join("; ")}</span></div>
                    <div className="staff_item__info">Издательство: <span>{item.pub_name}</span></div>
                    <div className="staff_item__info">Город издания: <span>{item.city_of_publication}</span></div>
                    <div className="staff_item__btns">
                        <button
                            type={"submit"}
                            className={"standard_btn"}><a href={"myproto://" + item.location}>Открыть локально</a></button>
                        <button
                            type={"submit"}
                            className={"standard_btn"}><a target="_blank" href={item.location_obl}>Открыть в облаке</a></button>
                        <button
                            onClick={downloadPdf}
                            className={"standard_btn"}>Сформировать отчет</button>
                        <button
                            type={"submit"}
                            onClick={async () => await openModal()}
                            style={{marginRight: 0}}
                            className={"standard_btn without_space"}>Добавить в коллекцию</button>
                    </div>
                </div>
            </div>
            <Modal active={modalActive} setActive={setModalActive}>
                <div className={"collection_modal"}>
                    <h1 className={"staff_title__main"}>Редактирование коллекций</h1>

                    {
                        allCollections.map(item => {
                            return (
                                <div className={"checkbox_wrap"}>
                                    <input type="checkbox" className="custom-checkbox" id={item.name} name={item.name} value={item.id_collection} checked={item.isin} onChange={changeCollections}/>
                                    <label htmlFor={item.name}>Название коллекции: "{item.name}"</label>
                                </div>
                            )
                        })
                    }
                    <div className="staff_modal__btns collections_modal__btns">
                        <button
                            type={"submit"}
                            onClick={saveCollections}
                            className={"standard_btn staff_schedule__btn"}>Сохранить изменения</button>
                        <button
                            type={"submit"}
                            onClick={e => setModalActive(false)}
                            className={"standard_btn staff_schedule__btn"}>Отмена</button>
                    </div>
                </div>
            </Modal>
        </div>
    )

}
const BooksListInfo = ({ books, loading, request }) => {
    return (
        <>
            {
                books.map(book => {
                    return <BookItem item={book} loading={loading} request={request} />
                })
            }
        </>
    )
}

const DocItem = ({ item, loading }) => {
    const [ allCollections, setAllCollections ] = useState([]);
    const [ modalActive, setModalActive ] = useState(false);

    const fetchAllSources = async () => {
        const collectionsFetched = await fetch(`/api/collections/docInCollection/${item.id_document}`);
        const data = await collectionsFetched.json();
        console.log(data)
        setAllCollections(data);
    }
    const changeCollections = (e) => {
        const updatedCollections = allCollections.map(item => {
            if (item.id_collection == e.target.value) {
                return {
                    ...item,
                    isin: !item.isin
                };
            }
            return item;
        });

        setAllCollections(updatedCollections);
    };
    const saveCollections = async () => {
        const body = {
            docId: item.id_document,
            collections: allCollections
        }
        const response = await fetch("/api/collections/updateDoc", {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json"
            },
        });
        const data = await response.json(); // Распарсили ответ
        if (!response.ok) {
            throw new Error(data.message || 'Что-то пошло не так');
        }
        setModalActive(false);
    }
    const openModal = async () => {
        await fetchAllSources()
        setModalActive(true);
    }
    const downloadPdf = async () => {
        try {
            // Выполняем GET-запрос на сервер
            const response = await fetch(`/api/documents/report/${item.id_document}`);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            // Создаем ссылку для скачивания PDF-файла
            const link = document.createElement('a');
            link.href = url;
            link.download = 'document.pdf';

            // Добавляем ссылку на страницу и нажимаем на нее
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error(err);
        }
    };
    if (loading) {
        return <Loader />
    }

    return (
        <div className={"doc_item__search docs_item"}>
            <div className="docs_item__title">Название документа: '{item.title}'</div>
            <div className="docs_item__container">
                <div className="docs_item__info">Дата публикации документа: {new Date(Date.parse(item.date_of_publication)).toLocaleDateString()}</div>
                <div className="docs_item__info">Расположение локально: {item.location}</div>
                <div className="staff_item__info">Автор(-ы): <span>{item.authors.join("; ")}</span></div>
                <div className="docs_item__btns">
                    <button
                        type={"submit"}
                        style={{marginRight: '10px'}}
                        className={"standard_btn"}><a href={"myproto://" + item.location}>Открыть локально</a></button>
                    <button
                        type={"submit"}
                        style={{marginRight: '10px'}}
                        className={"standard_btn"}><a target="_blank" href={item.location_obl}>Открыть в облаке</a></button>
                    <button
                        type={"submit"}
                        onClick={downloadPdf}
                        style={{marginRight: '10px'}}
                        className={"standard_btn"}>Сформировать отчет</button>
                    <button
                        type={"submit"}
                        style={{marginRight: 0}}
                        onClick={openModal}
                        className={"standard_btn without_space"}>Добавить в коллекцию</button>
                </div>
            </div>
            <Modal active={modalActive} setActive={setModalActive}>
                <div className={"collection_modal"}>
                    <h1 className={"staff_title__main"}>Редактирование коллекций</h1>

                    {
                        allCollections.map(item => {
                            return (
                                <div className={"checkbox_wrap"}>
                                    <input type="checkbox" className="custom-checkbox" id={item.name} name={item.name} value={item.id_collection} checked={item.isin} onChange={changeCollections}/>
                                    <label htmlFor={item.name}>Название коллекции: "{item.name}"</label>
                                </div>
                            )
                        })
                    }
                    <div className="staff_modal__btns collections_modal__btns">
                        <button
                            type={"submit"}
                            onClick={saveCollections}
                            className={"standard_btn staff_schedule__btn"}>Сохранить изменения</button>
                        <button
                            type={"submit"}
                            onClick={e => setModalActive(false)}
                            className={"standard_btn staff_schedule__btn"}>Отмена</button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
const DocsListInfo = ({ docs, loading }) => {
    return (
        <>
            {
                docs.map(doc => {
                    return <DocItem item={doc} loading={loading} />
                })
            }
        </>
    )
}

const ArticleItem = ({ item, loading }) => {
    console.log(item)
    const [ allCollections, setAllCollections ] = useState([]);
    const [ modalActive, setModalActive ] = useState(false);

    const fetchAllSources = async () => {
        const collectionsFetched = await fetch(`/api/collections/articleInCollection/${item.id_article}`);
        const data = await collectionsFetched.json();
        console.log(data)
        setAllCollections(data);
    }
    const changeCollections = (e) => {
        const updatedCollections = allCollections.map(item => {
            if (item.id_collection == e.target.value) {
                return {
                    ...item,
                    isin: !item.isin
                };
            }
            return item;
        });

        setAllCollections(updatedCollections);
    };
    const saveCollections = async () => {
        const body = {
            articleId: item.id_article,
            collections: allCollections
        }
        const response = await fetch("/api/collections/updateArticle", {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json"
            },
        });
        const data = await response.json(); // Распарсили ответ
        if (!response.ok) {
            throw new Error(data.message || 'Что-то пошло не так');
        }
        setModalActive(false);
    }
    const openModal = async () => {
        await fetchAllSources()
        setModalActive(true);
    }
    const downloadPdf = async () => {
        try {
            // Выполняем GET-запрос на сервер
            const response = await fetch(`/api/articles/report/${item.id_article}`);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            // Создаем ссылку для скачивания PDF-файла
            const link = document.createElement('a');
            link.href = url;
            link.download = 'article.pdf';

            // Добавляем ссылку на страницу и нажимаем на нее
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error(err);
        }
    }
    if (loading) {
        return <Loader />
    }

    return (
        <div className={"article_item"}>
            <div className="article_item__title">Название статьи: '{item.title}'</div>
            <div className="article_item__container">
                <div className="article_item__info">Дата публикации статьи: {new Date(Date.parse(item.date_of_publication)).toLocaleDateString()}</div>
                <div className="staff_item__info">Автор(-ы): <span>{item.authors.join("; ")}</span></div>
                <div className="article_item__btns">
                    <button
                        type={"submit"}
                        className={"standard_btn article_standard__btn"}><a target="_blank" href={item.hyperlink}>Открыть статью</a></button>
                    <button
                        type={"submit"}
                        style={{marginRight: '10px'}}
                        onClick={downloadPdf}
                        className={"standard_btn"}>Сформировать отчет</button>
                    <button
                        type={"submit"}
                        style={{marginRight: 0}}
                        onClick={openModal}
                        className={"standard_btn without_space"}>Добавить в коллекцию</button>
                </div>
            </div>
            <Modal active={modalActive} setActive={setModalActive}>
                <div className={"collection_modal"}>
                    <h1 className={"staff_title__main"}>Редактирование коллекций</h1>

                    {
                        allCollections.map(item => {
                            return (
                                <div className={"checkbox_wrap"}>
                                    <input type="checkbox" className="custom-checkbox" id={item.name} name={item.name} value={item.id_collection} checked={item.isin} onChange={changeCollections}/>
                                    <label htmlFor={item.name}>Название коллекции: "{item.name}"</label>
                                </div>
                            )
                        })
                    }
                    <div className="staff_modal__btns collections_modal__btns">
                        <button
                            type={"submit"}
                            onClick={saveCollections}
                            className={"standard_btn staff_schedule__btn"}>Сохранить изменения</button>
                        <button
                            type={"submit"}
                            onClick={e => setModalActive(false)}
                            className={"standard_btn staff_schedule__btn"}>Отмена</button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
const ArticlesListInfo = ({ articles, loading }) => {
    return (
        <>
            {
                articles.map(art => {
                    return <ArticleItem item={art} loading={loading} />
                })
            }
        </>
    )
}