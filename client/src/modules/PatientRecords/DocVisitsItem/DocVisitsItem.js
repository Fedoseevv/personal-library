import './DocVisitsItem.css';
import './DocVisitModal.css';
import {useState} from "react";
import {Modal} from "../../../components/modal/Modal";
import {useHttp} from "../../../hooks/httpHook";

export const DocVisitsItem = ({ item, onCancelHandler, updateRec }) => {
    const [ modalActive, setModalActive ] = useState(false);
    const { request, loading } = useHttp();
    const [ schedule, setSchedule ] = useState([]);
    const [ curVis, setCurVis ] = useState('');
    const dict = {
        "TER_DOC": "Терапевт",
        "HIR_DOC": "Хирург",
        "KARD_DOC": "Кардиолог",
        "NEVR_DOC": "Невролог",
        "OKUL_DOC": "Окулист",
        "LOR_DOC": "ЛОР"
    }

    const [ form, setForm ] = useState({
        ...item,
        date: new Date(Date.parse(item.start_date)).toLocaleDateString(),
        time: new Date(Date.parse(item.start_date)).toLocaleTimeString().slice(0, -3),
        docFullName: item.l_name + " " + item.f_name + " " + item.m_name,
    });

    const showModal = async (doc_id) => {
        const fetched = await request(`/api/staff/schedule/${doc_id}`, 'GET')
            .then(response => {
                setSchedule(response)
            })
            .then(() => setModalActive(true));
    }

    const prepareData = async () => {
        const body = {
            old_vis: item.vis_id,
            vis_id: curVis,
            pat_id: form.pat_id
        }
        await updateRec(body, setModalActive);
    }

    return (
        <div className={"visItem"}>
            <div className="visItem_container">
                <div className="visItem_info">
                    <div className="visItem_field">Номер талона: <span>{form.vis_id}</span></div>
                    <div className="visItem_field">ФИО специалиста: <span>{form.docFullName}</span></div>
                    <div className="visItem_field">Специализация: <span>{dict[form.position]}</span></div>
                    <div className="visItem_field">Дата: <span>{form.date}</span></div>
                    <div className="visItem_field">Время: <span>{form.time}</span></div>
                </div>
                <div className="visItem_btns">
                    <button
                        type={"submit"}
                        onClick={() => showModal(item.doc_id)}
                        className={"standard_btn visItem_btn"}>Перенести</button>
                    <button
                        type={"submit"}
                        onClick={async () => await onCancelHandler(form.vis_id)}
                        className={"standard_btn visItem_btn"}>Отменить</button>
                </div>
            </div>
            <Modal active={modalActive} setActive={setModalActive}>
                <div className="visItem_modal">
                    <h1 className="visItem_modal__title">Перенос записи</h1>
                    <div className="visItem_modal__container">
                        <div className="visItem_modal__info">
                            <div className="visItem_modal__subtitle">Выберите новую удобную дату и время</div>
                            <select
                                className={"modal_schedule__select"}
                                onClick={e => setCurVis(e.target.value)}
                                name="schedule" id="schedule">
                                {
                                    schedule.map(rec => {
                                        return <option value={rec.vis_id}>
                                                {
                                                    new Date(Date.parse(rec.start_date)).toLocaleDateString() + " "
                                                    + new Date(Date.parse(rec.start_date)).toLocaleTimeString().slice(0, -3) + " - "
                                                    + new Date(Date.parse(rec.end_date)).toLocaleTimeString().slice(0, -3)
                                                }
                                                </option>
                                    })
                                }
                            </select>
                        </div>
                        <div className="visItem_modal__btns">
                            <button
                                type={"submit"}
                                onClick={() => setModalActive(false)}
                                className={"standard_btn visItem_modal__btn"}>Отмена</button>
                            <button
                                type={"submit"}
                                onClick={prepareData}
                                className={"standard_btn visItem_modal__btn"}>Сохранить</button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}