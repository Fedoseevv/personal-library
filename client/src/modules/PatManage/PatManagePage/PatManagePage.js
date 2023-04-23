import './PatManagePage.css';
import {useHttp} from "../../../hooks/httpHook";
import {useCallback, useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {PatManageList} from "../PatManageList/PatManageList";

export const PatManagePage = () => {
    const { loading, request } = useHttp();

    const [ patients, setPatients ] = useState([]);
    const history = useHistory();

    const fetchPatients = useCallback(async () => {
        const fetched = await request('/api/patients/info', 'GET')
        setPatients(fetched);
    }, [ request ]);

    useEffect(async () => {
        await fetchPatients();
    }, [ fetchPatients ]);

    const unpinHandler = async (user_id) => {
        console.log(`Открепляем: ${user_id}`);
        const res = await request(`/api/patients/unpin/${user_id}`);
        await fetchPatients();
    }

    const pinHandler = async (user_id) => {
        console.log(`Открепляем: ${user_id}`);
        const res = await request(`/api/patients/pin/${user_id}`);
        await fetchPatients();
    }

    const onEditHandler = async (body) => {
        console.log(body);
        const res = await request('/api/patients/edit', 'POST', body);
        await fetchPatients();
    }

    if (loading) {
        return <h1>Loading...</h1>
    }
    return (
        <div className={"patients"}>
            <div className="patients_container">
                <h1 className="patients_title">Информация о пациентах</h1>
                <div className="patients_content">
                    { !loading && <PatManageList
                                    patients={patients}
                                    unpinHandler={unpinHandler}
                                    pinHandler={pinHandler}
                                    onEditHandler={onEditHandler} /> }
                </div>
                <div className="patients_btns">
                    <button
                        type={"submit"}
                        onClick={() => history.push('/addPat')}
                        className={"standard_btn"}>Зарегистрировать пациента</button>
                </div>
            </div>
        </div>

    );
}