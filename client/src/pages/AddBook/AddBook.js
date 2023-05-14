import {useCallback, useContext, useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {useHttp} from "../../hooks/httpHook";
import './AddBook.css';
import {useInput} from "../../hooks/validationHook";

export const AddBook = () => {
    const history = useHistory();
    const {request, loading, clearError} = useHttp();

    const title = useInput('', {isEmpty: true, minLength: 1});
    const pubYear = useInput('', {isEmpty: true, minLength: 1, isDigit: true});
    const keywords = useInput('', {isEmpty: true, minLength: 1});
    const cover = useInput('', {isEmpty: true, minLength: 1});
    const annotation = useInput('', {isEmpty: true, minLength: 10});
    const pcLocation = useInput('', {isEmpty: true, minLength: 1});
    const oblLocation = useInput('', {isEmpty: true, minLength: 1});
    const pubHouse = useInput('', {isEmpty: true, minLength: 1});
    const pubCity = useInput('', {isEmpty: true, minLength: 1});

    const [genre, setGenre] = useState(1);
    const [authorId, setAuthorId] = useState('1')

    const [authors, setAuthors] = useState([])
    const [curAuthors, setCurAuthors] = useState([]);

    const fetchAuthors = useCallback(async () => {
        const fetched = await request('/api/author/all', 'GET');
        setAuthors(fetched);
        const author = fetched[0]
        setAuthorId(author.id_author.toString())
    }, [ request ]);

    useEffect(async () => {
        await fetchAuthors();
    }, [fetchAuthors]);

    const changeHandler = event => {
        setGenre(event.target.value);
    }
    const changeAuthor = event => {
        setAuthorId(event.target.value);
    }
    const onAddAuthor = () => {
        if (curAuthors.indexOf(authorId.toString()) !== -1) {
            console.log("Уже есть")
        } else {
            setCurAuthors([...curAuthors, authorId])
        }
    }
    const onDeleteAuthor = (e) => {
        const newAuthors = curAuthors.filter(item => item !== e.target.value)
        setCurAuthors([...newAuthors]);
        console.log(e.target.value);
    }

    const registerHandler = async () => {
        try {
            const form = {
                title: title.value,
                year: pubYear.value,
                keywords: keywords.value,
                cover: cover.value,
                annotation: annotation.value,
                location: pcLocation.value,
                locationObl: oblLocation.value,
                id_genre: genre,
                id_authors: curAuthors,
                pubHouse: pubHouse.value,
                pubCity: pubCity.value
            }
            console.log(form);
            const data = await request('/api/books/add', 'POST', {...form});
            history.push('/staffManage');
        } catch (e) {} // Пустой, т.к мы его уже обработали в хуке
    }

    return (
        <div className="add_patient">
            <div className="add_patient__container">
                <h1 className="add_patient__header">Добавление книги</h1>
                <div className="addPat_form__wrap">
                    <div className="addPat_form">
                        <div className="addPat_form__input">
                            {(title.isDirty && title.minLengthError)
                                && <div className="incorrect_value">Необходимо указать название</div>}
                            <input
                                placeholder="Введите название книги"
                                id="title"
                                type="text"
                                name="title"
                                value={title.value}
                                onChange={e => title.onChange(e)}
                                onBlur={e => title.onBlur(e)}/>
                        </div>
                        <div className="addPat_form__input">
                            {(pubYear.isDigitError && pubYear.isDirty)
                                && <div className="incorrect_value">Используйте только цифры</div>}
                            <input
                                placeholder="Введите год публикации"
                                id="pub_year"
                                type="text"
                                name="pub_year"
                                value={pubYear.value}
                                onChange={e => pubYear.onChange(e)}
                                onBlur={e => pubYear.onBlur(e)}/>
                        </div>
                        <div className="addPat_form__input">
                            {(keywords.isDirty && keywords.minLengthError)
                                && <div className="incorrect_value">Необходимо указать ключевые слова</div>}
                            <input
                                placeholder="Укажите ключевые слова через ;"
                                id="keywords"
                                type="text"
                                name="keywords"
                                value={keywords.value}
                                onChange={e => keywords.onChange(e)}
                                onBlur={e => keywords.onBlur(e)}/>
                        </div>
                        <div className="addPat_form__input">
                            {(cover.isDirty && cover.minLengthError)
                                && <div className="incorrect_value">Укажите ссылку</div>}
                            <input
                                placeholder="Вставьте ссылку на обложку"
                                id="cover"
                                name="cover"
                                value={cover.value}
                                onChange={e => cover.onChange(e)}
                                onBlur={e => cover.onBlur(e)}
                            />
                        </div>
                        <div className="addPat_form__input">
                            {(annotation.isDirty && annotation.minLengthError)
                                && <div className="incorrect_value">Напишите краткую аннотацию</div>}
                            <input
                                placeholder="Введите краткую аннотацию"
                                id="annotation"
                                type="text"
                                name="annotation"
                                value={annotation.value}
                                onChange={e => annotation.onChange(e)}
                                onBlur={e => annotation.onBlur(e)}/>
                        </div>
                        <div className="addPat_form__input">
                            {(pcLocation.isDirty && pcLocation.minLengthError)
                                && <div className="incorrect_value">Необходимо указать расположение</div>}
                            <input
                                placeholder="Укажите расположение на компьютере"
                                id="pc_location"
                                type="text"
                                name="pc_location"
                                value={pcLocation.value}
                                onChange={e => pcLocation.onChange(e)}
                                onBlur={e => pcLocation.onBlur(e)}
                            />
                        </div>
                        <div className="addPat_form__input">
                            {(oblLocation.isDirty && oblLocation.minLengthError)
                                && <div className="incorrect_value">Необходимо указать ссылку</div>}
                            <input
                                placeholder="Введите расположение файла в облаке"
                                id="obl_location"
                                type="text"
                                name="obl_location"
                                value={oblLocation.value}
                                onChange={e => oblLocation.onChange(e)}
                                onBlur={e => oblLocation.onBlur(e)}
                            />
                        </div>
                        <div className="addPat_form__input">
                            {(pubHouse.isDirty && pubHouse.minLengthError)
                                && <div className="incorrect_value">Необходимо указать издательство</div>}
                            <input
                                placeholder="Введите издательство книги"
                                id="pubHouse"
                                type="text"
                                name="pubHouse"
                                value={pubHouse.value}
                                onChange={e => pubHouse.onChange(e)}
                                onBlur={e => pubHouse.onBlur(e)}
                            />
                        </div>
                        <div className="addPat_form__input">
                            {(pubCity.isDirty && pubCity.minLengthError)
                                && <div className="incorrect_value">Необходимо указать город издания</div>}
                            <input
                                placeholder="Введите город издания книги"
                                id="pubCity"
                                type="text"
                                name="pubCity"
                                value={pubCity.value}
                                onChange={e => pubCity.onChange(e)}
                                onBlur={e => pubCity.onBlur(e)}
                            />
                        </div>
                        <div className="emp_role">
                            <select className="auth_form__role"
                                    name="genre" id="genre"
                                    onChange={changeHandler}>
                                <option value="1">Роман</option>
                                <option value="2">Повесть</option>
                                <option value="3">Рассказ</option>
                                <option value="4">Былина</option>
                                <option value="5">Учебное пособие</option>
                                <option value="6">Роман в стихах</option>
                                <option value="7">Поэма</option>
                                <option value="8">роман о политике</option>
                                <option value="9">сказка</option>
                                <option value="10">Поэзия</option>
                                <option value="11">Драма</option>
                                <option value="12">Эссе</option>
                                <option value="13">Исторический роман</option>
                                <option value="14">Фантастика</option>
                                <option value="15">Детектив</option>
                                <option value="16">Научно-популярная литература</option>
                                <option value="17">Биография</option>
                                <option value="18">Героическая поэма</option>
                                <option value="19">Интеллектуальный роман</option>
                                <option value="20">Комедия</option>
                                <option value="21">Пародия</option>
                                <option value="22">Аллегория</option>
                                <option value="23">Хроника</option>
                                <option value="24">Мистика</option>
                                <option value="25">Антиутопия</option>
                                <option value="26">Трагедия</option>
                                <option value="27">Сатира</option>
                                <option value="28">Фэнтези</option>
                                <option value="29">Психологический роман</option>
                                <option value="30">Роман-эпопея</option>
                                <option value="31">Приключенческий роман</option>
                                <option value="32">Роман-антиутопия</option>
                                <option value="33">Роман-история</option>
                                <option value="34">Фантазия</option>
                                <option value="35">Притча</option>
                                <option value="36">историческая проза</option>
                            </select>
                        </div>
                        <div className="emp_role">
                            <select className="auth_form__role"
                                    name="author" id="author"
                                    onChange={changeAuthor}>
                                {authors.map(item => (
                                    <option key={item.id_author} value={item.id_author}>
                                        {item.name + " " + item.patronymic + " " + item.surname + " " + item.date_of_birth.slice(0, 4) + "г."}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={onAddAuthor}
                            className="standard_btn addPat_form__btn"
                        >Добавить автора
                        </button>
                    </div>

                    <div className={"addPat_form__author"}>
                        {
                            curAuthors.length === 0 && <div>Выберите автора(-ов)</div>
                        }
                        {
                            curAuthors.map((item, index) => {
                                const author = authors.filter(author => author.id_author == item)[0]
                                return <button
                                    value={item}
                                    style={{border: "none", backgroundColor: "transparent"}}
                                    onClick={onDeleteAuthor}>
                                    {index + 1}. {author.surname} {author.name} {author.patronymic}
                                </button>
                            })
                        }
                    </div>

                    <button
                        onClick={registerHandler}
                        className="standard_btn addPat_form__btn addDoc_btn"
                        disabled={loading || !title.inputValid || curAuthors.length === 0
                                || annotation.isEmpty || keywords.isEmpty || pcLocation.isEmpty
                                || oblLocation.isEmpty || pubYear.isEmpty || pubHouse.isEmpty
                                || pubCity.isEmpty}
                    >Сохранить
                    </button>
                </div>
            </div>
        </div>
    )

}