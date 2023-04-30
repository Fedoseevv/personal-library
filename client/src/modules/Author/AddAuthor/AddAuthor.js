import './AddAuthor.css';
import {useInput} from "../../../hooks/validationHook";
import {useHttp} from "../../../hooks/httpHook";
import {useHistory} from "react-router-dom";

export const AddAuthor = () => {
    const name = useInput('', {isEmpty: true, minLength: 1})
    const surname = useInput('', {isEmpty: true, minLength: 1})
    const patronymic = useInput('', {isEmpty: true, minLength: 1})
    const birthDate = useInput('', {isEmpty: true, isDate: true})

    const { loading, request } = useHttp();
    const history = useHistory();

    const registerHandler = async () => {
        try {
            const form = {
                name: name.value,
                surname: surname.value,
                patronymic: patronymic.value,
                birthDate: birthDate.value
            }
            console.log(form);
            request('/api/author/add', 'POST', {...form})
                .then(response => {
                    history.push('/authors');
                })
        } catch (e) {} // Пустой, т.к мы его уже обработали в хуке
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
                            {(patronymic.isDirty && patronymic.minLengthError)
                                && <div className="incorrect_value">Необходимо указать отчество</div>}
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

                        <button
                            onClick={registerHandler}
                            className="standard_btn addPat_form__btn"
                            disabled={loading || !name.inputValid || !patronymic.inputValid || !surname.inputValid || !birthDate.inputValid}
                        >Сохранить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}