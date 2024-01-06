import '../../reset.css';
import './RegisterPage.css';
import '../AuthPage/AuthPage.css';
import {Link, useHistory} from "react-router-dom";
import {useInput} from "../../hooks/validationHook";
import {useHttp} from "../../hooks/httpHook";
import {Loader} from "../../components/loader/Loader";
import {Modal} from "../../components/modal/Modal";
import {useState} from "react";
import {RecordModal} from "../../modules/DocRecords/RecordModal/RecordModal";

export const RegisterPage = () => {
    const { loading, error, request } = useHttp();

    const [ activeErrorModal, setActiveErrorModal ] = useState(false);
    const [ activeSuccessModal, setActiveSuccessModal ] = useState(false);
    const email = useInput('', { isEmpty: true, isEmail: true });
    const password = useInput('', { isEmpty: true, minLength: 6 });
    const passwordRepeat = useInput('', { isEmpty: true, minLength: 6 });
    const history = useHistory();

    const registerHandler = async () => {
        const body = {
            email: email.value,
            password: password.value
        }
        await request('/api/user/register', 'POST', body)
            .then(resp => {
                setActiveSuccessModal(true)
            })
            .catch(resp => {
                setActiveErrorModal(true)
            })
    }

    const closeSuccessModal = () => {
        setActiveSuccessModal(false)
        history.push('/')
    }

    // if (loading) {
    //     return <Loader />
    // }
    return (
        <div className="auth">
            <div className="auth_container">
                <h1 className="auth_header">Личная электронная библиотека</h1>
                <div className="auth_form__wrap">
                    <div className="auth_form">
                        <span className="auth_form__title">Регистрация</span>
                        <div>
                            <div className="auth_form__input">
                                {(email.isDirty && email.emailError)
                                    && <div className=" auth_incorrect__value incorrect">Некорректная почта</div>}
                                <input
                                    placeholder="Введите email"
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={ email.value }
                                    onBlur={e => email.onBlur(e)}
                                    onChange={e => email.onChange(e)}/>
                            </div>
                            <div className="auth_form__input">
                                {(password.isDirty && password.minLengthError)
                                    && <div className=" auth_incorrect__value incorrect">Пароль должен быть длиннее 6 символов</div>}
                                <input
                                    placeholder="Введите пароль"
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={ password.value }
                                    onBlur={e => password.onBlur(e)}
                                    onChange={e => password.onChange(e)}/>
                            </div>
                            <div className="auth_form__input">
                                {(passwordRepeat.isDirty && passwordRepeat.value !== password.value)
                                    && <div className=" auth_incorrect__value incorrect">Пароли должны совпадать</div>}
                                <input
                                    placeholder="Повторите пароль"
                                    id="password-repeat"
                                    type="password"
                                    name="password-repeat"
                                    value={ passwordRepeat.value }
                                    onBlur={e => passwordRepeat.onBlur(e)}
                                    onChange={e => passwordRepeat.onChange(e)}/>
                            </div>
                        </div>
                    </div>
                    <div className="auth_form__btns">
                        <button
                            onClick={registerHandler}
                            className="standard_btn auth_form__btn"
                            disabled={ loading || !email.inputValid || !password.inputValid
                                || password.value !== passwordRepeat.value }>Регистрация
                        </button>
                        <button
                            className="standard_btn auth_form__btn"
                            disabled={ loading }> <Link to={"/"}>Назад</Link>
                        </button>
                    </div>
                </div>
            </div>
            <Modal active={activeErrorModal} setActive={setActiveErrorModal}>
                <div className={"collection_modal register_modal"}>
                    <h1 className={"staff_title__main"}>Пользователь с таким email уже существует!</h1>
                    <button
                        type={"submit"}
                        onClick={e => setActiveErrorModal(false)}
                        className={"standard_btn staff_schedule__btn"}>Закрыть</button>
                </div>
            </Modal>
            <Modal active={activeSuccessModal} setActive={setActiveSuccessModal}>
                <div className={"collection_modal register_modal"}>
                    <h1 className={"staff_title__main"}>Вы успешно зарегестрированы!</h1>
                    <button
                        type={"submit"}
                        onClick={closeSuccessModal}
                        className={"standard_btn staff_schedule__btn"}>Закрыть</button>
                </div>
            </Modal>
        </div>
    )
}