import './StaffItem.css';
import {useCallback, useEffect, useState} from "react";
import {Modal} from '../../../components/modal/Modal';
import './StaffModal.css';
import {useHttp} from "../../../hooks/httpHook";
import {useHistory} from "react-router-dom";
import {RecordModal} from "../../DocRecords/RecordModal/RecordModal";
import {useInput} from "../../../hooks/validationHook";


export const StaffItem = ({ item, onDeleteHandler, onEditHandler }) => {
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
    const [genre, setGenre] = useState(item.id_genre);
    const [authors, setAuthors] = useState([])
    const [authorId, setAuthorId] = useState(item.id_author)


    const fetchAuthors = useCallback(async () => {
        const authorsFetched = await request(`/api/author/all`, 'GET');
        setAuthors(authorsFetched);
    }, [ request ]);

    useEffect(async () => {
        await fetchAuthors();
        console.log(item);
    }, [ fetchAuthors ]);

    const [form, setForm] = useState({
        title: item.title,
        year_of_publication: item.year_of_publication,
        keywords: item.keywords,
        cover: item.cover,
        brief_annotation: item.brief_annotation,
        location: item.location,
        location_obl: item.location_obl,
        id_author: item.id_author,
        id_genre: item.id_genre
    });
    const changeHandler = event => {
        console.log(event.target.value);
        setForm({...form, [event.target.name]: event.target.value});
    }

    const sendUpdates = async () => {

        const body = {
            id_book: item.id_book,
            id_ba: item.id_ba,

            title: title.value,
            year_of_publication: pubYear.value,
            keywords: keywords.value,
            cover: cover.value,
            brief_annotation: annotation.value,
            location: pcLocation.value,
            location_obl: oblLocation.value,
            id_author: authorId,
            id_genre: genre
        }
        console.log(body)
        const fetched = request('/api/books/update', 'POST', body)
            .then((resp) => setModalActive(false))
            .then(response => history.go(0));
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
                        <button
                            type={"submit"}
                            onClick={() => setModalActive(true)}
                            className={"standard_btn"}>Редактировать</button>
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
                                && <div className="incorrect_value addPat_incorrect__value">Поле не может быть пустым</div>}
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
                                && <div className="incorrect_value addPat_incorrect__value">Поле не может быть пустым</div>}
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
                                && <div className="incorrect_value addPat_incorrect__value">Поле не может быть пустым</div>}
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
                                && <div className="incorrect_value addPat_incorrect__value">Поле не может быть пустым</div>}
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
                                && <div className="incorrect_value addPat_incorrect__value">Поле не может быть пустым</div>}
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
                                && <div className="incorrect_value addPat_incorrect__value">Поле не может быть пустым</div>}
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
                                && <div className="incorrect_value addPat_incorrect__value">Поле не может быть пустым</div>}
                            <h1 className={"staff_modal__subtitle"}>Расположение в облаке</h1>
                            <input
                                placeholder={"Введите ссылку на файл в облаке"}
                                value={oblLocation.value}
                                onChange={e => oblLocation.onChange(e)}
                                onBlur={e => oblLocation.onBlur(e)}
                                type="text"/>
                        </div>
                        <div className={"standard_input__wrap"}>
                            {(oblLocation.isDirty && oblLocation.isEmpty)
                                && <div className="incorrect_value addPat_incorrect__value">Поле не может быть пустым</div>}
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
                            </select>
                        </div>
                        <div className={"standard_input__wrap"}>
                            {(oblLocation.isDirty && oblLocation.isEmpty)
                                && <div className="incorrect_value addPat_incorrect__value">Поле не может быть пустым</div>}
                            <h1 className={"staff_modal__subtitle"}>Выберите автора</h1>
                            <select className="auth_form__role"
                                    value={authorId}
                                    name="author" id="author"
                                    onChange={(e) => setAuthorId(e.target.value)}>
                                {
                                    authors.map(item => {
                                        return <option value={item.id_author}>{item.name} {item.patronymic} {item.surname}, {item.date_of_birth.slice(0, 4)} г.р</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className="staff_modal__btns">
                            <button
                                type={"submit"}
                                onClick={async e => await sendUpdates()}
                                className={"standard_btn staff_schedule__btn"}>Сохранить изменения</button>
                            <button
                                type={"submit"}
                                onClick={e => setModalActive(false)}
                                className={"standard_btn staff_schedule__btn"}>Отмена</button>
                        </div>
                    </div>
                </div>
            </div>
        </RecordModal>
        </div>
    );
}