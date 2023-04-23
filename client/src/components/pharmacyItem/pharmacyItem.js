import {useHistory} from "react-router-dom";
import {useHttp} from "../../hooks/httpHook";

import "./pharmacyItem.css";
import {Modal} from "../modal/Modal";
import {useEffect, useState} from "react";
import './modalWindow.css';
import '../../pages/PharmacyPage/PharmacyPage.css';

export const PharmacyItem = ({item}) => {
    const { loading, request } = useHttp();
    const history = useHistory();
    const { id, name, count, cost, date_end, recomendation, isdelivered } = item;
    const [form, setForm] = useState({
        id: item.id,
        name: item.name,
        count: item.count,
        cost: item.cost,
        date_end: item.date_end.toString().slice(0, 10),
        recomendation: item.recomendation
    });
    const changeHandler = event => {
        console.log(event.target.value);
        setForm({...form, [event.target.name]: event.target.value})
    }

    const updatePharma = async () => {
        try {
            console.log(form);
            const data = await request('/api/pharmacy/edit', 'POST', {...form});
            setEditModal(false);
            history.push('/pharma');
        } catch (e) {}
    }

    const [modalActive, setModalActive] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [arrRec, setArrRec] = useState(recomendation.split('; '))


    return (
        <div key={id} className={"pharmacy_item"}>
            <div className={"pharmacy_item__title"}>{name}</div>
            <div className={"pharmacy_item__count"}>Количество: <span>{count}</span> шт.</div>
            <div className={"pharmacy_item__price"}>Цена: <span>{cost || "бесп."} ₽</span></div>
            <div className={"pharmacy_item__btns"}>
                <button
                    onClick={() => setEditModal(true)}
                    className={"standard_btn pharmacy_item__btn"}
                    type={"submit"}>Редактировать</button>
                <button
                    onClick={() => setModalActive(true)}
                    className={"standard_btn pharmacy_item__btn"}
                    type={"submit"}>Подробнее</button>
                {/*<button*/}
                {/*    className={"standard_btn pharmacy_item__btn"}*/}
                {/*    type={"submit"}>Ещё кнопка</button>*/}
            </div>

            <Modal active={modalActive} setActive={setModalActive}>
                <div className="pharm_modal__info">
                    <div className="pharm_modal__name">Название препарата: <span>{name}</span></div>
                    <div className="pharm_modal__id">Идентификатор партии на складе: <span>{id}</span></div>
                    <div className="pharm_modal__rec">
                        Симптоматика:
                        {
                            <ol style={{ paddingLeft: "15px",margin: 0}}>
                                {arrRec.map((item, i) => {
                                    return <li>{i + 1}. <span>{item}</span></li>
                                })}
                            </ol>
                        }
                    </div>
                    <div className="pharm_modal__count">Осталось на складе: <span>{count}</span> шт.</div>
                    <div className="pharm_modal__endDate">Годен до: <span>{new Date(Date.parse(date_end)).toLocaleDateString()}</span></div>
                    <div className="pharm_modal__price">Цена: <span>{cost || "бесп."}</span> ₽</div>
                    <button
                        type={"submit"}
                        onClick={() => setModalActive(false)}
                        className={"standard_btn pharm_modal__btn"}>Закрыть</button>
                </div>
            </Modal>

            <Modal active={editModal} setActive={setEditModal}>
                <div className="pharm_modal__info">
                    <div className="pharm_modal__id">Идентификатор партии на складе: <span>{id}</span></div>
                    <div className="standard_input__wrap">
                        <input
                            placeholder={"Введите название препарата"}
                            name={"name"}
                            value={form.name} type="text"
                            onChange={changeHandler}/>
                    </div>
                    <div className="standard_input__wrap">
                        <input
                            placeholder={"Введите количество препарата (в шт.)"}
                            name={"count"}
                            value={form.count} type="text"
                            onChange={changeHandler}/>
                    </div>
                    <div className="standard_input__wrap">
                        <input
                            placeholder={"Введите стоимость за шт."}
                            name={"cost"}
                            value={form.cost} type="text"
                            onChange={changeHandler}/>
                    </div>
                    <div className="standard_input__wrap">
                        <input
                            placeholder={"Введите дату окончания срока годности"}
                            name={"date_end"}
                            value={form.date_end.toString().slice(0, 10)}
                            type="text"
                            onChange={changeHandler}/>
                    </div>
                    <div className="standard_input__wrap">
                        <input
                            placeholder={"Введите рекомендации по назначению"}
                            name={"recomendation"}
                            value={form.recomendation}
                            type="text"
                            onChange={changeHandler}/>
                    </div>
                    <div className="edit_form__btns">
                        <button
                            className={"standard_btn edit_form__btn"}
                            onClick={updatePharma}
                            type={"submit"}>Сохранить изменения</button>
                        <button
                            type={"submit"}
                            className={"standard_btn edit_form__btn"}
                            onClick={() => setEditModal(false)}>Отменить</button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}