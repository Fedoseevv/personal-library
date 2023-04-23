import './AddPatientRecord.css';
import {useHttp} from "../../../hooks/httpHook";
import {useCallback, useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {ScheduleCard} from "../ScheduleCard/ScheduleCard";

export const AddPatientRecord = () => {
    const storage = JSON.parse(localStorage.getItem('userData'));
    const { loading, request } = useHttp();
    const [ docs, setDocs ] = useState([]);
    const [ schedule, setSchedule ] = useState([]);
    const [ curRec, setCurRec ] = useState({});


    const [ curDoc, setCurDoc ] = useState({});

    const changeVis = e => {
        setCurRec(e.target.value);
    }

    const setBusyRecord = async () => {
        const body = {
            vis_id: curRec,
            pat_id: storage.userId
        }
        const fetched = await request('/api/staff/schedule/setBusy', 'POST', body)
            .then(response => {
                history.push('/patRecords')
            })
    }


    const history = useHistory();

    const dict = {
        "TER_DOC": "Терапевт",
        "HIR_DOC": "Хирург",
        "KARD_DOC": "Кардиолог",
        "NEVR_DOC": "Невролог",
        "OKUL_DOC": "Окулист",
        "LOR_DOC": "ЛОР"
    }

    const fetchDocs = useCallback(async () => {
        const fetched = await request('/api/staff/onlyDocs', 'GET');
        setDocs(fetched);
    }, [ request ]);

    const onChangeHandler = e => {
        const cur = docs.filter(item => item.user_id === e.target.value);
        setCurDoc(cur[0]);
    }


    useEffect(async () => {
        await fetchDocs();
    }, [fetchDocs]);


    if (loading) {
        return <h1>Loading...</h1>
    }
    return (
        <div className={"addVisit"}>
            <div className="addVisit_container">
                <h1 className="addVisit_title">Запись на прием к врачу</h1>
                <div className="addVisit_docs__wrap">
                    <div className="addVisit_docs__title">Выберите специалиста</div>
                    <select onChange={onChangeHandler} className={"addVisit_docs__item"} name="doc" id="doc">
                        {
                            docs.map(item => {
                                return <option value={item.user_id} key={item.user_id}>
                                    {item.l_name + " " + item.f_name + " " + item.m_name + " - " + dict[item.position]}
                                </option>
                            })
                        }
                    </select>
                </div>
                <div className="addVisit_docs__title">Выберите удобное время</div>
                <ScheduleCard changeVis={changeVis}  doc={curDoc}/>
            </div>
            <div className="visits_btns">
                <button
                    type={"submit"}
                    onClick={setBusyRecord}
                    className={"standard_btn visits_list__btn"}>Записаться</button>
                <button
                    type={"submit"}
                    onClick={() => history.push('/patRecords')}
                    className={"standard_btn visits_list__btn"}>Назад</button>
            </div>
        </div>
    );
}