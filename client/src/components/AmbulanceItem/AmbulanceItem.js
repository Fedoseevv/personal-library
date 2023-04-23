import './AmbulanceItem.css';
import './BrigadeModal.css';

import {useHistory} from "react-router-dom";
import {useHttp} from "../../hooks/httpHook";
import {useState} from "react";
import {Modal} from "../modal/Modal";

export const AmbulanceItem = ({ group }) => {
    const history = useHistory();
    const { brigade_id, doc_id, doc_name, nurse_id, nurse_name, driver_id, driver_name } = group;
    const { request, loading } = useHttp();
    const [ modalActive, setModalActive ] = useState(false);

    const [ emp, setEmp ] = useState({});


    const moreInfo = async e => {
        const id = e.target.value;
        await request(`/api/ambulance/staffById/${id}`, 'GET')
            .then(response => { setEmp(response[0]) }).then(() => setModalActive(true));
    }

    return (
        <div className={"ambulance_list__item"}>
            <div className="list_item__wrap">
                <div className={"list_item__rec"}>Идентификатор бригады: {brigade_id}</div>
                <div className={"list_item__rec"}>Врач: <button onClick={moreInfo} value={doc_id}>{doc_name}</button></div>
                <div className={"list_item__rec"}>Медсестра: <button onClick={moreInfo} value={nurse_id}>{nurse_name}</button></div>
                <div className={"list_item__rec"}>Водитель: <button onClick={moreInfo} value={driver_id}>{driver_name}</button></div>
            </div>
            <Modal active={modalActive} setActive={setModalActive}>
                <div className="employee_info">
                    <div className="employee_info__title">Информация о работнике</div>
                    <div className="employee_info__container">
                        <div className="employee_info__item">Идентификатор: <span>{emp.user_id}</span></div>
                        <div className="employee_info__item">Фамилия: <span>{emp.l_name}</span></div>
                        <div className="employee_info__item">Имя: <span>{emp.f_name}</span></div>
                        <div className="employee_info__item">Отчество: <span>{emp.m_name}</span></div>
                        <div className="employee_info__item">Номер телефона: <span>{emp.phone_number}</span></div>
                        <div className="employee_info__item">Паспорт РФ: <span>{emp.pass_num}</span></div>
                        <div className="employee_info__item">Дата Рождения: <span>{new Date(Date.parse(emp.birth_date)).toLocaleDateString()}</span></div>
                        <div className="employee_info__item">Дата устройства на работу: <span>{new Date(Date.parse(emp.emp_date)).toLocaleDateString()}</span></div>
                        <div className="employee_info__item">Адрес проживания: <span>{emp.address}</span></div>
                        <div className="employee_info__item">СНИЛС: <span>{emp.snils}</span></div>
                    </div>
                    <button
                        type={"submit"}
                        onClick={() => setModalActive(false)}
                        className={"standard_btn employee_info__btn"}>Закрыть</button>
                </div>
            </Modal>
        </div>
    );
}