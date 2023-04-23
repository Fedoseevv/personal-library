import './FindPatientPage.css'
import {useCallback, useEffect, useState} from "react";
import {changePass, changeSnils, stopInput} from "../../helpfulFunctions/validationFunctions";
import {useInput} from "../../hooks/validationHook";
import {useHttp} from "../../hooks/httpHook";
import {Link, useHistory} from "react-router-dom";
import './InformationWindow.css'
import {DocRecordsItem} from "../../modules/DocRecords/DocRecordsItem/DocRecordsItem";
import {Modal} from "../../components/modal/Modal";
import {RecordModal} from "../../modules/DocRecords/RecordModal/RecordModal";

export const FindPatientPage = () => {
    const [field, setField] = useState('oms');

    const [ patient, setPatient ] = useState({});

    const onChangeHandler = e => {
        setField(e.target.value);
    }

    return (
        <div className={"findPatient"}>
            <div className="findPatient_container">
                <div className="findPatient__title">Поиск пациента</div>
                <div className="findPatient_form">
                    <div className="findPatient_form__subtitle">Укажите критерий для поиска</div>
                    <select onChange={onChangeHandler} className={"auth_form__role findField"} name="field" id="field">
                        <option value="oms">Полис ОМС</option>
                        <option value="snils">СНИЛС</option>
                        <option value="pass_num">Паспорт РФ</option>
                    </select>
                </div>
                {<RenderTargetField
                    name={field}
                    patient={patient}
                    setPatient={setPatient}/>}
            </div>
            { patient.hasOwnProperty('user_id') ? <RenderVisits patient={patient}/> : '' }
        </div>
    );
}

