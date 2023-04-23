import './StaffCard.css';
import {useEffect, useState} from "react";

export const StaffCard = ({ item }) => {
    const [ emp, setEmp ] = useState({});
    const { user_id, f_name, m_name, l_name, phone_number, pass_num, birth_date, emp_date, address, snils } = item;

    return (
        <>
            { item.hasOwnProperty('user_id') ? renderStaffCard(item) :
                <h1 className={"staffCard_notFound"}>Выберите сотрудника</h1> }
        </>
    )
}

const renderStaffCard = (emp) => {
    return (
        <div className={"staffCard"}>
            <div className="staffCard__container">
                <div className="staffCard_title">Данные о сотруднике</div>
                <div className="staffCard_info">
                    <div className="staffCard_info__item">Идентификатор: <span>{emp.user_id}</span></div>
                    <div className="staffCard_info__item">Фамилия: <span>{emp.l_name}</span></div>
                    <div className="staffCard_info__item">Имя: <span>{emp.f_name}</span></div>
                    <div className="staffCard_info__item">Отчество: <span>{emp.m_name}</span></div>
                    <div className="staffCard_info__item">Номер телефона: <span>{emp.phone_number}</span></div>
                    <div className="staffCard_info__item">Паспорт: <span>{emp.pass_num}</span></div>
                    <div className="staffCard_info__item">Дата Рождения: <span>{emp.birth_date.toString().slice(0, 10)}</span></div>
                    <div className="staffCard_info__item">Дата начала работы: <span>{emp.emp_date.toString().slice(0, 10)}</span></div>
                    <div className="staffCard_info__item">СНИЛС: <span>{emp.snils}</span></div>
                </div>
            </div>
        </div>
    );
}