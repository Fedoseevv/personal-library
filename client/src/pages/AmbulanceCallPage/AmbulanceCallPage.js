import './AmbulanceCallPage.css';
import {useHistory} from "react-router-dom";
import {useHttp} from "../../hooks/httpHook";
import { v4 as uuidv4 } from 'uuid';

import {useInput} from '../../hooks/validationHook';
import {changeMobile, changePass, changeDate, changeSnils, stopInput} from "../../helpfulFunctions/validationFunctions";
import {useEffect, useState} from "react";


export const AmbulanceCallPage = () => {
    const history = useHistory();
    const { request, loading } = useHttp();

    const phoneNumber = useInput('', { isEmpty: true, isPhoneNumber: true });
    const fullName = useInput('', { isEmpty: true });
    const address = useInput('', { isEmpty: true });
    const reason = useInput('', { isEmpty: true });
    // const callDate = useInput('', {isEmpty: true, isDate: true});
    const [ brigades, setBrigades ] = useState([]);

    const fetchData = async () => {
        await request('/api/ambulance/freeBrigade', 'GET')
            .then(response => setBrigades(response));
    }

    useEffect(async () => {
        await fetchData();
    }, []);

    return (
        <>
            {loading ? <h1>Loading...</h1> : <RenderPage
                                                request={request}
                                                loading={loading}
                                                history={history}
                                                phoneNumber={phoneNumber}
                                                fullName={fullName}
                                                address={address}
                                                reason={reason}
                                                brigades={brigades}/>}
        </>
    );
}

export const RenderPage = ({phoneNumber, fullName, address, reason, brigades, request, loading, history}) => {
    const [ curBrigade, setCurBrigade ] = useState();
    const createCall = async () => {
        const body = {
            callId: uuidv4(),
            phoneNumber: phoneNumber.value,
            fullName: fullName.value,
            address: address.value,
            reason: reason.value,
            brigade: curBrigade
        }
        await request('/api/ambulance/registerCall', 'POST', body);
        history.push('/calls');
    }

    return (
        <div className={"ambulanceCall"}>
            <div className="ambulanceCall__container">
                <h1 className="ambulanceCall__header">Регистрация вызова</h1>
                <div className="ambulanceCall_form__wrap">
                    <div className="ambulanceCall_form">
                        <div className="ambulanceCall_form__input">
                            {(phoneNumber.isDirty && phoneNumber.phoneError)
                                && <div className="incorrect_value ambulanceCall_incorrect__value">Некорректный номер телефона</div>}
                            <input
                                type="text"
                                placeholder={"Введите номер телефона пациента"}
                                id={"phoneNumber"}
                                name={"phoneNumber"}
                                value={phoneNumber.value}
                                onChange={e => phoneNumber.onChange(e)}
                                onBlur={e => phoneNumber.onBlur(e)}
                                onInput={e => changeMobile(e)}
                            />
                        </div>
                        <div className="ambulanceCall_form__input">
                            {(fullName.isDirty && fullName.isEmpty)
                                && <div className="incorrect_value ambulanceCall_incorrect__value">Поле не может быть пустым</div>}

                            <input
                                type="text"
                                placeholder={"Введите ФИО пациента"}
                                id={"fullName"}
                                name={"fullName"}
                                value={fullName.value}
                                onChange={e => fullName.onChange(e)}
                                onBlur={e => fullName.onBlur(e)}
                            />
                        </div>
                        <div className="ambulanceCall_form__input">
                            {(address.isDirty && address.isEmpty)
                                && <div className="incorrect_value ambulanceCall_incorrect__value">Поле не может быть пустым</div>}
                            <input
                                type="text"
                                placeholder={"Введите адрес"}
                                id={"address"}
                                name={"address"}
                                value={address.value}
                                onChange={e => address.onChange(e)}
                                onBlur={e => address.onBlur(e)}
                            />
                        </div>
                        <div className="ambulanceCall_form__input">
                            {(reason.isDirty && reason.isEmpty)
                                && <div className="incorrect_value ambulanceCall_incorrect__value">Поле не может быть пустым</div>}
                            <input
                                type="text"
                                placeholder={"Введите причину вызова"}
                                id={"reason"}
                                name={"reason"}
                                value={reason.value}
                                onChange={e => reason.onChange(e)}
                                onBlur={e => reason.onBlur(e)}
                            />
                        </div>
                        <div className="ambulanceCall_form__input">
                            <div className="ambulanceCall_form__title">Выберите бригаду</div>
                            <select
                                className={"auth_form__role"}
                                name="brigade"
                                id="brigade" onClick={e => setCurBrigade(e.target.value)}>
                                {
                                    brigades.map(item => {
                                        return <option value={item.brigade_id}>{item.brigade_id}</option>
                                    })
                                }
                            </select>
                        </div>
                        <button
                            onClick={createCall}
                            type={"submit"}
                            disabled={ !(!!curBrigade) }
                            className={"ambulanceCall_form__btn"}>Отправить бригаду</button>
                    </div>
                </div>
            </div>
        </div>
    );
}