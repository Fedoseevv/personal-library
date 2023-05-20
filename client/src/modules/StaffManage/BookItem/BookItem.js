import './BookItem.css';
import {useCallback, useEffect, useState} from "react";
import {Modal} from '../../../components/modal/Modal';
import './BookModal.css';
import {useHttp} from "../../../hooks/httpHook";
import {useHistory} from "react-router-dom";
import {RecordModal} from "../../DocRecords/RecordModal/RecordModal";
import {useInput} from "../../../hooks/validationHook";


export const BookItem = ({ item, onDeleteBook, authors, allBooks }) => {
    const [ modalActive, setModalActive ] = useState(false);
    const { request, loading } = useHttp();
    const history = useHistory();

    const title = useInput(item.title, {isEmpty: true, minLength: 1});
    const pubYear = useInput(item.year_of_publication, {isEmpty: true, minLength: 1, isDigit: true});
    const keywords = useInput(item.keywords, {isEmpty: true, minLength: 1});
    const cover = useInput(item.cover, {isEmpty: true, minLength: 1});
    const annotation = useInput(item.brief_annotation, {isEmpty: true, minLength: 10});
    const pcLocation = useInput(item.location, {isEmpty: true, minLength: 1});
    const oblLocation = useInput(item.location_obl, {isEmpty: true, minLength: 1});
    const pubName = useInput(item.pub_name, {isEmpty: true, minLength: 1});
    const pubCity = useInput(item.city_of_publication, {isEmpty: true, minLength: 1});
    const [genre, setGenre] = useState(item.id_genre);
    const [curAuthorsId, setCurAuthorsId] = useState(item.authors_id);
    const [curAuthors, setCurAuthors] = useState(item.authors);
    const [ authorId, setAuthorId ] = useState('1');

    const onDeleteAuthor = (e) => {
        const newAuthors = curAuthorsId.filter(item => item != e.target.value)
        setCurAuthorsId([...newAuthors]);
        console.log(e.target.value);
    }
    const changeAuthor = event => {
        setAuthorId(event.target.value);
    }
    const onAddAuthor = () => {
        if (curAuthorsId.indexOf(authorId.toString()) !== -1) {
            console.log("Уже есть")
        } else {
            setCurAuthorsId([...curAuthorsId, authorId])
        }
    }

    const sendUpdates = async () => {

        const body = {
            id_book: item.id_book,
            id_ba: item.ba_array,
            title: title.value,
            year_of_publication: pubYear.value,
            keywords: keywords.value,
            cover: cover.value,
            brief_annotation: annotation.value,
            location: pcLocation.value,
            location_obl: oblLocation.value,
            id_authors: curAuthorsId.map(item => parseInt(item)),
            id_genre: genre,
            id_publishing_house: item.id_publishing_house,
            pub_name: pubName.value,
            pub_city: pubCity.value
        }
        console.log(body)
        const updated = request('/api/books/update', 'POST', body)
            .then((resp) => setModalActive(false))
            .then(response => history.go(0));
    }

    const openModal = () => {
        setModalActive(true)
    }

    const closeModal = () => {
        title.setValue(item.title)
        pubYear.setValue(item.year_of_publication)
        keywords.setValue(item.keywords)
        cover.setValue(item.cover)
        annotation.setValue(item.brief_annotation)
        pcLocation.setValue(item.location)
        oblLocation.setValue(item.location_obl)
        pubName.setValue(item.pub_name)
        pubCity.setValue(item.city_of_publication)
        setGenre(item.id_genre)
        setCurAuthorsId(item.authors_id)
        setModalActive(false)
    }

    return (
        <div className={"staff_item"}>
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
                            type={"submit"}
                            onClick={openModal}
                            className={"standard_btn"}>Редактировать</button>
                        <button
                            type={"submit"}
                            onClick={async () => await onDeleteBook(item.id_book)}
                            className={"standard_btn"}>Удалить</button>
                    </div>
                </div>
            </div>
        <RecordModal active={modalActive} setActive={setModalActive}>
            <div className={"card_modal"}>
                <div className="card_modal__container">
                    <div className="staff_modal__title">Редактирование информации о книге</div>
                    <div className="card_modal_content">
                        <div className={"standard_input__wrap"}>
                            {(title.isDirty && title.isEmpty)
                                && <div className="incorrect_value addPat_incorrect__value incorrect_value__edit">Поле не может быть пустым</div>}
                            <h1 className={"staff_modal__subtitle"}>Название книги</h1>
                            <input
                                placeholder={"Введите название книги"}
                                value={title.value}
                                onChange={e => title.onChange(e)}
                                onBlur={e => title.onBlur(e)}
                                type="text"/>
                        </div>
                        <div className={"standard_input__wrap"}>
                            {(pubYear.isDirty && pubYear.isEmpty)
                                && <div className="incorrect_value addPat_incorrect__value incorrect_value__edit">Поле не может быть пустым</div>}
                            <h1 className={"staff_modal__subtitle"}>Год публикации</h1>
                            <input
                                placeholder={"Введите год публикации"}
                                value={pubYear.value}
                                onChange={e => pubYear.onChange(e)}
                                onBlur={e => pubYear.onBlur(e)}
                                type="text"/>
                        </div>
                        <div className={"standard_input__wrap"}>
                            {(keywords.isDirty && keywords.isEmpty)
                                && <div className="incorrect_value addPat_incorrect__value incorrect_value__edit">Поле не может быть пустым</div>}
                            <h1 className={"staff_modal__subtitle"}>Ключевые слова</h1>
                            <input
                                placeholder={"Введите ключевые слова"}
                                value={keywords.value}
                                onChange={e => keywords.onChange(e)}
                                onBlur={e => keywords.onBlur(e)}
                                type="text"/>
                        </div>
                        <div className={"standard_input__wrap"}>
                            {(cover.isDirty && cover.isEmpty)
                                && <div className="incorrect_value addPat_incorrect__value incorrect_value__edit">Поле не может быть пустым</div>}
                            <h1 className={"staff_modal__subtitle"}>Ссылка на обложку</h1>
                            <input
                                placeholder={"Введите ссылку на обложку"}
                                value={cover.value}
                                onChange={e => cover.onChange(e)}
                                onBlur={e => cover.onBlur(e)}
                                type="text"/>
                        </div>
                        <div className={"standard_input__wrap"}>
                            {(annotation.isDirty && annotation.isEmpty)
                                && <div className="incorrect_value addPat_incorrect__value incorrect_value__edit">Поле не может быть пустым</div>}
                            <h1 className={"staff_modal__subtitle"}>Краткая аннотация</h1>
                            <input
                                placeholder={"Введите краткую аннотацию"}
                                value={annotation.value}
                                onChange={e => annotation.onChange(e)}
                                onBlur={e => annotation.onBlur(e)}
                                type="text"/>
                        </div>
                        <div className={"standard_input__wrap"}>
                            {(pcLocation.isDirty && pcLocation.isEmpty)
                                && <div className="incorrect_value addPat_incorrect__value incorrect_value__edit">Поле не может быть пустым</div>}
                            <h1 className={"staff_modal__subtitle"}>Расположение на компьютере</h1>
                            <input
                                placeholder={"Введите расположение на компьютере"}
                                value={pcLocation.value}
                                onChange={e => pcLocation.onChange(e)}
                                onBlur={e => pcLocation.onBlur(e)}
                                type="text"/>
                        </div>
                        <div className={"standard_input__wrap"}>
                            {(oblLocation.isDirty && oblLocation.isEmpty)
                                && <div className="incorrect_value addPat_incorrect__value incorrect_value__edit">Поле не может быть пустым</div>}
                            <h1 className={"staff_modal__subtitle"}>Расположение в облаке</h1>
                            <input
                                placeholder={"Введите ссылку на файл в облаке"}
                                value={oblLocation.value}
                                onChange={e => oblLocation.onChange(e)}
                                onBlur={e => oblLocation.onBlur(e)}
                                type="text"/>
                        </div>
                        <div className={"standard_input__wrap"}>
                            {(pubName.isDirty && pubName.isEmpty)
                                && <div className="incorrect_value addPat_incorrect__value incorrect_value__edit">Поле не может быть пустым</div>}
                            <h1 className={"staff_modal__subtitle"}>Издательство</h1>
                            <input
                                placeholder={"Введите ссылку на файл в облаке"}
                                value={pubName.value}
                                onChange={e => pubName.onChange(e)}
                                onBlur={e => pubName.onBlur(e)}
                                type="text"/>
                        </div>
                        <div className={"standard_input__wrap"}>
                            {(pubCity.isDirty && pubCity.isEmpty)
                                && <div className="incorrect_value addPat_incorrect__value incorrect_value__edit">Поле не может быть пустым</div>}
                            <h1 className={"staff_modal__subtitle"}>Город издания</h1>
                            <input
                                placeholder={"Введите ссылку на файл в облаке"}
                                value={pubCity.value}
                                onChange={e => pubCity.onChange(e)}
                                onBlur={e => pubCity.onBlur(e)}
                                type="text"/>
                        </div>
                        <div className={"standard_input__wrap"}>
                            {(oblLocation.isDirty && oblLocation.isEmpty)
                                && <div className="incorrect_value addPat_incorrect__value incorrect_value__edit">Поле не может быть пустым</div>}
                            <h1 className={"staff_modal__subtitle"}>Укажите жанр произведения</h1>
                            <select className="auth_form__role"
                                    value={genre}
                                    name="genre" id="genre"
                                    onChange={(e) => setGenre(e.target.value)}>
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
                        <h1 className={"staff_modal__subtitle"}>Укажите автора(-ов)</h1>
                        <div className="addPat_form__rec">
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
                                curAuthorsId.length === 0 && <div>Выберите автора(-ов)</div>
                            }
                            {
                                curAuthorsId.map((item, index) => {
                                    const author = authors.filter(author => author.id_author == item)[0]
                                    return <button
                                        value={item}
                                        key={index}
                                        style={{border: "none", backgroundColor: "transparent"}}
                                        onClick={onDeleteAuthor}>
                                        {index + 1}. {author.surname} {author.name} {author.patronymic}
                                    </button>
                                })
                            }
                        </div>
                        <div className="staff_modal__btns">
                            <button
                                type={"submit"}
                                onClick={async e => await sendUpdates()}
                                disabled={curAuthorsId.length === 0 || title.isEmpty
                                    || pubYear.isEmpty || keywords.isEmpty || pcLocation.isEmpty
                                    || oblLocation.isEmpty || annotation.isEmpty || cover.isEmpty
                                    || pubName.isEmpty || pubCity.isEmpty}
                                className={"standard_btn staff_schedule__btn"}>Сохранить изменения</button>
                            <button
                                type={"submit"}
                                onClick={closeModal}
                                className={"standard_btn staff_schedule__btn"}>Отмена</button>
                        </div>
                    </div>
                </div>
            </div>
        </RecordModal>
        </div>
    );
}