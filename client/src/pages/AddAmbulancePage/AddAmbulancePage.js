import {useHistory} from "react-router-dom";
import {useHttp} from "../../hooks/httpHook";
import {useCallback, useEffect, useState} from "react";
import { v4 as uuidv4 } from 'uuid';

import './AddAmbulancePage.css';
import {StaffCard} from "../../components/StaffCard/StaffCard";

export const AddAmbulancePage = () => {
    const history = useHistory();

    const { request, loading } = useHttp();
    const [ docs, setDocs ] = useState([]);
    const [ drivers, setDrivers ] = useState([]);
    const [ nurses, setNurses ] = useState([]);

    const [ curDoc, setCurDoc ] = useState({});
    const [ curNurse, setCurNurse ] = useState({});
    const [ curDriver, setCurDriver ] = useState({});

    const fetchStaff = useCallback(async () => {
        const f_docs = await request(`/api/ambulance/staff/docs`, 'GET');
        setDocs(f_docs);
        const f_drivers = await request('/api/ambulance/staff/drivers', 'GET');
        setDrivers(f_drivers);
        const f_nurse = await request('/api/ambulance/staff/nurses', 'GET');
        setNurses(f_nurse);
    }, [ request ]);

    const registerBrigade = async () => {
        console.log(`doc: ${curDoc.user_id}`);
        console.log(`nurse: ${curNurse.user_id}`);
        console.log(`driver: ${curDriver.user_id}`);
        const body = {
            brigade: uuidv4(),
            doc: curDoc.user_id,
            nurse: curNurse.user_id,
            driver: curDriver.user_id
        }
        console.log(body);
        const fetched = await request('/api/ambulance/register', 'POST', body);
        history.push('/ambulance')
    }

    useEffect(async () => {
        await fetchStaff();
    }, fetchStaff);

    if (loading) {
        return <h1>Loading...</h1>
    }

    const onChangeHandler = e => {
        console.log(e.target.name);
        if (e.target.name === 'doc') {
            const curDoc = docs.filter(item => item.user_id === e.target.value);
            setCurDoc(curDoc[0]);
            console.log(curDoc)
        } else if (e.target.name === 'nurse') {
            const cur = nurses.filter(item => item.user_id === e.target.value);
            setCurNurse(cur[0]);
            console.log(curNurse)
        } else if (e.target.name === 'driver') {
            const curDriver = drivers.filter(item => item.user_id === e.target.value);
            setCurDriver(curDriver[0]);
            console.log(curDriver)
        }
    }

    return (
        <div className={"addBrigade"}>
            <div className="addBrigade_title">Выберите сотрудников</div>
            <div className="addBrigade__container">
                <div className="addBrigade_item__wrap">
                    <div className="addBrigade_item">
                        <div className="emp_title">Доктор</div>
                        <select name={"doc"} id={"doc"} onChange={onChangeHandler}>
                            {
                                docs.map(doc => {
                                    return <option value={doc.user_id}>{doc.f_name + " " + doc.m_name + " " + doc.l_name}</option>
                                })
                            }
                        </select>
                    </div>
                    <StaffCard item={curDoc}/>
                </div>
                <div className="addBrigade_item__wrap">
                    <div className="addBrigade_item">
                        <div className="emp_title">Медсестра</div>
                        <select name={"nurse"} id={"nurse"} onChange={onChangeHandler}>
                            {
                                nurses.map(nurse => {
                                    return <option value={nurse.user_id}>{nurse.f_name + " " + nurse.m_name + " " + nurse.l_name}</option>
                                })
                            }
                        </select>
                    </div>
                    <StaffCard item={curNurse}/>
                </div>
                <div className="addBrigade_item__wrap">
                    <div className="addBrigade_item">
                        <div className="emp_title">Водитель</div>
                        <select name={"driver"} id={"driver"} onChange={onChangeHandler}>
                            {
                                drivers.map(driver => {
                                    return <option value={driver.user_id}>{driver.f_name + " " + driver.m_name + " " + driver.l_name}</option>
                                })
                            }
                        </select>
                    </div>
                    <StaffCard item={curDriver}/>
                </div>
            </div>
            <button
                onClick={registerBrigade}

                className={"standard_btn addBrigade_btn"}
                type={"submit"}>Создать бригаду</button>
        </div>
    )
}