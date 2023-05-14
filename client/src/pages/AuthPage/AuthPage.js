import '../../reset.css';
import './AuthPage.css';
import {useContext, useEffect, useState} from "react";
import {useHttp} from "../../hooks/httpHook";
import {AuthContext} from "../../context/AuthContext";
import {useInput} from "../../hooks/validationHook";

export const AuthPage = () => {
    const auth = useContext(AuthContext);
    const [ msgVisible, setMsgVisible ] = useState(false);
    const { loading, error, request } = useHttp();
    const [form, setForm] = useState({
        email: '', password: ''
    });
    const email = useInput('', { isEmpty: true, isEmail: true });
    const password = useInput('', { isEmpty: true, minLength: 6 });


    const changeHandler = event => {
        console.log(`${event.target.name}: ${event.target.value}`);
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const loginHandler = async () => {
        try {
            setForm({
                email: email.value,
                password: password.value
            });
            const body = {
                email: email.value,
                password: password.value
            }
            console.log(form.email);
            console.log(form.password);
            const data = await request('/api/user/login', 'POST', body)
            auth.login(data.token);
        } catch (e) {
            console.log("ERROR");
            setMsgVisible(true);
        } // Пустой, т.к мы его уже обработали в хуке
    }

    return (
        <div className="auth">
            <div className="auth_container">
                <h1 className="auth_header">Личная электронная библиотека</h1>
                <div className="auth_form__wrap">
                    <div className="auth_form">
                        <span className="auth_form__title">Вход в систему</span>
                        <div>
                            <div className="auth_form__input">
                                {(email.isDirty && email.emailError)
                                    && <div className="incorrect_value auth_incorrect__value">Некорректная почта</div>}
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
                                    && <div className="incorrect_value auth_incorrect__value">Пароль должен быть длиннее 6 символов</div>}
                                <input
                                    placeholder="Введите пароль"
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={ password.value }
                                    onBlur={e => password.onBlur(e)}
                                    onChange={e => password.onChange(e)}/>
                            </div>
                        </div>
                    </div>
                    <div className="auth_form__btns">
                        <button
                            onClick={loginHandler}
                            className="standard_btn auth_form__btn"
                            disabled={ loading || !email.inputValid || !password.inputValid }>Войти
                        </button>
                    </div>
                </div>
            </div>
            {
                msgVisible && <div style={{fontSize: '25px', fontWeight: 400, marginTop: '25px'}}>Неверный логин или пароль</div>
            }
        </div>
    );
}