const RenderTargetField = ({name, patient, setPatient}) => {
    const omsNum = useInput('', {isEmpty: true, minLength: 16, maxlength: 16});
    const passNum = useInput('', {isEmpty: true, isPass: true, minLength: 16});
    const snils = useInput('', {isEmpty: true, isSnils: true});
    const history = useHistory()
    const { loading, request } = useHttp();


    const sendData = async e => {
        console.log(e.target.value)
        setPatient({});
        console.log(passNum.value)
        let target = ''
        const body = (e.target.value === 'pass_num') ?
            { pass_num: passNum.value } :
            (e.target.value === 'oms_num') ? {oms_num: omsNum.value} : {snils: snils.value}
        console.log(body)
        if (body.hasOwnProperty('pass_num')) {
            target = 'byPass'
        } else if (body.hasOwnProperty('oms_num')) {
            target = 'byOMS'
        } else {
            target = 'bySnils'
        }
        const data = await request(`/api/patients/${target}`, 'POST', body)
            .then(patient => {
                setPatient(patient);
            })
    }

    if (name === 'oms') {
        return (
            <>
                <div className="standard_input__wrap findPatient_input">
                    {(omsNum.isDirty && omsNum.minLengthError)
                        && <div className="incorrect_value">Длина номера полиса 16 символов</div>}
                    <input
                        placeholder="Введите номер полиса ОМС"
                        id="oms_num"
                        type="text"
                        name="oms_num"
                        value={omsNum.value}
                        onChange={e => omsNum.onChange(e)}
                        onBlur={e => omsNum.onBlur(e)}
                        onInput={e => stopInput(e, 16)}
                    />
                </div>
                <button onClick={sendData} value={"oms_num"} className="standard_btn" type="submit">
                    Найти
                </button>
                <InformationWindow loading={loading} patient={patient}/>
            </>
    );
    } else if (name === 'pass_num') {
        return (
            <>
                <div className="standard_input__wrap findPatient_input">
                    {(passNum.isDirty && passNum.passError)
                        && <div className="incorrect_value">Некорректные паспортные данные</div>}
                    <input
                        placeholder="Введите серию и номер паспорта"
                        id="pass_num"
                        type="text"
                        name="pass_num"
                        value={passNum.value}
                        onChange={e => passNum.onChange(e)}
                        onBlur={e => passNum.onBlur(e)}
                        onInput={e => changePass(e)}/>
                </div>
                <button value={"pass_num"} onClick={sendData} className="standard_btn" type="submit">
                    Найти
                </button>
                <InformationWindow loading={loading} patient={patient}/>
            </>
    );
    } else {
        return (
            <>
                <div className="standard_input__wrap findPatient_input">
                    {(snils.isDirty && snils.snilsError)
                        && <div className="incorrect_value">Некорректный номер СНИЛС</div>}
                    <input
                        placeholder="Введите номер СНИЛС"
                        id="snils"
                        type="text"
                        name="snils"
                        value={snils.value}
                        onChange={e => snils.onChange(e)}
                        onBlur={e => snils.onBlur(e)}
                        onInput={e => changeSnils(e)}/>
                </div>
                <button value={"snils"} onClick={sendData} className="standard_btn" type="submit">
                    Найти
                </button>
                <InformationWindow loading={loading} patient={patient}/>
            </>

    );
    }
}
const InformationWindow = ({ patient, loading }) => {
    return (
        <>
            {loading ? <h1>Loading...</h1> : ''}
            {patient.hasOwnProperty('user_id') ? <div className={"informationWindow"}>
                <div className="informationWindow_container">
                    <h1 className="informationWindow_title">Информация о пациенте</h1>
                    <div className="informationWindow_form">
                        <div className="informationWindow_form__item">Идентификатор: <span>{patient.user_id}</span></div>
                        <div className="informationWindow_form__item">Имя: <span>{patient.f_name}</span></div>
                        <div className="informationWindow_form__item">Отчество: <span>{patient.m_name}</span></div>
                        <div className="informationWindow_form__item">Фамилия: <span>{patient.l_name}</span></div>
                        <div className="informationWindow_form__item">Номер телефона: <span>{patient.phone_number}</span></div>
                        <div className="informationWindow_form__item">Дата рождения: <span>{new Date(Date.parse(patient.birth_date)).toLocaleDateString()}</span></div>
                        <div className="informationWindow_form__item">Адрес: <span>{patient.address}</span></div>
                        <div className="informationWindow_form__item">Номер полиса ОМС: <span>{patient.oms_num}</span></div>
                        <div className="informationWindow_form__item">Серия и номер паспорта: <span>{patient.pass_num}</span></div>
                        <div className="informationWindow_form__item">СНИЛС: <span>{patient.snils}</span></div>
                    </div>
                </div>
            </div> : ''}
        </>
    );
}

