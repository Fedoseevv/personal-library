import './AddVacRecord.css';
import {useHttp} from "../../../hooks/httpHook";
import {useHistory} from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
import {StaffCard} from "../../../components/StaffCard/StaffCard";
import {PatientCard} from "../PatientCard/PatientCard";
import {VacCard} from "../VacCard/VacCard";

export const AddVacRecord = () => {
    const { loading, request } = useHttp();
    const history = useHistory();
    const [ patients, setPatients ] = useState([]);
    const [ vacs, setVacs ] = useState([]);

    const [ curPat, setCurPat ] = useState({});
    const [ curVac, setCurVac ] = useState({});

    const fetchData = useCallback(async () => {
        const f_patients = await request('/api/patients', 'GET');
        setPatients(f_patients);
        // setCurPat(patients[0]);
        const f_vacs = await request('/api/vac');
        setVacs(f_vacs);
        // setCurVac(vacs[0]);
    }, [ request ]);

    const addVacRec = async () => {
        const body = {
            user_id: curPat.user_id,
            vac_name: curVac.vac_name
        }
        console.log(body)
        await request('/api/vac/addVacRec', 'POST', body)
            .then(response => {
                history.push('/')
            })
    }

    useEffect(async () => {
        await fetchData();
    }, [ fetchData ]);

    if (loading) {
        return <h1>Loading...</h1>
    }

    const onChangeHandler = e => {
        console.log(e.target.name);
        if (e.target.name === 'patient') {
            const curPat = patients.filter(item => item.user_id === e.target.value);
            setCurPat(curPat[0]);
            console.log(curPat)
        } else if (e.target.name === 'vac') {
            const cur = vacs.filter(item => item.vac_name === e.target.value);
            setCurVac(cur[0]);
            console.log(curVac)
        }
    }

    return (
        <div className={"addVacRec"}>
            <h1 className="addVacRec_title">Добавление данных о вакцинации</h1>
            <div className="addVacRec_container">
                <div className="addVacRec_form">
                    <div className="addVac_item__wrap">
                        <div className="addVacRec_subtitle">Выберите пациента</div>
                        <div className="addVac_item">
                            <select onChange={onChangeHandler} name={"patient"} id={"patient"} >
                                {
                                    patients.map(patient => {
                                        return <option value={patient.user_id}>{patient.l_name + " " + patient.f_name + " " + patient.m_name}</option>
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    <PatientCard pat={curPat}/>
                </div>
                <div className="addVacRec_form">
                    <div className="addVac_item__wrap">
                        <div className="addVacRec_subtitle">Выберите вакцину</div>
                        <div className="addVac_item">
                            <select onChange={onChangeHandler} name={"vac"} id={"vac"} >
                                {
                                    vacs.map(vac => {
                                        return <option value={vac.vac_name}>{vac.vac_name}</option>
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    <VacCard vac={curVac}/>
                </div>
            </div>
            <div className={"addVacRec_btns"}>
                <button
                    onClick={addVacRec}
                    disabled={!curVac.hasOwnProperty('vac_name') || !curPat.hasOwnProperty('user_id')}
                    type={"submit"}
                    className={"standard_btn addVacRec_btn"}>Добавить запись</button>
                <button
                    type={"submit"}
                    onClick={() => history.push('/vacList')}
                    className={"standard_btn addVacRec_btn"}>Назад</button>
            </div>
        </div>
    );
}