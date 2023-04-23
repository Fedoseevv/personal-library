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
                        <li><Link to={'/addEmp'}>Моя литература</Link>
                            <ul>
                                <li><Link  to={'/addEmp'}>Добавить книгу</Link></li>
                                <li><Link  to={'/addPatient'}>Добавить документ</Link></li>
                                <li><Link  to={'/addPharm'}>Добавить статью</Link></li>
                            </ul>
                        </li>
                        <li><Link to={'/collections'}>Мои коллекции</Link></li>
                        <li><Link to={'/addCollection'}>Добавить коллекцию</Link></li>
                        {/*<li><Link to={'/pharmacy'}>Управленческие модули</Link>*/}
                        {/*    <ul>*/}
                        {/*        <li><Link to={'/pharmacy'}>Склад медицинских препаратов</Link></li>*/}
                        {/*        <li><Link  to={'/payment'}>Касса</Link></li>*/}
                        {/*        <li><Link to={'/bedFund'}>Коечный фонд</Link></li>*/}
                        {/*    </ul>*/}
                        {/*</li>*/}
                        {/*<li><Link to={''}>Регистратура</Link>*/}
                        {/*    <ul>*/}
                        {/*        <li><Link to={'/patManage'}>Посетители МО</Link></li>*/}
                        {/*        <li><Link to={'findPatient'}>Модуль "ЭМК"</Link></li>*/}
                        {/*        <li><Link to={'/analysis'}>Модуль "Анализы"</Link></li>*/}
                        {/*    </ul>*/}
                        {/*</li>*/}
                        {/*<li><Link to={'/statistics'}>Статистика</Link></li>*/}
                        {/*<li><Link to={'/vacList'}>Вакцинация</Link></li>*/}
                        {/*<li><Link to={'/ambulance'}>Скорая помощь</Link></li>*/}
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