const RenderVisits = ({ patient }) => {
    const docId = JSON.parse(localStorage.getItem('userData')).userId;
    const patId = patient.user_id;
    const { request, loading } = useHttp();

    const [ vis, setVis ] = useState([]);
    const fetchVisits = useCallback(async () => {
        const fetched = await request(`/api/staff/schedule/onlyBusy/${docId}`, 'GET');
        setVis(fetched)
    }, [ request ]);
    const byPatVis = () => {
        return vis.filter(item => item.pat_id === patId);
    }
    const onlyFutVis = () => { // Будущие встречи для конкретного пациента
        return byPatVis().filter(item => item.target == null);
    }

    const [ sickList, setSickList ] = useState([]);
    const fetchSickList = useCallback(async () => {
        const fetched = await request(`/api/patients/sickList/${patient.user_id}`, 'GET');
        setSickList(fetched);
    }, [ request ]);
    useEffect(async () => {
        await  fetchSickList();
    }, [ fetchVisits ]);

    useEffect(async () => {
        await fetchVisits()
    }, [ fetchVisits ]);

    const onCloseSickList = async () => {
        console.log(vis[0].sick_list_id);
        const body = {
            sick_list_id: vis[0].sick_list_id,
            bedNum: sickList[0].took_place || ''
        }
        console.log(body);
        const res = await request(`/api/visits/closeSick`, 'POST', body);
        await fetchVisits();
        await fetchSickList();
    }

    if (loading) {
        return <h1>Loading...</h1>
    }
    return (
        <div className={"patVisits"}>
            <div className="patVisits_container">
                <div className="patVisits_title">Назначенные записи пациента</div>
                {
                    onlyFutVis().length !== 0 ?
                        <div className="patVisits_content">
                            {
                                onlyFutVis().map(item => {
                                    return <DocRecordsItem vis={item} />
                                })
                            }
                        </div>
                        :
                        <div className={"patVisits_info__item"}>В данный момент пациент не записан к Вам на приём...</div>
                }
            </div>
            <div className="patVisits_container">
                <div className="patVisits_title">Открытый больничный лист пациента</div>
                {
                    sickList.length !== 0 ?
                        <>
                            <div className={"visitInfo_title"}>Список посещений</div>
                            <div className="sickList_content">
                                {
                                    <VisitInfo sickList={sickList}/>
                                }
                            </div>
                            <div className="patVisits_btns__wrap">
                                <button
                                    type={"submit"}
                                    onClick={onCloseSickList}
                                    className={"standard_btn patVisits_btn"}>Закрыть больничный лист</button>
                                <Link className={"patVisits_btn__link"} to={`visHistory/${patId}`}>
                                    <button
                                        type={"submit"}
                                        className={"standard_btn patVisits_btn"}>Посмотреть ЭМК пациента</button>
                                </Link>
                            </div>
                        </>
                        :
                        <>
                            <div className={"patVisits_info__item"}>В данный момент открытого больничного листа нет...</div>
                            <div className="patVisits_btns__wrap">
                                <Link to={`visHistory/${patId}`}>
                                    <button
                                        type={"submit"}
                                        className={"standard_btn patVisits_btn"}>Посмотреть ЭМК пациента</button>
                                </Link>
                            </div>
                        </>
                }
            </div>
        </div>
    );
}

