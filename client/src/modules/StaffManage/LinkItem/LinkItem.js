import {useHttp} from "../../../hooks/httpHook";
import {useHistory} from "react-router-dom";
import './LinkItem.css'
import {useCallback, useEffect, useState} from "react";
import {useInput} from "../../../hooks/validationHook";
import {RecordModal} from "../../DocRecords/RecordModal/RecordModal";

export const LinkItem = ({ item, onDeleteArticle, authors }) => {
    const [ modalActive, setModalActive ] = useState(false);
    const { request, loading } = useHttp();
    const history = useHistory();

    const title = useInput(item.title, {isEmpty: true, minLength: 1});
    const hyperlink = useInput(item.hyperlink, {isEmpty: true, minLength: 1});
    const pubYear = useInput(new Date(Date.parse(item.date_of_publication)).toLocaleDateString(), {isEmpty: true, minLength: 1, isDigit: true});
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

    const closeModal = () => {
        title.setValue(item.title)
        hyperlink.setValue(item.hyperlink)
        pubYear.setValue(new Date(Date.parse(item.date_of_publication)).toLocaleDateString())
        setCurAuthorsId(item.authors_id)
        setCurAuthors(item.authors)
        setModalActive(false)
    }

    const sendUpdates = async () => {
        const body = {
            id_article: item.id_article,
            id_aa: item.aa_array,
            title: title.value,
            date_of_publication: pubYear.value,
            hyperlink: hyperlink.value,
            id_authors: curAuthorsId.map(item => parseInt(item))
        }
        console.log(body);
        const fetched = request('/api/articles/update', 'POST', body)
            .then(resp => setModalActive(false))
            .then(response => history.go(0))
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
                        onClick={() => setModalActive(true)}
                        className={"standard_btn article_standard__btn"}>Редактировать</button>
                    <button
                        type={"submit"}
                        onClick={async () => await onDeleteArticle(item.id_article)}
                        className={"standard_btn article_standard__btn"}>Удалить</button>
                </div>
            </div>
            <RecordModal active={modalActive} setActive={setModalActive}>
                <div className={"card_modal"}>
                    <div className="card_modal__container">
                        <div className="staff_modal__title">Редактирование информации о статье</div>
                        <div className="card_modal_content">
                            <div className={"standard_input__wrap"}>
                                {(title.isDirty && title.isEmpty)
                                    && <div className="incorrect_value addPat_incorrect__value incorrect_value__edit">Поле не может быть пустым</div>}
                                <h1 className={"staff_modal__subtitle"}>Название статьи</h1>
                                <input
                                    placeholder={"Введите название статьи"}
                                    value={title.value}
                                    onChange={e => title.onChange(e)}
                                    onBlur={e => title.onBlur(e)}
                                    type="text"/>
                            </div>
                            <div className={"standard_input__wrap"}>
                                {(pubYear.isDirty && pubYear.isEmpty)
                                    && <div className="incorrect_value addPat_incorrect__value incorrect_value__edit">Поле не может быть пустым</div>}
                                <h1 className={"staff_modal__subtitle"}>Дата публикации статьи</h1>
                                <input
                                    placeholder={"Введите дату публикации"}
                                    value={pubYear.value}
                                    onChange={e => pubYear.onChange(e)}
                                    onBlur={e => pubYear.onBlur(e)}
                                    type="text"/>
                            </div>
                            <div className={"standard_input__wrap"}>
                                {(hyperlink.isDirty && hyperlink.isEmpty)
                                    && <div className="incorrect_value addPat_incorrect__value incorrect_value__edit">Поле не может быть пустым</div>}
                                <h1 className={"staff_modal__subtitle"}>Ссылка на статью</h1>
                                <input
                                    placeholder={"Введите ссылку на статью"}
                                    value={hyperlink.value}
                                    onChange={e => hyperlink.onChange(e)}
                                    onBlur={e => hyperlink.onBlur(e)}
                                    type="text"/>
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
                                    disabled={curAuthorsId.length === 0 || title.isEmpty || pubYear.isEmpty || hyperlink.isEmpty}
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