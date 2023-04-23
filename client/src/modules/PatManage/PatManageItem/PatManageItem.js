import './PatManageItem.css';
import {RecordModal} from "../../DocRecords/RecordModal/RecordModal";
import {useState} from "react";
import {useInput} from "../../../hooks/validationHook";
import {
    changeMobile,
    changePass,
    changeDate,
    changeSnils,
    stopInput,
    onlyDigit
} from '../../../helpfulFunctions/validationFunctions';
import {useHttp} from "../../../hooks/httpHook";


export const PatManageItem = ({ item, onEditHandler, unpinHandler, pinHandler }) => {
    const fName = useInput(item.f_name, {isEmpty: true});
    const mName = useInput(item.m_name, {isEmpty: true});
    const lName = useInput(item.l_name, {isEmpty: true});
    const phoneNumber = useInput(item.phone_number, {isEmpty: true, isPhoneNumber: true});
    const address = useInput(item.address, {isEmpty: true});
    const birthDate = useInput(item.birth_date.slice(0, 10), {isEmpty: true, isDate: true});
    const omsNum = useInput(item.oms_num, {isEmpty: true});
    const passNum = useInput(item.pass_num, {isEmpty: true, isPass: true});
    const snils = useInput(item.snils, {isEmpty: true, isSnils: true});

    const { loading } = useHttp();

    const prepareData = async () => {
        const form = {
            user_id: item.user_id,
            f_name: fName.value,
            m_name: mName.value,
            l_name: lName.value,
            phone_number: phoneNumber.value,
            address: address.value,
            birth_date: birthDate.value,
            oms_num: omsNum.value,
            pass_num: passNum.value,
            snils: snils.value
        }
        await onEditHandler(form);
    }


    const [ modalActive, setModalActive ] = useState(false);
    return (
        <div className={"card"}>
            <div className="card_container">
                <div className="card_content">
                    <div className="card_content__item">ФИО: {item.l_name + " " + item.f_name + " " + item.m_name}</div>
                    <div className="card_content__item">Номер телефона: {item.phone_number}</div>
                    <div className="card_content__item">Дата Рождения: {new Date(Date.parse(item.birth_date)).toLocaleDateString()}</div>
                    <div className="card_content__item">Адрес: {item.address}</div>
                    <div className="card_content__item">Полис ОМС: {item.oms_num}</div>
                    <div className="card_content__item">Паспорт РФ: {item.pass_num}</div>
                    <div className="card_content__item">Статус: {item.isattached ? <span className={"green_status"}>прикреплен</span> : <span className={"red_status"}>не прикреплен</span>}</div>
                    <div className="card_content__item">
                        Привелегии:
                        {
                            item.priveleges === 'pensioner' ? ' пенсионер'
                                : item.priveleges === 'invalid' ? ' инвалид'
                                : ' нет привелегий'
                        }
                    </div>
                </div>
                <div className="card_btns__wrap">
                    <button
                        type={"submit"}
                        onClick={() => setModalActive(true)}
                        className={"standard_btn card_btn"}>Редактировать</button>
                    <button
                        className={ item.isattached ? "standard_btn card_btn" : "hide_btn" }
                        onClick={async () => { await unpinHandler(item.user_id) }}
                        type={"submit"}>Открепить</button>
                    <button
                        className={ !item.isattached ? "standard_btn card_btn" : "hide_btn" }
                        onClick={async () => { await pinHandler(item.user_id) }}
                        type={"submit"}>Прикрепить</button>
                </div>
            </div>
            <RecordModal active={modalActive} setActive={setModalActive}>
                <div className={"card_modal"}>
                    <div className="card_modal__container">
                        <div className="card_modal_title">Редактирование данных о пользователе</div>
                        <div className="card_modal_content">
                            <div className={"standard_input__wrap"}>
                                {(lName.isDirty && lName.isEmpty)
                                    && <div className="incorrect_value addPat_incorrect__value">Поле не может быть пустым</div>}
                                <input
                                    placeholder={"Введите фамилию"}
                                    value={lName.value}
                                    onChange={e => lName.onChange(e)}
                                    onBlur={e => lName.onBlur(e)}
                                    type="text"/>
                            </div>
                            <div className={"standard_input__wrap"}>
                                {(fName.isDirty && fName.isEmpty)
                                    && <div className="incorrect_value addPat_incorrect__value">Поле не может быть пустым</div>}
                                <input
                                    placeholder={"Введите имя"}
                                    value={fName.value}
                                    onChange={e => fName.onChange(e)}
                                    onBlur={e => fName.onBlur(e)}
                                    type="text"/>
                            </div>
                            <div className={"standard_input__wrap"}>
                                {(mName.isDirty && mName.isEmpty)
                                    && <div className="incorrect_value addPat_incorrect__value">Поле не может быть пустым</div>}
                                <input
                                    placeholder={"Введите отчество"}
                                    value={mName.value}
                                    onChange={e => mName.onChange(e)}
                                    onBlur={e => mName.onBlur(e)}
                                    type="text"/>
                            </div>
                            <div className={"standard_input__wrap"}>
                                {(phoneNumber.isDirty && phoneNumber.isEmpty)
                                    && <div className="incorrect_value addPat_incorrect__value">Поле не может быть пустым</div>}
                                <input
                                    placeholder={"Введите номер телефона"}
                                    value={phoneNumber.value}
                                    onChange={e => phoneNumber.onChange(e)}
                                    onBlur={e => phoneNumber.onBlur(e)}
                                    onInput={e => changeMobile(e)}
                                    type="text"/>
                            </div>
                            <div className={"standard_input__wrap"}>
                                {(address.isDirty && address.isEmpty)
                                    && <div className="incorrect_value addPat_incorrect__value">Поле не может быть пустым</div>}
                                <input
                                    placeholder={"Введите адрес"}
                                    value={address.value}
                                    onChange={e => address.onChange(e)}
                                    onBlur={e => address.onBlur(e)}
                                    type="text"/>
                            </div>
                            <div className={"standard_input__wrap"}>
                                {(phoneNumber.isDirty && phoneNumber.isEmpty)
                                    && <div className="incorrect_value addPat_incorrect__value">Поле не может быть пустым</div>}
                                <input
                                    placeholder={"Введите дату рождения"}
                                    value={birthDate.value}
                                    onChange={e => birthDate.onChange(e)}
                                    onBlur={e => birthDate.onBlur(e)}
                                    onInput={e => changeDate(e)}
                                    type="text"/>
                            </div>
                            <div className={"standard_input__wrap"}>
                                {(omsNum.isDirty && omsNum.isEmpty)
                                    && <div className="incorrect_value addPat_incorrect__value">Поле не может быть пустым</div>}
                                <input
                                    placeholder={"Введите полис ОМС"}
                                    value={omsNum.value}
                                    onChange={e => omsNum.onChange(e)}
                                    onBlur={e => omsNum.onBlur(e)}
                                    onInput={e => onlyDigit(e)}
                                    type="text"/>
                            </div>
                            <div className={"standard_input__wrap"}>
                                {(passNum.isDirty && passNum.isEmpty)
                                    && <div className="incorrect_value addPat_incorrect__value">Поле не может быть пустым</div>}
                                <input
                                    placeholder={"Введите серию и номер паспорта"}
                                    value={passNum.value}
                                    onChange={e => passNum.onChange(e)}
                                    onBlur={e => passNum.onBlur(e)}
                                    onInput={e => onlyDigit(e)}
                                    type="text"/>
                            </div>
                        </div>
                        <div className="card_modal__btns">
                            <button
                                type={"submit"}
                                onClick={prepareData}
                                disabled={ loading || !lName.inputValid
                                    || !fName.inputValid || !mName.inputValid
                                    || !phoneNumber.inputValid || !birthDate.inputValid
                                    || !address.inputValid || !omsNum.inputValid
                                    || !passNum.inputValid}
                                className={"standard_btn card_modal__btn"}>Подтвердить изменения</button>
                            <button
                                type={"submit"}
                                onClick={() => setModalActive(false)}
                                className={"standard_btn card_modal__btn"}>Отменить</button>
                        </div>
                    </div>
                </div>
            </RecordModal>
        </div>
    );
}