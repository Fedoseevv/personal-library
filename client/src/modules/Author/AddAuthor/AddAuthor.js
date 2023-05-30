import './AddAuthor.css';
import {useInput} from "../../../hooks/validationHook";
import {useHttp} from "../../../hooks/httpHook";
import {useHistory} from "react-router-dom";
import {Loader} from "../../../components/loader/Loader";
import {useCallback, useEffect, useState} from "react";
import {Modal} from "../../../components/modal/Modal";

export const AddAuthor = () => {
    const { loading, request } = useHttp();

    const name = useInput('', {isEmpty: true, minLength: 1})
    const surname = useInput('', {isEmpty: true, minLength: 1})
    const patronymic = useInput('', {isEmpty: true, minLength: 1})
    const birthDate = useInput('', {isEmpty: true, isDate: true})

    const [ authors, setAuthors ] = useState([]);
    const [modalActive, setModalActive] = useState(false)

    const fetchAuthors = useCallback(async () => {
        const data = await request('/api/author/all')
        setAuthors(data)
    }, [ request ])

    useEffect(async () => {
        await fetchAuthors();
    }, [ fetchAuthors ])

    const history = useHistory();

    const registerHandler = async () => {
        const getDate = (dateString) => {
            const date = new Date(dateString);
            const day = date.getDate();
            const month = date.getMonth() + 1; // Месяцы в JavaScript нумеруются с 0
            const year = date.getFullYear();

            // Добавляем ведущий ноль, если число меньше 10
            const formattedDay = day < 10 ? "0" + day : day;
            const formattedMonth = month < 10 ? "0" + month : month;

            const formattedDate = `${formattedDay}.${formattedMonth}.${year}`;
            return formattedDate
        }
        const transform_s = (str) => {
            const arr = str.split('-')
            return arr[2] + "." + arr[1] + "." + arr[0]
        }
        try {
            const form = {
                name: name.value,
                surname: surname.value,
                patronymic: patronymic.value,
                birthDate: birthDate.value
            }
            authors.forEach(item => {
                console.log(item.name + " " + item.patronymic + " " + item.surname + " " + getDate(item.date_of_birth))
            })
            console.log(form);
            const isFind = authors.filter(item =>
                item.name == form.name &&
                item.patronymic == form.patronymic &&
                item.surname == form.surname &&
                getDate(item.date_of_birth) == transform_s(form.birthDate))

            console.log(isFind)

            if (isFind.length > 0) {
                console.log("Такой уже есть")
                setModalActive(true)
                name.setValue("")
                surname.setValue("")
                patronymic.setValue("")
                birthDate.setValue("")
            } else {
                request('/api/author/add', 'POST', {...form})
                    .then(response => {
                        history.push('/authors');
                    })
            }
        } catch (e) {} // Пустой, т.к мы его уже обработали в хуке
    }
    if (loading) {
        return <Loader />
    }


    return (
        <div className="add_patient">
            <div className="add_patient__container">
                <h1 className="add_patient__header">Добавление автора</h1>
                <div className="addPat_form__wrap">
                    <div className="addPat_form">
                        <div className="addPat_form__input">
                            {(name.isDirty && name.minLengthError)
                                && <div className="incorrect_value">Необходимо указать имя</div>}
                            <input
                                placeholder="Введите имя автора"
                                id="name"
                                type="text"
                                name="name"
                                value={name.value}
                                onChange={e => name.onChange(e)}
                                onBlur={e => name.onBlur(e)}/>
                        </div>
                        <div className="addPat_form__input">
                            <input
                                placeholder="Введите отчество автора"
                                id="patronymic"
                                type="text"
                                name="patronymic"
                                value={patronymic.value}
                                onChange={e => patronymic.onChange(e)}
                                onBlur={e => patronymic.onBlur(e)}/>
                        </div>
                        <div className="addPat_form__input">
                            {(surname.isDirty && surname.minLengthError)
                                && <div className="incorrect_value">Необходимо указать фамилию</div>}
                            <input
                                placeholder="Введите фамилию автора"
                                id="surname"
                                type="text"
                                name="surname"
                                value={surname.value}
                                onChange={e => surname.onChange(e)}
                                onBlur={e => surname.onBlur(e)}/>
                        </div>
                        <div className="addPat_form__input">
                            {(birthDate.isDirty && birthDate.dateError)
                                && <div className="incorrect_value">Необходимо указать дату</div>}
                            <input
                                placeholder="Введите дату рождения автора"
                                id="birthDate"
                                type="text"
                                name="birthDate"
                                value={birthDate.value}
                                onChange={e => birthDate.onChange(e)}
                                onBlur={e => birthDate.onBlur(e)}/>
                        </div>
                    </div>
                    <button
                        onClick={registerHandler}
                        className="standard_btn addAuthor_btn"
                        disabled={loading || !name.inputValid || !surname.inputValid || !birthDate.inputValid}
                    >Сохранить
                    </button>
                </div>
            </div>
            <Modal active={modalActive} setActive={setModalActive}>
                <div className={"collection_modal"}>
                    <h1 className={"staff_title__main"}>Автор с такими данными уже существует</h1>
                    <button
                        type={"submit"}
                        onClick={e => setModalActive(false)}
                        className={"standard_btn staff_schedule__btn"}>Закрыть</button>
                </div>
            </Modal>
        </div>
    )
}