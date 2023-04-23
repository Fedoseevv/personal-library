import './AnalysisItem.css';
import {RecordModal} from "../../DocRecords/RecordModal/RecordModal";
import {useState} from "react";
import {Modal} from "../../../components/modal/Modal";
import {useInput} from "../../../hooks/validationHook";
import {useHttp} from "../../../hooks/httpHook";

export const AnalysisItem = ({ item, deleteHandler, updateRecord }) => {
    const docId = JSON.parse(localStorage.getItem('userData')).userId;
    const [ modalActive, setModalActive ] = useState(false);
    const res = useInput('', { isEmpty: true });

    const { loading } = useHttp();

    const prepareData = async () => {
        const body = {
            an_id: item.an_id,
            doc_id: docId,
            result: res.value
        }
        await updateRecord(body);
    }

    return (
        <div className={"analysisItem"}>
            <div className="analysisItem_container">
                <div className="analysisItem_title">Вид исследования: {item.type}</div>
                <div className="analysisItem_content">
                    <div className="analysisItem_item">ФИО пациента: {item.l_name + " " + item.f_name + " " + item.m_name }</div>
                    <div className="analysisItem_item">Статус исследования: <span className={item.complete ? 'green_status' : 'red_status'}>{item.complete ? 'Выполнен' : 'Не выполнен'}</span></div>
                </div>
                <div className="analysisItem__btns">
                    <button
                        type={"submit"}
                        onClick={() => setModalActive(true)}
                        className={"standard_btn analysisItem_btn"}>Заполнить</button>
                    <button
                        type={"submit"}
                        onClick={() => deleteHandler(item.an_id)}
                        className={"standard_btn analysisItem_btn"}>Удалить</button>
                </div>
            </div>

            <Modal active={modalActive} setActive={setModalActive}>
                <div className={"analysisItem_modal"}>
                    <div className="analysisItem_modal__container">
                        <h1 className="analysisItem_modal__title">Заполнение данных исследования</h1>
                        <div className="analysisItem_modal__content">
                            <div className="analysisItem_modal__item">Тип исследования: {item.type}</div>
                            <div className="analysisItem_modal__item">{item.descr}</div>
                            <div className={"standard_input__wrap"}>
                                <input
                                    value={res.value}
                                    onBlur={e => res.onBlur(e)}
                                    onChange={e => res.onChange(e)}
                                    placeholder={"Введите результат исследования"}
                                    type="text"/>
                            </div>
                        </div>
                        <div className="analysisItem_modal__btns">
                            <button
                                type={"submit"}
                                onClick={prepareData}
                                disabled={ res.value.length === 0  || loading }
                                className={"standard_btn analysisItem_modal__btn"}>Сохранить</button>
                            <button
                                type={"submit"}
                                onClick={() => setModalActive(false)}
                                className={"standard_btn analysisItem_modal__btn"}>Отмена</button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
