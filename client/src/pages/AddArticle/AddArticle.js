import {useCallback, useContext, useEffect, useState} from "react";
import {useHttp} from "../../hooks/httpHook";
import {useHistory} from "react-router-dom";
import './AddArticle.css';
import {useInput} from '../../hooks/validationHook';

export const AddArticle = () => {
    const title = useInput('', {isEmpty: true, minLength: 6});
    const dateOfPub = useInput('', {isEmpty: true, isDigit: true});
    const linkArt = useInput('', {isEmpty: true, minLength: 1});

    const history = useHistory();
    const {request, loading, clearError} = useHttp();

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

    const changeAuthor = (e) => {
        setAuthorId(e.target.value);
    }
    const onAddAuthor = () => {
        if (curAuthors.indexOf(authorId.toString()) !== -1) {
            console.log("Такой автор уже есть")
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
                dateOfPub: dateOfPub.value,
                linkArt: linkArt.value,
                id_authors: curAuthors,
            }
            console.log(form);
            await request('/api/articles/add', 'POST', {...form});
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
                        disabled={loading || !title.inputValid || linkArt.isEmpty || dateOfPub.isEmpty || curAuthors.length === 0}
                    >Сохранить
                    </button>
                </div>
            </div>
        </div>
    );
}