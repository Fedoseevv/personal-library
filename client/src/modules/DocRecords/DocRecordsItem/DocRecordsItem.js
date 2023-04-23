import {useCallback, useEffect, useState} from "react";

import './DocRecordsItem.css';
import {useHttp} from "../../../hooks/httpHook";
import {useHistory} from "react-router-dom";
import {RecordModal} from "../RecordModal/RecordModal";
import {useInput} from "../../../hooks/validationHook";
import {changeDate} from "../../../helpfulFunctions/validationFunctions";
import {v4 as uuidv4} from "uuid";

export const DocRecordsItem = ({ vis }) => {
    const { loading, request } = useHttp();
    const history = useHistory();

    const target = useInput('', { isEmpty: true });
    const res = useInput('', { isEmpty: true });

    const [ pharma, setPharma ] = useState([]);
    const [ curPharma, setCurPharma ] = useState([]);

    const [ docVis, setDocVis  ] = useState([]);
    const fetchDocSchedule = async () => {
        const fetched = await request(`/api/staff/schedule/${vis.doc_id}`, 'GET');
        setDocVis(fetched)
    }
    const [ curVis, setCurVis ] = useState({});
    const updateCurVis = e => {
        const item = docVis.filter(item => item.vis_id == curVis)[0];
        setCurVis(item);
    }
    const deleteFutVis = () => {
        setCurVis({});
    }

    const [ openedSickList, setOpenedSickList ] = useState({});
    const fetchOpenedSickList = useCallback(async () => {
        const fetched = await request(`/api/visits/openedSickList/${vis.vis_id}`, 'GET');
        setOpenedSickList(fetched);
    }, [ request ]);
    useEffect(async () => {
        await fetchOpenedSickList();
    }, [ fetchOpenedSickList ]);

    const [ bedFund, setBedFund ] = useState([{
        id: null,
        num_bed: 'home',
        room_number: 'home',
        pat_id: null,
        canused: true
    }]);

    const [ analysis, setAnalysis ] = useState([]);
    const [ curAnalysis, setCurAnalysis ] = useState([]);

    const [ modalActive, setModalActive ] = useState(false);
    const [ visit, setVisits ] = useState({
        ...vis
    });

    const sickListDate = useInput('', { isEmpty: true, isDate: true });
    const [ sickList, setSickList ] = useState({
        position: 'home',
        date: '',
        isConfirm: false
    });
    const [ showSickList, setShowSickList ] = useState(false);
    const changeSickList = e => {
        const item = bedFund.filter(item => item.id == e.target.value)[0];
        console.log('item')
        console.log(item);
        setSickList({
            ...sickList,
            ...item,
            date: sickListDate.value,
            position: e.target.value
        })
        console.log(sickList)
    }
    const confirmSickList = () => {
        setShowSickList(false)
        setSickList({
            ...sickList,
            date: sickListDate.value,
            isConfirm: true
        })
        console.log(sickList)
    }
    const cancelSickList = () => {
        setSickList({
            date: '',
            position: '',
            isConfirm: false
        })
    }

    const fetchBedFund = async () => {
        const fetched = await request('/api/bedFund/free', 'GET');
        setBedFund([...bedFund, ...fetched]);
    }

    const fetchAnalysis = async () => {
        const fetched = await request('/api/analysis/types', 'GET');
        setAnalysis(fetched);
    }
    const addAnalysisItem = async () => {
        await fetchAnalysis();
    }
    const [ analyzeForm, setAnalyzeForm ] = useState({});
    const changeAnalyzeHandler = event => {
        console.log(`${event.target.name}: ${event.target.value}`);
        const item = analysis.filter(item => item.type === event.target.value)[0]
        console.log(item)
        setAnalyzeForm({ ...item })
    }
    const addAnalyze = () => {
        console.log(curAnalysis)
        setCurAnalysis((prevState => [...prevState, analyzeForm]));
    }
    const deleteAnalyzeItem = e => {
        setCurAnalysis((prevState => [...prevState.slice(0, e.target.value), ...prevState.slice(e.target.value + 1)]))
    }

    const addSickList = async () => {
        await fetchBedFund();
        setShowSickList(true)
    }

    const fetchPharma = async () => {
        const fetched = await request('/api/pharmacy/all', 'GET');
        setPharma(fetched);
    }
    const [ pharmaForm, setPharmaForm ] = useState({});
    const changeHandler = event => {
        console.log(`${event.target.name}: ${event.target.value}`);
        console.log(event.target.value);
        setPharmaForm({ ...pharmaForm, [event.target.name]: event.target.value })
    }
    const addPharma = () => {
        console.log('pharmaForm')
        console.log(pharmaForm);
        const item = pharma.filter(item => item.id === pharmaForm.pharma_id)[0]
        item.buyCount = pharmaForm.count;
        console.log('item')
        console.log(item)
        setCurPharma((prevState => [...prevState, item]));
        console.log(curPharma);
    }
    const deletePharmaItem = e => {
        console.log(e.target.value);
        setCurPharma((prevState => [...prevState.slice(0, e.target.value), ...prevState.slice(e.target.value + 1)]))
    }

    const prepareSaveVisit = async () => {
        const analysis_ref = curAnalysis.map(item => {
            return item.id
        });
        // console.log(analysis_ref);
        // vis_id, target, result --- end_date, took_place --- analysis_ref, user_id --- pharmacy_fk, buyCount, total_price
        const body = {
            vis_id: vis.vis_id,
            target: target.value,
            result: res.value,

            sick_list_id: sickList.isConfirm ?  uuidv4() : openedSickList[0].sick_list_id || null,
            end_date: sickList.date,
            took_place: sickList.position,

            analysis_ref: analysis_ref,
            user_id: vis.pat_id,

            pharmacy: curPharma, // pharmacy_fk, buyCount, total_price считаем на сервере

            futVis: curVis.vis_id || null
        }
        console.log(body);
        const fetched = await request('/api/visits/fillVisit', 'POST', body);
        setModalActive(false);

    }

    return (
        <div className={"docRecord"}>
            <div className="docRecord_container">
                <div className="docRecord_title">Информация о приеме</div>
                <div className="docRecord_items">
                    <div className="docRecord_item">Дата и время: <span>{new Date(Date.parse(visit.start_date)).toLocaleDateString() + " " + new Date(Date.parse(visit.start_date)).toLocaleTimeString().slice(0, -3)}</span></div>
                </div>
                <div className="docRecord_items">
                    <div className="docRecord_title">Информация о пациенте</div>
                    <div className="docRecord_item">ФИО: <span>{visit.l_name} {visit.f_name} {visit.m_name}</span></div>
                    <div className="docRecord_item">Дата Рождения: <span>{new Date(Date.parse(visit.birth_date)).toLocaleDateString()}</span></div>
                    <div className="docRecord_item">Номер телефона: <span>{visit.phone_number}</span></div>
                    <div className="docRecord_item">Полис ОМС: <span>{visit.oms_num}</span></div>
                    <div className="docRecord_item">Паспорт РФ: <span>{visit.pass_num}</span></div>
                    <div className="docRecord_item">СНИЛС: <span>{visit.snils}</span></div>
                </div>
                <div className="docRecord_btns">
                    <button
                        type={"submit"}
                        onClick={() => setModalActive(true)}
                        className={ (!!vis.result) ? "standard_btn docRecord_btn hide_btn" : "standard_btn docRecord_btn"}>Заполнить карточку приема</button>
                </div>
                <div className="docRecord_status">{(!!vis.result) ? <div>Статус: <span className={"green_status"}>Выполнен</span></div>: ''}</div>
            </div>
            <RecordModal active={modalActive} setActive={setModalActive}>
                <div className="docRecord_modal">
                    <div className="docRecord_modal__container">
                        <h1 className="docRecord_modal__title">Карточка приема</h1>
                        <div className="docRecord_modal__content">
                            <div className="docRecord_modal__subtitle">Информация о приеме</div>
                            <div className="docRecord_modal__items">
                                <div className="docRecord_modal__item">Дата и время: <span>{new Date(Date.parse(visit.start_date)).toLocaleDateString() + " " + new Date(Date.parse(visit.start_date)).toLocaleTimeString().slice(0, -3)}</span></div>
                            </div>

                            <div className="docRecord_modal__items">
                                <div className="docRecord_modal__subtitle">Информация о пациенте</div>
                                <div className="docRecord_modal__item">ФИО: <span>{visit.l_name} {visit.f_name} {visit.m_name}</span></div>
                                <div className="docRecord_modal__item">Дата Рождения: <span>{new Date(Date.parse(visit.birth_date)).toLocaleDateString()}</span></div>
                                <div className="docRecord_modal__item">Номер телефона: <span>{visit.phone_number}</span></div>
                                <div className="docRecord_modal__item">Полис ОМС: <span>{visit.oms_num}</span></div>
                                <div className="docRecord_modal__item">Паспорт РФ: <span>{visit.pass_num}</span></div>
                                <div className="docRecord_modal__item">СНИЛС: <span>{visit.snils}</span></div>
                            </div>

                            <div className="docRecord_modal__items">
                                <div className="docRecord_modal__subtitle">Укажите следующие данные для формирования отчетности</div>
                                <div className={"standard_input__wrap"}>
                                    {(target.isDirty && target.isEmpty)
                                        && <div className="incorrect_value">Поле не может быть пустым</div>}
                                    <input
                                        placeholder={"Укажите причину визита и жалобы пациента"}
                                        value={target.value}
                                        onBlur={e => target.onBlur(e)}
                                        onChange={e => target.onChange(e)}
                                        type="text"/>
                                </div>
                                <div className={"standard_input__wrap"}>
                                    {(res.isDirty && res.isEmpty)
                                        && <div className="incorrect_value">Поле не может быть пустым</div>}
                                    <input
                                        placeholder={"Укажите результат встречи. Назначения и дальнейшее лечение (в случае требования)"}
                                        value={res.value}
                                        onBlur={e => res.onBlur(e)}
                                        onChange={e => res.onChange(e)}
                                        type="text"/>
                                </div>
                            </div>

                            {
                                curPharma.length !== 0 ?
                                <div className="docRecord_modal__pharma">
                                    <div className={"docRecord_modal__subtitle"}>Выписанные препараты</div>
                                        <ul onClick={deletePharmaItem} className={"docRecord_pharma__list pharma_list"}>
                                            {
                                                curPharma.map((item, index) => {
                                                    return <li
                                                            className={"pharma_list__item"}
                                                            value={index}
                                                            key={index}
                                                                >{index + 1}. {item.name} - {item.buyCount} шт.</li>
                                                })
                                            }
                                        </ul>
                                </div>
                                : ''
                            }

                            {
                                pharma.length === 0 ? '' :
                                    <div className="docRecord_modal__pharma">
                                        <div className={"docRecord_modal__subtitle"}>Добавление препарата</div>
                                        <div className="docRecord_modal__wrap">
                                            <select
                                                className={"docRecord_modal__select"}
                                                onClick={changeHandler}
                                                name="pharma_id" id="pharma_id">
                                                {pharma.map((item, index) => {
                                                    return (
                                                        <option key={item.id} value={item.id} name={item.name}>
                                                            {item.name} - всего {item.count} шт.
                                                        </option>
                                                    )
                                                })}
                                            </select>
                                            <div className={"standard_input__wrap docRecord_input__modal"}>
                                                <input
                                                    placeholder={"Введите количество (шт.)"}
                                                    name={"count"}
                                                    onChange={changeHandler}
                                                    type="text"/>
                                            </div>
                                        </div>
                                        <button
                                            className={"standard_btn"}
                                            onClick={addPharma}
                                            type={"submit"}>Добавить</button>
                                    </div>
                            }

                            {
                                sickList.isConfirm ?
                                <div className="docRecord_modal__pharma">
                                    <div onClick={cancelSickList} className={"docRecord_modal__subtitle modal_subtitle__sick"}>
                                        Открыт новый больничный лист
                                    </div>
                                        <div className="docRecord_modal__items">
                                            <div className="docRecord_modal__item">Место проведения лечения: <span>{sickList.position === 'home' ? 'Лечение на дому' : `Койко-место №${sickList.position}`}</span></div>
                                            <div className="docRecord_modal__item">Дата окончания больничного: <span>{new Date(Date.parse(sickList.date)).toLocaleDateString()}</span></div>
                                        </div>
                                </div>
                                    : ''
                            }

                            {
                                openedSickList.length !== 0 ?
                                    <div className={"openedSickList"}>
                                        <div className={"docRecord_modal__subtitle"}>Открытый больничный</div>
                                        <div className="openedSickList_content">
                                            <div className="openedSickList_content__item">Предварительная дата закрытия больничного: {(!!openedSickList[0]) ? new Date(Date.parse(openedSickList[0].end_date)).toLocaleDateString() : '' }</div>
                                        </div>
                                    </div>


                                : ''
                            }

                            {
                                !showSickList ? '' :
                                    <div className="docRecord_modal__pharma">
                                        <div className={"docRecord_modal__subtitle"}>Больничный лист</div>
                                        <div className="docRecord_modal__wrap">
                                            <select
                                                className={"docRecord_modal__select"}
                                                onChange={changeSickList}
                                                name="bedFund" id="bedFund">
                                                {
                                                    bedFund.map(item => {
                                                        return item.room_number !== 'home' ?
                                                            <option value={item.id}>Палата №{item.room_number} - койкоместо №{item.num_bed}</option>
                                                            : <option value={"home"}>Лечение на дому</option>
                                                    })
                                                }
                                            </select>
                                            <div className={"standard_input__wrap docRecord_input__modal"}>
                                                {(sickListDate.isDirty && sickListDate.dateError)
                                                    &&  <div className="incorrect_value incorrect_value__recModal">
                                                            Необходимо указать дату
                                                        </div>}
                                                <input
                                                    value={sickListDate.value}
                                                    onBlur={e => sickListDate.onBlur(e)}
                                                    onChange={e => sickListDate.onChange(e)}
                                                    onInput={e => changeDate(e)}
                                                    placeholder={"Введите дату окончания больничного"} type="text"/>
                                            </div>
                                        </div>
                                        <button
                                            className={"standard_btn"}
                                            onClick={confirmSickList}
                                            type={"submit"}>Подтвердить</button>
                                    </div>

                            }

                            {
                                curAnalysis.length !== 0 ?
                                    <div className="docRecord_modal__pharma">
                                        <div className={"docRecord_modal__subtitle"}>Направления на анализы</div>
                                        <ul onClick={deleteAnalyzeItem} className={"docRecord_pharma__list pharma_list"}>
                                            {
                                                curAnalysis.map((item, index) => {
                                                    return <li
                                                        className={"pharma_list__item"}
                                                        value={index}
                                                        key={index}
                                                    >{index + 1}. {item.type}</li>
                                                })
                                            }
                                        </ul>
                                    </div>
                                : ''
                            }

                            {
                                analysis.length !== 0 ?
                                    <div className={"docRecord_modal__analysis"}>
                                        <div className="docRecord_modal__subtitle">Выберите тип исследования</div>
                                        <div className="docRecord_modal__wrap">
                                            <select
                                                className={"modal_select"}
                                                onClick={changeAnalyzeHandler}
                                                name="analysis" id="analysis">
                                                {
                                                    analysis.map(item => {
                                                        return <option value={item.type}>{item.type}</option>
                                                    })
                                                }
                                            </select>
                                        </div>
                                        <div className="docRecord_modal__btns">
                                            <button
                                                className={"standard_btn"}
                                                onClick={addAnalyze}
                                                type={"submit"}>Добавить</button>
                                        </div>
                                    </div>
                                    : ''
                            }

                            {
                                curVis.hasOwnProperty('vis_id') ?
                                    <div className={"docRecord_modal__analysis"}>
                                        <div className={"docRecord_modal__subtitle"}>Назначенная запись</div>
                                        <div onClick={deleteFutVis} className={"docRecord_modal__visit"}>
                                            {
                                                new Date(Date.parse(curVis.start_date)).toLocaleDateString() + " " + new Date(Date.parse(curVis.start_date)).toLocaleTimeString().slice(0, -3)
                                            }
                                        </div>
                                    </div>

                                    : ''
                            }

                            {
                                docVis.length !== 0 && !curVis.hasOwnProperty('vis_id')  ?
                                    <div className={"docRecord_modal__analysis"}>
                                        <div className="docRecord_modal__subtitle">Выберите дату приема</div>
                                        <div className="docRecord_modal__wrap">
                                            <select
                                                className={"modal_select"}
                                                onClick={e => setCurVis(e.target.value)}
                                                name="docSchedule" id="docSchedule">
                                                {
                                                    docVis.map(item => {
                                                        return <option value={item.vis_id}>
                                                            {new Date(Date.parse(item.start_date)).toLocaleDateString() + " " + new Date(Date.parse(item.start_date)).toLocaleTimeString().slice(0, -3)}
                                                        </option>
                                                    })
                                                }
                                            </select>
                                        </div>
                                        <div className="docRecord_modal__btns">
                                            <button
                                                className={"standard_btn"}
                                                onClick={updateCurVis}
                                                type={"submit"}>Подтвердить запись</button>
                                        </div>
                                    </div>

                                : ''

                            }
                            <div className="docRecord_modal__btns">
                                <div className="docRecord_modal__subtitle">Выберите действие</div>
                                <div className="modal_btns__wrap">
                                    <button
                                        type={"submit"}
                                        onClick={addAnalysisItem}
                                        className={"standard_btn docRecord_modal__btn"}>Направление на анализы</button>
                                    <button
                                        type={"submit"}
                                        onClick={fetchPharma}
                                        className={"standard_btn docRecord_modal__btn"}>Выписать препараты</button>
                                    <button
                                        type={"submit"}
                                        onClick={addSickList}
                                        disabled={ sickList.isConfirm || openedSickList.length !== 0 }
                                        className={"standard_btn docRecord_modal__btn"}>Открыть больничный лист</button>
                                    <button
                                        type={"submit"}
                                        onClick={fetchDocSchedule}
                                        disabled={ docVis.length !== 0 }
                                        className={"standard_btn docRecord_modal__btn"}>Назначить следующий визит</button>
                                </div>
                            </div>
                            <button
                                className={"standard_btn"}
                                onClick={prepareSaveVisit}
                                disabled={ target.value.length === 0 || res.value.length === 0 }
                                type={"submit"}>Сохранить</button>
                        </div>
                    </div>
                </div>
            </RecordModal>
        </div>
    );
}
