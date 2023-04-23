import './VisHistoryItem.css';
import {useHttp} from "../../../hooks/httpHook";
import {useState} from "react";
import {Modal} from "../../../components/modal/Modal";

export const VisHistoryItem = ({ item }) => {
    const { request, loading } = useHttp();
    const [ modalActive, setModalActive ] = useState(false);
    const [ pharma, setPharma ] = useState([]);
    const [ analysis, setAnalysis ] = useState([]);

    const fetchPharma = async () => {
        const fetched = await request(`/api/pharmacy/byId/${item.vis_id}`);
        setPharma(fetched);
    }

    const showModal = async () => {
        await fetchPharma();
        await fetchAnalysis();
        setModalActive(true);
    }
    const fetchAnalysis = async () => {
        const fetched = await request(`/api/analysis/records/byId/${item.vis_id}`);
        setAnalysis(fetched);
    }

    return (
        <div className={"visHistoryItem"}>
            <div className="visHistoryItem_container">
                <div className="visHistoryItem_title">Дата приема: {new Date(Date.parse(item.start_date)).toLocaleDateString() + " - " + new Date(Date.parse(item.start_date)).toLocaleTimeString().slice(0, -3)}</div>
                <div className="visHistoryItem_content">
                    <div className="visHistoryItem_content__item">ФИО врача: {item.l_name + " " + item.f_name + " " + item.m_name}</div>
                    <div className="visHistoryItem_content__item">
                        Специализация врача:
                        {
                            item.position === 'AMB_DOC' ? ' Врач скорой' :
                            item.position === 'AMB_NURSE' ? ' Медсестра скорой' :
                            item.position === 'AMB_DRIVER' ? ' Водитель скорой' :
                            item.position === 'MAIN_DOC' ? ' Глав врач' :
                            item.position === 'TER_DOC' ? ' Терапевт' :
                            item.position === 'HIR_DOC' ? ' Хирург' :
                            item.position === 'KARD_DOC' ? ' Кардиолог' :
                            item.position === 'NEVR_DOC' ? ' Невролог' :
                            item.position === 'OKUL_DOC' ? ' Окулист' :
                            item.position === 'LOR_DOC'? ' ЛОР' : ' Сотрудник лаборатории'
                        }
                    </div>
                    <div className="visHistoryItem_content__item">Статус: { (!!item.result) ? <span className={"green_status"}>Выполнен</span> : <span className={"red_status"}>Не выполнен</span> }</div>
                </div>
                {
                    (!!item.result) ?
                        <button
                            type={"submit"}
                            onClick={showModal}
                            className={"standard_btn visHistoryItem_btn"}>Посмотреть информацию</button>
                        :
                        <div className={"visHistoryItem_content__item"}>Подробная информация отсутствует...</div>
                }
            </div>
            <Modal active={modalActive} setActive={setModalActive}>
                <div className={"visHistoryItem"}>
                    <div className="visHistoryItem_modal__container">
                        <div className="visHistoryItem_modal__title">Подробная информация о приёме</div>
                        <div className="visHistoryItem_modal__content">
                            <div className="visHistoryItem_modal__subtitle">Общая информация</div>
                            <div className="visHistoryItem_modal__field">Причина визита: {item.target}</div>
                            <div className="visHistoryItem_modal__field">Комментарий специалиста, проводившего прием: {item.result}</div>
                            <div className="visHistoryItem_modal__field">ФИО специалиста, проводившего приём: { item.l_name + " " + item.f_name + " " + item.m_name }</div>
                            <div className="visHistoryItem_modal__field">
                                Специальность сотрудника, проводившего приём:
                                {
                                    item.position === 'AMB_DOC' ? ' Врач скорой' :
                                    item.position === 'AMB_NURSE' ? ' Медсестра скорой' :
                                    item.position === 'AMB_DRIVER' ? ' Водитель скорой' :
                                    item.position === 'MAIN_DOC' ? ' Глав врач' :
                                    item.position === 'TER_DOC' ? ' Терапевт' :
                                    item.position === 'HIR_DOC' ? ' Хирург' :
                                    item.position === 'KARD_DOC' ? ' Кардиолог' :
                                    item.position === 'NEVR_DOC' ? ' Невролог' :
                                    item.position === 'OKUL_DOC' ? ' Окулист' :
                                    item.position === 'LOR_DOC'? ' ЛОР' : ' Сотрудник лаборатории'
                                }
                            </div>
                        </div>
                        <div className="visHistoryItem_modal__content">
                            <div className="visHistoryItem_modal__subtitle">Выписанные медикаменты</div>
                            {
                                pharma.length !== 0 ?
                                    <>
                                    <ul className={"visHistoryItem_list"}>
                                        {
                                            pharma.map((item, index) => {
                                                return <li className={"visHistoryItem_modal__field"} key={index}>{index + 1}. {item.name} - {item.total_price / item.cost} шт.</li>
                                            })
                                        }
                                    </ul>
                                        <div className="visHistoryItem_modal__price">
                                            Общая стоимость:
                                            { " " +
                                                pharma.reduce((sum, current) => {
                                                    return sum + current.total_price;
                                                }, 0) + " "
                                            } ₽
                                        </div>
                                        <div className={"visHistoryItem_modal__status"}>
                                            Статус: { <span className={ pharma[0].ispaid ? "green_status" : "red_status" }>{pharma[0].ispaid ? 'Оплачено' : 'Не оплачено'}</span> }
                                        </div>
                                    </>
                                    :
                                    <div className={"visHistoryItem_modal__field red_status"}>Медикаменты выписаны не были...</div>
                            }
                        </div>
                        <div className="visHistoryItem_modal__content">
                            <div className="visHistoryItem_modal__subtitle">Выписанные направления на исследования</div>
                            {
                                analysis.length !== 0 ?
                                    <ul>
                                        {
                                            analysis.map((item, index) => {
                                                return <li className={"visHistoryItem_modal__field"} key={index}>{index + 1}. {item.type}. Статус: {item.res_an != null && item.res_an !== '' ? <span className={"green_status"}>выполнен</span> : <span className={"red_status"}>не выполнен</span>}</li>
                                            })
                                        }
                                    </ul>
                                    :
                                    <div className={"visHistoryItem_modal__field red_status"}>Направления не исследования выписаны не были...</div>
                            }
                        </div>
                        <button
                            className={"standard_btn visHistoryItem_modal__btn"}
                            type={"submit"}
                            onClick={() => setModalActive(false)}>Закрыть</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}