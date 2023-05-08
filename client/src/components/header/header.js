import {useContext} from "react";
import {AuthContext} from "../../context/AuthContext";
import {Link, useHistory} from 'react-router-dom';
import './header.css';

export const Header = (props) => {
    const auth = useContext(AuthContext);
    const {isAuth, role} = props;

    const history = useHistory();

    const logoutHandler = (event) => { // Функция выхода из ИС
        event.preventDefault(); // Отменяем стандартное поведение браузера
        auth.logout(); // Выходим
        history.push('/'); // Перекидываем на стр со входом
    }

    let elem = "";
    if (isAuth) {
        elem =
            <div className={"header_container"}>
                <div className="wrapper">
                    <ul className="navigation">
                        <li><Link  to={'/staffManage'}>Главная страница</Link></li>
                        <li><Link to={'/addEmp'}>Добавить источник</Link>
                            <ul>
                                <li><Link  to={'/addEmp'}>Добавить книгу</Link></li>
                                <li><Link  to={'/addPatient'}>Добавить документ</Link></li>
                                <li><Link  to={'/addPharm'}>Добавить статью</Link></li>
                            </ul>
                        </li>
                        <li><Link to={'/collections'}>Мои коллекции</Link></li>
                        <li><Link to={'/search'}>Поиск</Link></li>
                        <li><Link to={'/authors'}>Авторы</Link></li>
                        <li><a href="/" onClick={logoutHandler}>Выйти</a></li>
                        <div className={"clear"}></div>
                    </ul>
                </div>
            </div>
    }
    return (
        <>{elem}</>
    )
}