const VisitInfo = ({ sickList }) => {
    return (
        <>
            {
                sickList.map((item, index) => {
                    return <VisitInfoItem key={index} item={item}/>
                })
            }
        </>
    );
}
export const VisitInfoItem = ({ item }) => {
    const [ modalActive, setModalActive ] = useState(false);
    const [ sickPos, setSickPos ] = useState({});
    const [ doc, setDoc ] = useState({});
    const [ pharma, setPharma ] = useState([]);
    const [ analysis, setAnalysis ] = useState([]);

    const { loading, request } = useHttp();

    const fetchSickPos = async () => {
        if (item.took_place != null) {
            const fetched = await request(`/api/bedFund/byId/${item.took_place}`);
            setSickPos(fetched);
        }
    }
    const fetchDoc = async () => {
        const fetched = await request(`/api/staff/byId/${item.doc_id}`);
        setDoc(fetched);
    }
    const fetchPharma = async () => {
        const fetched = await request(`/api/pharmacy/byId/${item.vis_id}`);
        setPharma(fetched);
    }
    const fetchAnalysis = async () => {
        const fetched = await request(`/api/analysis/records/byId/${item.vis_id}`);
        setAnalysis(fetched);
    }

    const showModal = async () => {
        await fetchSickPos();
        await fetchDoc();
        await fetchPharma();
        await fetchAnalysis();
        setModalActive(true);

    }

    return (
        <div className={"sickListItem"}>
            <div className="sickListItem_container">
                <div className="sickListItem_item">
                    <div className="sickListItem_title">Дата визита: {new Date(Date.parse(item.start_date)).toLocaleDateString() + " - " + new Date(Date.parse(item.start_date)).toLocaleTimeString().slice(0, -3)}</div>
                    <div className="sickListItem_content">
                        <div className="sickListItem_field">Статус записи: { item.result != null ? <span className={"green_status"}>Выполнен</span> : <span className={"red_status"}>Не выполнен</span> }</div>
                        {
                            item.result != null ?
                                <div className={"sickListItem_btns"}>
                                    <button
                                        className={"standard_btn sickListItem_btn"}
                                        onClick={showModal}
                                        type={"submit"}>Подробнее</button>
                                </div>

                                : <div className="sickListItem_field">Дополнительной информации не обнаружено</div>
                        }
                    </div>
                </div>
            </div>
            <RecordModal active={modalActive} setActive={setModalActive}>
                <div className={"sickListItem_modal"}>
                    <div className="sickListItem_modal__container">
                        <div className="sickListItem_modal__title">Информация о записи</div>
                        <div className="sickListItem_modal__content">
                            <div className="sickListItem_modal__subtitle">Общая информация</div>
                            <div className="sickListItem_modal__field">Причина визита: {item.target}</div>
                            <div className="sickListItem_modal__field">Комментарий специалиста, проводившего прием: {item.result}</div>
                            <div className="sickListItem_modal__field">Место проведения лечения: { sickPos.hasOwnProperty('room_number') ? "Палата №" + sickPos.room_number + " - койко-место №" + sickPos.num_bed : "Домашний адрес" }</div>
                            <div className="sickListItem_modal__field">ФИО специалиста, проводившего приём: { doc.l_name + " " + doc.f_name + " " + doc.m_name }</div>
                            <div className="sickListItem_modal__field">
                                Специальность сотрудника, проводившего приём:
                                {
                                    doc.position === 'AMB_DOC' ? ' Врач скорой' :
                                    doc.position === 'AMB_NURSE' ? ' Медсестра скорой' :
                                    doc.position === 'AMB_DRIVER' ? ' Водитель скорой' :
                                    doc.position === 'MAIN_DOC' ? ' Глав врач' :
                                    doc.position === 'TER_DOC' ? ' Терапевт' :
                                    doc.position === 'HIR_DOC' ? ' Хирург' :
                                    doc.position === 'KARD_DOC' ? ' Кардиолог' :
                                    doc.position === 'NEVR_DOC' ? ' Невролог' :
                                    doc.position === 'OKUL_DOC' ? ' Окулист' :
                                    doc.position === 'LOR_DOC'? ' ЛОР' : ' Сотрудник лаборатории'
                                }
                            </div>
                        </div>
                        <div className="sickListItem_modal__content">
                            <div className="sickListItem_modal__subtitle">Выписанные медикаменты</div>
                            {
                                pharma.length !== 0 ?
                                    <>
                                        <ul>
                                            {
                                                pharma.map((item, index) => {
                                                    return <li className={"sickListItem_modal__field"} key={index}>{index + 1}. {item.name} - {item.total_price / item.cost} шт.</li>
                                                })
                                            }
                                        </ul>
                                        <div className="sickListItem_modal__price">
                                            Общая стоимость:
                                            { " " +
                                                pharma.reduce((sum, current) => {
                                                    return sum + current.total_price;
                                                }, 0) + " "
                                            } ₽
                                        </div>
                                    </>
                                    : <div className={"patVisits_info__item red_status"}>Препараты выписаны не были...</div>
                            }
                        </div>
                        <div className="sickListItem_modal__content">
                            <div className="sickListItem_modal__subtitle">Выписанные направления на исследования</div>
                            {
                                analysis.length !== 0 ?
                                    <ul>
                                        {
                                            analysis.map((item, index) => {
                                                return <li className={"sickListItem_modal__field"} key={index}>{index + 1}. {item.type}. Статус: {item.res_an != null ? <span className={"green_status"}>выполнен</span> : <span className={"red_status"}>не выполнен</span>}</li>
                                            })
                                        }
                                    </ul>
                                    : <div className={"patVisits_info__item red_status"}>Направления на исследования выписаны не были...</div>
                            }
                        </div>
                    </div>
                    <div className="patVisits_info__btns">
                        <button
                            type={"submit"}
                            className={"standard_btn patVisits_info__btn"}
                            onClick={() => setModalActive(false)}>Закрыть</button>
                    </div>
                </div>
            </RecordModal>
        </div>
    );
}