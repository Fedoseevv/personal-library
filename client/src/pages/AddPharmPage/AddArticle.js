import {useCallback, useContext, useEffect, useState} from "react";
import {AuthContext} from "../../context/AuthContext";
import {useHttp} from "../../hooks/httpHook";
import {useHistory} from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

import {useInput} from '../../hooks/validationHook';

export const AddArticle = () => {
    const title = useInput('', {isEmpty: true, minLength: 6});
    const dateOfPub = useInput('', {isEmpty: true, isDigit: true});
    const location = useInput('', {isEmpty: true, minLength: 1});
    const linkArt = useInput('', {isEmpty: true, minLength: 1});

    const history = useHistory();
    const auth = useContext(AuthContext);
    const {request, loading, clearError} = useHttp();

    const [authors, setAuthors] = useState([])
    const [authorId, setAuthorId] = useState(1)

    const fetchAuthors = useCallback(async () => {
        const fetched = await request('/api/author/all', 'GET');
        setAuthors(fetched);
    }, [ request ]);

    useEffect(async () => {
        await fetchAuthors();
    }, [fetchAuthors]);

    const changeAuthor = event => {
        setAuthorId(event.target.value);
    }

    const registerHandler = async () => {
        try {
            const form = {
                title: title.value,
                dateOfPub: dateOfPub.value,
                linkArt: linkArt.value,
                authorId: authorId
            }
            console.log(form);
            // await request('/api/articles/add', 'POST', {...form});
            history.push('/staffManage');
        } catch (e) {} // Пустой, т.к мы его уже обработали в хуке
    }

    return (
        <div className="add_patient">
            <div className="add_patient__container">
                <h1 className="add_patient__header">Добавление статьи</h1>
                <div className="addPat_form__wrap">
                    <div className="addPat_form">
                        <div className="addPat_form__input">
                            {(title.isDirty && title.minLengthError) &&
                                <div className="incorrect_value addPat_incorrect__value">Необходимо указать название</div>}
                            <input
                                placeholder="Введите название статьи"
                                id="title"
                                type="text"
                                name="title"
                                value={title.value}
                                onChange={e => title.onChange(e)}
                                onBlur={e => title.onBlur(e)}
                            />
                        </div>
                        <div className="addPat_form__input">
                            {(dateOfPub.isDirty && dateOfPub.isDigitError)
                                && <div className="incorrect_value addPat_incorrect__value">Необходимо указать дату публикации</div>}
                            <input
                                placeholder="Введите дату публикации"
                                id="dateOfPub"
                                type="dateOfPub"
                                name="dateOfPub"
                                value={dateOfPub.value}
                                onChange={e => dateOfPub.onChange(e)}
                                onBlur={e => dateOfPub.onBlur(e)}
                            />
                        </div>
                        <div className="addPat_form__input">
                            {(linkArt.isDirty && linkArt.minLengthError)
                                && <div className="incorrect_value addPat_incorrect__value">Необходимо указать ссылку на статью</div>}
                            <input
                                placeholder="Введите ссылку на статью"
                                id="linkArt"
                                type="text"
                                name="linkArt"
                                value={linkArt.value}
                                onChange={e => linkArt.onChange(e)}
                                onBlur={e => linkArt.onBlur(e)}/>
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
                            onClick={registerHandler}
                            className="standard_btn addPat_form__btn"
                            disabled={loading || !title.inputValid}
                        >Сохранить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}