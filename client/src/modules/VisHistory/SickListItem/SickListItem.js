import './SickListItem.css';
import {useState} from "react";
import {RecordModal} from "../../DocRecords/RecordModal/RecordModal";
import {useHttp} from "../../../hooks/httpHook";

export const SickListItem = ({ item, patId }) => {
    const [ modalActive, setModalActive ] = useState(false);
    const [ visits, setVisits ] = useState([]);

    const { loading, request } = useHttp();

    const fetchVisits = async () => {
        const fetched = await request(`/api/patients/sickVisits/${item.sick_list_id}`, 'GET');
        setVisits(fetched);
    }

    const showModal = async () => {
        await fetchVisits();
        setModalActive(true);
    }

    return (
        <div className={"sickListItem"}>
            <div className="sickListItem_container">
                <div className="sickListItem_header">Больничный лист</div>
                <div className={"sickListItem_content"}>
                    <div className="sickListItem_content__field">Дата открытия больничного: { new Date(Date.parse(item.start_date)).toLocaleDateString() }</div>
                    <div className="sickListItem_content__field">Дата закрытия больничного: { item.isclosed !== false ? new Date(Date.parse(item.end_date)).toLocaleDateString() : <span className={"red_status"}>отсутствует</span> }</div>
                </div>
                    <button
                        type={"submit"}
                        onClick={showModal}
                        className={"standard_btn sickListItem_button"}>Подробнее</button>
            </div>
            <RecordModal active={modalActive} setActive={setModalActive}>
                <div className="sickListItem_modal">
                    <div className="sickListItem_modal__container">
                        <div className="sickListItem_modal__title">Визиты медицинской организации в период болезни</div>
                        <div className="sickListItem_modal__content">
                            {
                                visits.map((item, index) => {
                                    return <SickListVisItem sickList={item} vis={item} />
                                })
                            }
                        </div>
                        <button
                            type={"submit"}
                            onClick={() => setModalActive(false)}
                            className={"standard_btn sickListItem_main__btn"}>Закрыть</button>
                    </div>
                </div>
            </RecordModal>
        </div>
    );
}

export const SickListVisItem = ({ vis, sickList }) => {
    const { loading, request } = useHttp();

    const [ pharma, setPharma ] = useState([]);
    const [ analysis, setAnalysis ] = useState([]);

    const [ isShowMore, setIsShowMore ] = useState(false);

    const fetchPharma = async () => {
        const fetched = await request(`/api/pharmacy/byId/${vis.vis_id}`);
        setPharma(fetched);
    }
    const fetchAnalysis = async () => {
        const fetched = await request(`/api/analysis/records/byId/${vis.vis_id}`);
        setAnalysis(fetched);
    }

    const openShowMore = async () => {
        await fetchPharma();
        await fetchAnalysis();
        setIsShowMore(true);
    }


    return (
        <div className={"sickListVisItem"}>
            <div className="sickListVisItem_container">
                <div className="sickListVisItem_title">Идентификатор визита №{vis.vis_id}</div>
                <div className="sickListVisItem_content">
                    <div className="SickListVisItem_content__field">Специалист, проводивший приём: {vis.l_name + " " + vis.f_name + " " + vis.m_name}</div>
                    <div className="SickListVisItem_content__field">
                        Специализация врача:
                        {
                            vis.position === 'AMB_DOC' ? ' Врач скорой' :
                            vis.position === 'AMB_NURSE' ? ' Медсестра скорой' :
                            vis.position === 'AMB_DRIVER' ? ' Водитель скорой' :
                            vis.position === 'MAIN_DOC' ? ' Глав врач' :
                            vis.position === 'TER_DOC' ? ' Терапевт' :
                            vis.position === 'HIR_DOC' ? ' Хирург' :
                            vis.position === 'KARD_DOC' ? ' Кардиолог' :
                            vis.position === 'NEVR_DOC' ? ' Невролог' :
                            vis.position === 'OKUL_DOC' ? ' Окулист' :
                            vis.position === 'LOR_DOC'? ' ЛОР' : ' Сотрудник лаборатории'
                        }
                    </div>
                    <div className="SickListVisItem_content__field">Дата и время приема: { new Date(Date.parse(vis.start_date)).toLocaleString().slice(0, -3) }</div>
                    {
                        vis.result != null ?
                            <>
                                <div className="SickListVisItem_content__field">Причина и цели визита: {vis.target}</div>
                                <div className="SickListVisItem_content__field">Результат встречи: {vis.result}</div>
                            </>
                            :  <div className="SickListVisItem_content__field red_status">Встреча ещё не состоялась</div>
                    }
                </div>
                {
                    isShowMore ?
                        <>
                           <div className={"sickListVisItem_content"}>
                               <div className="sickListVisItem_content__subtitle">Выписанные препараты:</div>
                               {
                                   pharma.length !== 0 ?
                                       <>
                                           <ul className={"sickListVisItem_content__list"}>
                                               {
                                                   pharma.map((item, index) => {
                                                       return <li key={index}>{index + 1}. {item.name} - {item.total_price / item.cost} шт.</li>
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
                                               Статус: { <span className={ vis[0] != undefined && vis[0].ispaid ? "green_status" : "red_status" }>{vis[0] != undefined && vis[0].ispaid ? 'Оплачено' : 'Не оплачено'}</span> }
                                           </div>
                                       </>
                                   : <div className={"SickListVisItem_content__info red_status"}>В ходе встречи препараты выписаны не были...</div>
                               }
                           </div>
                            <div className={"sickListVisItem_content"}>
                                <div className="sickListVisItem_content__subtitle">Направления на исследования:</div>
                                {
                                    analysis.length !== 0 ?
                                        analysis.map(item => {
                                            return(
                                                <div className={"sickListVisItem_content__item"}>
                                                    <div className="SickListVisItem_content__info">Вид исследования: {item.type}</div>
                                                    <div className="SickListVisItem_content__info">Статус: {item.res_an != null ? <span className={"green_status"}>Выполнено</span> : <span className={"red_status"}>Не выполнено</span>}</div>
                                                    { item.res_an == null ? '' : <div className="SickListVisItem_content__info">Результат исследования: {item.res_an}</div> }
                                                </div>
                                            )
                                        })
                                        :<div className={"SickListVisItem_content__info red_status"}>В ходе встречи направления на исследования выписаны не были...</div>

                                }
                            </div>
                       </>

                    : ''
                }
                {
                    vis.result != null ?
                        <button
                            type={"submit"}
                            onClick={openShowMore}
                            disabled={ loading }
                            className={ isShowMore ? "hide_btn" : "standard_btn sickListVisItem_btn" }>Посмотреть подробнее</button>
                        : ''
                }
            </div>
        </div>
    );
}