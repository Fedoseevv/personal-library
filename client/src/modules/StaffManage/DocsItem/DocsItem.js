import {useCallback, useEffect, useState} from "react";
import {useHttp} from "../../../hooks/httpHook";
import {useHistory} from "react-router-dom";
import {Modal} from "../../../components/modal/Modal";
import './DocsItem.css';
import {RecordModal} from "../../DocRecords/RecordModal/RecordModal";
import {useInput} from "../../../hooks/validationHook";

export const DocsItem = ({ item }) => {
    const [ modalActive, setModalActive ] = useState(false);
    const { request, loading } = useHttp();
    const history = useHistory();

    const title = useInput(item.title, {isEmpty: true, minLength: 1});
    const pubYear = useInput(item.date_of_publication, {isEmpty: true, minLength: 1, isDigit: true});
    const pcLocation = useInput(item.location, {isEmpty: true, minLength: 1});
    const oblLocation = useInput(item.location_obl, {isEmpty: true, minLength: 1});
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

    const sendUpdates = async () => {
        const body = {
            id_document: item.id_document,
            id_da: item.id_da,
            title: title.value,
            date_of_publication: pubYear.value,
            location: pcLocation.value,
            location_obl: oblLocation.value,
            id_author: authorId
        }
        console.log(body);
        const fetched = request('/api/documents/update', 'POST', body)
            .then(resp => setModalActive(false))
            .then(response => history.go(0))
    }

    return (
        <div className={"docs_item"}>
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
                    <button
                        type={"submit"}
                        onClick={() => setModalActive(true)}
                        className={"standard_btn docs_standard__btn"}>Редактировать</button>
                </div>
            </div>
            <RecordModal active={modalActive} setActive={setModalActive}>
                <div className={"card_modal"}>
                    <div className="card_modal__container">
                        <div className="staff_modal__title">Редактирование информации о документе</div>
                        <div className="card_modal_content">
                            <div className={"standard_input__wrap"}>
                                {(title.isDirty && title.isEmpty)
                                    && <div className="incorrect_value addPat_incorrect__value">Поле не может быть пустым</div>}
                                <h1 className={"staff_modal__subtitle"}>Название документа</h1>
                                <input
                                    placeholder={"Введите название документа"}
                                    value={title.value}
                                    onChange={e => title.onChange(e)}
                                    onBlur={e => title.onBlur(e)}
                                    type="text"/>
                            </div>
                            <div className={"standard_input__wrap"}>
                                {(pubYear.isDirty && pubYear.isEmpty)
                                    && <div className="incorrect_value addPat_incorrect__value">Поле не может быть пустым</div>}
                                <h1 className={"staff_modal__subtitle"}>Дата публикации документа</h1>
                                <input
                                    placeholder={"Введите дату публикации"}
                                    value={new Date(Date.parse(pubYear.value)).toLocaleDateString()}
                                    onChange={e => pubYear.onChange(e)}
                                    onBlur={e => pubYear.onBlur(e)}
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