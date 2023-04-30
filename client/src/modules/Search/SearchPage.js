import {useState} from "react";
import { RadioGroup, RadioButton } from 'react-radio-buttons';
import './SearchPage.css';
import {useInput} from "../../hooks/validationHook";
import {useHttp} from "../../hooks/httpHook";


export const SearchPage = () => {
    const fieldVal = useInput('', {isEmpty: true, minLength: 1});
    const {loading, request} = useHttp();

    const [selectedValue, setSelectedValue] = useState('books');
    const [ searchField, setSearchField ] = useState('Название');

    const handleOnChange = (value) => {
        setSelectedValue(value);
        console.log(value)
    };

    const [ books, setBooks ] = useState([]);
    const [ docs, setDocs ] = useState([]);
    const [ articles, setArticles ] = useState([]);

    const changeField = (e) => {
        setSearchField(e.target.value)
    }

    const searchSources = async () => {
        if (selectedValue === "articles") {
            if (searchField === "Название") {
                const body = { title: fieldVal.value }
                const fetched = request('/api/articles/find/title', 'POST', body)
                    .then(response => {
                        setArticles(response);
                        setBooks([]);
                        setDocs([]);
                    })

            } else if (searchField === "Автор") {
                const body = { author: fieldVal.value }
                const fetched = request('/api/articles/find/author', 'POST', body)
                    .then(response => {
                        setArticles(response);
                        setBooks([]);
                        setDocs([]);
                    })

            } else if (searchField === "Дата публикации") {
                const body = { date: fieldVal.value }
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
                const body = { title: fieldVal.value }
                const fetched = request('/api/documents/find/title', 'POST', body)
                    .then(response => {
                        setArticles([]);
                        setBooks([]);
                        setDocs(response);
                    })
            } else if (searchField === "Автор") {
                const body = { author: fieldVal.value }
                const fetched = request('/api/documents/find/author', 'POST', body)
                    .then(response => {
                        setArticles([]);
                        setBooks([]);
                        setDocs(response);
                    })

            }  else if (searchField === "Дата публикации") {
                const body = { date: fieldVal.value }
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
                const body = { title: fieldVal.value }
                const fetched = request('/api/books/find/title', 'POST', body)
                    .then(response => {
                        setBooks(response);
                        setArticles([]);
                        setDocs([]);
                    })
            } else if (searchField === "Жанр") {
                const body = { genre: fieldVal.value }
                const fetched = request('/api/books/find/genre', 'POST', body)
                    .then(response => {
                        setBooks(response);
                        setArticles([]);
                        setDocs([]);
                    })
            } else if (searchField === "Издательство") {
                const body = { pubHouse: fieldVal.value }
                const fetched = request('/api/books/find/pubHouse', 'POST', body)
                    .then(response => {
                        setBooks(response);
                        setArticles([]);
                        setDocs([]);
                    })
            } else if (searchField === "Ключевые слова") {
                const body = { keywords: fieldVal.value }
                const fetched = request('/api/books/find/keywords', 'POST', body)
                    .then(response => {
                        setBooks(response);
                        setArticles([]);
                        setDocs([]);
                    })
            } else if (searchField === "Год публикации") {
                const body = { pubYear: fieldVal.value }
                const fetched = request('/api/books/find/pubYear', 'POST', body)
                    .then(response => {
                        setBooks(response);
                        setArticles([]);
                        setDocs([]);
                    })
            } else if (searchField === "Автор") {
                const body = { author: fieldVal.value }
                const fetched = request('/api/books/find/author', 'POST', body)
                    .then(response => {
                        setBooks(response);
                        setArticles([]);
                        setDocs([]);
                    })
            } else if (searchField === "Краткая аннотация") {
                const body = { briefAnnotation: fieldVal.value }
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
            <div className={"search_title"}>Расширенный поиск</div>
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
                {(fieldVal.minLengthError && fieldVal.isDirty)
                    && <div className="incorrect_value">Поле не может быть пустым</div>}
                <input
                    placeholder="Введите год публикации"
                    id="pub_year"
                    type="text"
                    name="pub_year"
                    value={fieldVal.value}
                    onChange={e => fieldVal.onChange(e)}
                    onBlur={e => fieldVal.onBlur(e)}/>
            </div>
            <button
                onClick={searchSources}
                className="standard_btn addPat_form__btn search_btn"
                disabled={loading || !fieldVal.inputValid}
            >Найти
            </button>
            <InformationWindow loading={loading} articles={articles} docs={docs} books={books} />
        </div>
    )
}

const InformationWindow = ({articles, docs, books, loading}) => {

    if (loading) {
        return <h1>Loading...</h1>
    }

    return (
        <>
            {articles.length > 0 ? <div className={"informationWindow"}>

                <ArticlesListInfo articles={articles} />
            </div> : ''}
            {docs.length > 0 ? <div className={"informationWindow"}>

                <DocsListInfo docs={docs} />
            </div> : ''}
            {books.length > 0 ? <div className={"informationWindow"}>


                    <BooksListInfo books={books} />

            </div> : ''}
        </>

    )
}

const BookItem = ({ item }) => {
    return (
        <div className={"staff_item"}>
            <div className="staff_item__title">Название книги: '{item.title}'</div>

            <div className="staff_item__wrap">
                <div className="book_img__wrap">
                    <img src={item.cover} alt=""/>
                </div>
                <div className="staff_item__container">
                    <div className="staff_item__info">Год издания: <span>{item.year_of_publication} г.</span></div>
                    <div className="staff_item__info">Ключевые слова: <span>{item.keywords.toLowerCase().split(';').join(", ")}</span></div>
                    <div className="staff_item__info">Жанр: <span>{item.genre}</span></div>
                    <div className="staff_item__info">Краткая аннотация: <span>{item.brief_annotation}</span></div>
                    <div className="staff_item__info">Расположение на компьютере: <span>{item.location.replace("myproto://", "")}</span></div>
                    <div className="staff_item__info">Ключевые слова: <span>{item.keywords.toLowerCase().split(';').join(", ")}</span></div>
                    <div className="staff_item__info">Автор: <span>{item.surname} {item.name} {item.patronymic}, {item.date_of_birth.slice(0, 4)} г.р</span></div>
                    <div className="staff_item__btns">
                        <button
                            type={"submit"}
                            className={"standard_btn"}><a href={item.location}>Открыть локально</a></button>
                        <button
                            type={"submit"}
                            className={"standard_btn"}><a target="_blank" href={item.location_obl}>Открыть в облаке</a></button>
                    </div>
                </div>
            </div>
        </div>
    )

}
const BooksListInfo = ({ books }) => {
    return (
        <>
            {
                books.map(book => {
                    return <BookItem item={book} />
                })
            }
        </>
    )
}

const DocItem = ({ item }) => {
    return (
        <div className={"doc_item__search docs_item"}>
            <div className="docs_item__title">Название документа: '{item.title}'</div>
            <div className="docs_item__container">
                <div className="docs_item__info">Дата публикации документа: {new Date(Date.parse(item.date_of_publication)).toLocaleDateString()}</div>
                <div className="docs_item__info">Расположение локально: {item.location}</div>
                <div className="docs_item__info">Автор: {item.name} {item.patronymic} {item.surname}, {new Date(Date.parse(item.date_of_birth)).toLocaleDateString()} г.р.</div>
                <div className="docs_item__btns">
                    <button
                        type={"submit"}
                        className={"standard_btn docs_standard__btn"}><a href={"myproto://" + item.location}>Открыть локально</a></button>
                    <button
                        type={"submit"}
                        className={"standard_btn docs_standard__btn"}><a target="_blank" href={item.location_obl}>Открыть в облаке</a></button>
                </div>
            </div>
        </div>
    )
}
const DocsListInfo = ({ docs }) => {
    return (
        <>
            {
                docs.map(doc => {
                    return <DocItem item={doc} />
                })
            }
        </>
    )
}

const ArticleItem = ({ item }) => {
    return (
        <div className={"doc_item__search article_item"}>
            <div className="article_item__title">Название статьи: '{item.title}'</div>
            <div className="article_item__container">
                <div className="article_item__info">Дата публикации статьи: {new Date(Date.parse(item.date_of_publication)).toLocaleDateString()}</div>
                <div className="article_item__info">Автор: {item.name} {item.patronymic} {item.surname}, {new Date(Date.parse(item.date_of_birth)).toLocaleDateString()} г.р.</div>
                <div className="article_item__btns">
                    <button
                        type={"submit"}
                        className={"standard_btn article_standard__btn"}><a target="_blank" href={item.hyperlink}>Открыть статью</a></button>
                </div>
            </div>
        </div>
    )
}
const ArticlesListInfo = ({ articles }) => {
    return (
        <>
            {
                articles.map(art => {
                    return <ArticleItem item={art} />
                })
            }
        </>
    )
}