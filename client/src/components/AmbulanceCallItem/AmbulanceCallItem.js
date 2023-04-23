import {useInput} from "../../hooks/validationHook";
import {useHistory} from "react-router-dom";
import {useState} from "react";

import './AmbulanceCallItem.css';
import {Modal} from "../modal/Modal";
import {useHttp} from "../../hooks/httpHook";

export const AmbulanceCallItem = ({ data, onConfirmHandler, onCancelHandler }) => {
    const { id, phone_num, fio, address, reason, brigade_id, call_date, result, isbusy } = data;
    const InputResult = useInput('', { isEmpty: true });
    const history = useHistory();

    const { request, loading } = useHttp();

    const [modalActive, setModalActive] = useState(false);
    const [modalBrigade, setModalBrigade] = useState(false);

    const [curBrigade, setCurBrigade] = useState({});

    const sendData = () => {
        const body = {
            id: id,
            result: InputResult.value
        }
        onConfirmHandler(body);
    }

    const showBrigade = async () => {
        await request('/api/ambulance/all')
            .then(fetched => {
                const cur = fetched.filter(item => item.brigade_id === brigade_id);
                console.log(cur[0]);
                setCurBrigade(cur[0])
                setModalBrigade(true);
            })
    }

    return (
        <div className={"callItem"}>
            <div className="callItem__container">
                <div className="callItem_info">
                    <div className="callItem_info__item">Номер вызова: <span>{id}</span></div>
                    <div className="callItem_info__item">ФИО пациента: <span>{fio}</span></div>
                    <div className="callItem_info__item">Номер телефона: <span>{phone_num}</span></div>
                    <div className="callItem_info__item">Адрес: <span>{address}</span></div>
                    <div className="callItem_info__item">Причина: <span>{reason}</span></div>
                    <div className="callItem_info__item">
                        Бригада: <button onClick={showBrigade} type={"submit"} value={brigade_id}>{brigade_id}</button>
                    </div>
                    <div className="callItem_info__item">Дата: <span>{new Date(Date.parse(call_date)).toLocaleDateString()}</span></div>
                    <div
                        className={isbusy ? "callItem_info__item red" : "callItem_info__item green"}>Статус: <span>{isbusy ? 'выполняется...' : 'завершен'}</span></div>
                    <div className={isbusy ? "no-visible" : "callItem_info__item"}>Результат выезда: <span>{data.result}</span></div>
                </div>
                <div className={isbusy ? "callItem_actions" : "no-visible"}>
                    <div className="callItem_actions__title">Вызов завершен?</div>
                    <div className="callItem_btns__wrap">
                        <button
                            onClick={() => setModalActive(true)}
                            type={"submit"}
                            className="standard_btn callItem_btn">Завершить</button>
                        <button
                            onClick={() => onCancelHandler(id)}
                            type={"submit"}
                            className="standard_btn callItem_btn">Отменить вызов</button>
                    </div>
                </div>
            </div>
            <Modal active={modalActive} setActive={setModalActive}>
                <div className="callItem_modal__info">
                    <div className="callItem_modal__title">Информация о вызове</div>
                    <div className="callItem_modal__item">Идентификатор: <span>{id}</span></div>
                    <div className="callItem_modal__item">ФИО пациента: <span>{fio}</span></div>
                    <div className="callItem_modal__item">Номер телефона: <span>{phone_num}</span></div>
                    <div className="callItem_modal__item">Адрес: <span>{address}</span></div>
                    <div className="callItem_modal__item">Причина: <span>{reason}</span></div>
                    <div className="callItem_modal__item">Бригада: <span>{brigade_id}</span></div>
                    <div className="callItem_modal__item">Дата: <span>{call_date.toString().slice(0, 10)}</span></div>
                    <div className="standard_input__wrap">
                        {(InputResult.isDirty && InputResult.isEmpty)
                            && <div className="incorrect_value">Поле не может быть пустым</div>}
                        <input type="text"
                               value={InputResult.value}
                               onChange={e => InputResult.onChange(e)}
                               onBlur={e => InputResult.onBlur(e)}
                               placeholder={"Результат выезда"}/>
                    </div>
                    <div className="callItem_form__input">
                        <button type={"submit"}
                                disabled={ !InputResult.inputValid }
                                onClick={sendData}
                                className={"standard_btn callItem_form__btn"}
                                 >Подтвердить отправку</button>
                    </div>
                </div>
            </Modal>
            <Modal active={modalBrigade} setActive={setModalBrigade}>
                <div className="callItem_modal__info">
                    <div className="callItem_modal__title">Информация о бригаде</div>
                    <div className="callItem_modal__item">Бригада: <span>{curBrigade.brigade_id}</span></div>
                    <div className="callItem_modal__item">Врач: <span>{curBrigade.doc_name}</span></div>
                    <div className="callItem_modal__item">Медсестра: <span>{curBrigade.nurse_name}</span></div>
                    <div className="callItem_modal__item">Водитель: <span>{curBrigade.driver_name}</span></div>
                </div>
            </Modal>
        </div>
    );
}