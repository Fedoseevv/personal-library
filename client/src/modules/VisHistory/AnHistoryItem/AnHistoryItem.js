import './AnHistoryItem.css';
import {Modal} from "../../../components/modal/Modal";
import {useState} from "react";

export const AnHistoryItem = ({ item }) => {
    const [ modalActive, setModalActive ] = useState(false);

    return (
        <div className={"analysisHistoryItem"}>
            <div className="analysisHistoryItem_container">
                <div className="analysisHistoryItem_title">Дата направления: {new Date(Date.parse(item.start_date)).toLocaleDateString() + " - " + new Date(Date.parse(item.start_date)).toLocaleTimeString().slice(0, -3)}</div>
                <div className="analysisHistoryItem_content">
                    <div className="analysisHistoryItem_content__item">Статус: { ((!!item.res_an) || item.res_an == null) ? <span className={"green_status"}>Завершен</span> : <span className={"red_status"}>Не выполнен</span> }</div>
                </div>
                {
                    (!!item.res_an) ?
                        <button
                            type={"submit"}
                            onClick={() => setModalActive(true)}
                            className={"standard_btn visHistoryItem_btn"}>Посмотреть информацию</button>
                        :
                        <div className={"analysisHistoryItem_content__item"}>Подробная информация отсутствует...</div>
                }
            </div>
            <Modal active={modalActive} setActive={setModalActive}>
                <div className={"analysisHistoryItem"}>
                    <div className="analysisHistoryItem_container">
                        <div className="analysisHistoryItem_modal__title">Результаты исследования</div>
                        <div className="analysisHistoryItem_modal__content">
                            <div className="analysisHistoryItem_modal__item">Вид исследования: {item.type}</div>
                            <div className="analysisHistoryItem_modal__item">
                                Результат исследования:
                                <ul>
                                {
                                    item.res_an.split('; ').map((item, index) => {
                                        return <li key={index}>{index + 1}. {item}</li>
                                    })
                                }
                                </ul>
                            </div>
                        </div>
                        <div className="analysisHistoryItem_modal__btns">
                            <button
                                type={"submit"}
                                onClick={() => setModalActive(false)}
                                className={"standard_btn analysisHistoryItem_modal_btn"}>Закрыть</button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}