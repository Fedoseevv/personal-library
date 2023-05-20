import {useHttp} from "../../hooks/httpHook";
import {useCallback, useEffect, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import {RecordModal} from "../DocRecords/RecordModal/RecordModal";
import {useInput} from "../../hooks/validationHook";
import {Loader} from "../../components/loader/Loader";

export const AuthorPage = () => {
    const { loading, request } = useHttp();
    const [ authors, setAuthors ] = useState([]);

    const history = useHistory();

    const fetchAuthors = useCallback(async () => {
        const fetchedAuthors = await request('/api/author/all');
        setAuthors(fetchedAuthors);
    }, [ request ]);

    useEffect(async () => {
        await fetchAuthors();
    }, [ fetchAuthors ]);

    if (loading) {
        return <Loader />
    }


    const onDeleteHandler = async (id) => {
        const deleted = request('/api/author/delete', 'POST', {id});
        const filteredAuthors = authors.filter(item => item.id_author != id);
        await fetchAuthors();
        setAuthors(filteredAuthors);
    }

    const onEditHandler = async (body) => {
        console.log(body);
        const edited = request('/api/author/update', 'POST', body);
        await fetchAuthors();
    }

    return (
        <>
            <div className={"staff"}>
                <button
                    type={"submit"}
                    onClick={() => history.push('/addAuthor')}
                    className={"standard_btn without_space"} style={{marginBottom: "20px"}}>Добавить автора</button>
                <h1 className={"staff_title"}>Список авторов</h1>
                <div className="collection_wrap">
                    {
                        !loading && <AuthorsList authors={authors}
                                                    onEditHandler={onEditHandler}
                                                    onDeleteHandler={onDeleteHandler} />

                    }
                </div>
            </div>
        </>
    )
}

export const AuthorsList = ({ authors, onDeleteHandler, onEditHandler }) => {

    return (
        <>
            {
                authors.map((item, index) => {
                    return <AuthorItem
                        item={item}
                        key={index}
                        onEditHandler={onEditHandler}
                        onDeleteHandler={onDeleteHandler} />
                })
            }
        </>
    )
}

export const AuthorItem = ({ item, onDeleteHandler, onEditHandler }) => {
    const [ modalActive, setModalActive ] = useState(false);

    const name = useInput(item.name, {isEmpty: true, minLength: 1});
    const patronymic = useInput(item.patronymic, {isEmpty: true, minLength: 1});
    const surname = useInput(item.surname, {isEmpty: true, minLength: 1});
    const birthDate = useInput(new Date(Date.parse(item.date_of_birth)).toLocaleDateString(), {isEmpty: true, isDate: true});

    const prepForDelete = async () => {
        await onDeleteHandler(item.id_author);
    }
    const prepForUpdate = async () => {
        const form = {
            authorId: item.id_author,
            name: name.value,
            patronymic: patronymic.value,
            surname: surname.value,
            birthDate: birthDate.value
        }
        await onEditHandler(form);
    }

    return (
            <div className={"card"}>
                <div className="card_title">Автор</div>
                <div className="card_content">
                    <div className="card_content__item">ФИО автора: <span>{item.surname} {item.name} {item.patronymic}</span></div>
                    <div className="card_content__item">Дата рождения: <span>{new Date(Date.parse(item.date_of_birth)).toLocaleDateString()}</span></div>
                </div>
                <div className="card_btns__wrap">
                    <button
                        type={"submit"}
                        onClick={() => setModalActive(true)}
                        className={"standard_btn card_btn"}>Редактировать</button>
                    <button
                        type={"submit"}
                        onClick={prepForDelete}
                        className={"standard_btn card_btn"}>Удалить</button>

                </div>
                <RecordModal active={modalActive} setActive={setModalActive}>
                    <div className={"card_modal"}>
                        <div className="card_modal__container">
                            <div className="staff_modal__title">Редактирование информации об авторе</div>
                            <div className="card_modal_content">
                                <div className={"standard_input__wrap"}>
                                    {(name.isDirty && name.isEmpty)
                                        && <div className="incorrect_value addPat_incorrect__value incorrect_value__edit">Поле не может быть пустым</div>}
                                    <h1 className={"staff_modal__subtitle"}>Имя автора</h1>
                                    <input
                                        placeholder={"Введите имя автора"}
                                        value={name.value}
                                        onChange={e => name.onChange(e)}
                                        onBlur={e => name.onBlur(e)}
                                        type="text"/>
                                </div>
                                <div className={"standard_input__wrap"}>
                                    {(patronymic.isDirty && patronymic.isEmpty)
                                        && <div className="incorrect_value addPat_incorrect__value incorrect_value__edit">Поле не может быть пустым</div>}
                                    <h1 className={"staff_modal__subtitle"}>Отчество автора</h1>
                                    <input
                                        placeholder={"Введите отчество автора"}
                                        value={patronymic.value}
                                        onChange={e => patronymic.onChange(e)}
                                        onBlur={e => patronymic.onBlur(e)}
                                        type="text"/>
                                </div>
                                <div className={"standard_input__wrap"}>
                                    {(surname.isDirty && surname.isEmpty)
                                        && <div className="incorrect_value addPat_incorrect__value incorrect_value__edit">Поле не может быть пустым</div>}
                                    <h1 className={"staff_modal__subtitle"}>Фамилия автора</h1>
                                    <input
                                        placeholder={"Введите фамилию автора"}
                                        value={surname.value}
                                        onChange={e => surname.onChange(e)}
                                        onBlur={e => surname.onBlur(e)}
                                        type="text"/>
                                </div>
                                <div className={"standard_input__wrap"}>
                                    {(birthDate.isDirty && birthDate.isEmpty)
                                        && <div className="incorrect_value addPat_incorrect__value incorrect_value__edit">Поле не может быть пустым</div>}
                                    <h1 className={"staff_modal__subtitle"}>Дата рождения автора</h1>
                                    <input
                                        placeholder={"Введите дату рождения автора"}
                                        value={birthDate.value}
                                        onChange={e => birthDate.onChange(e)}
                                        onBlur={e => birthDate.onBlur(e)}
                                        type="text"/>
                                </div>
                                <div className="staff_modal__btns">
                                    <button
                                        type={"submit"}
                                        onClick={prepForUpdate}
                                        disabled={name.isEmpty || surname.isEmpty || patronymic.isEmpty
                                                || birthDate.isEmpty}
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
    )
}