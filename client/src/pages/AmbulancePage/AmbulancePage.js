import {useHistory} from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
import {useHttp} from "../../hooks/httpHook";

import './AmbulancePage.css';
import {AmbulanceList} from "../../components/AmbulanceList/AmbulanceList";

export const AmbulancePage = () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const history = useHistory();
    const [ groups, setGroups ] = useState([]);
    const { loading, request } = useHttp();

    const fetchGroups = useCallback(async () => {
        try {
            const fetched = await request('/api/ambulance/all', 'GET');
            setGroups(fetched);
        } catch (e) {}
    }, [ request ]);

    useEffect(async () => {
        await fetchGroups();
    }, [fetchGroups])

    if (loading) {
        return <h1>Loading...</h1>
    }

    return (
        <div className="ambulance">
            <div className="ambulance_container">
                <div className="ambulance_groups__title">Бригады скорой помощи</div>
                    { !loading &&  <AmbulanceList groups={groups}/>}
                <div className="ambulance_btns">
                    <button
                        type={"submit"}
                        disabled={userData.role !== 'admin'}
                        onClick={() => history.push('/add-ambulance')}
                        className="standard_btn ambulance_btn">Создать бригаду</button>
                    <button
                        type={"submit"}
                        onClick={() => history.push('/add-call')}
                        className={"standard_btn ambulance_btn"}>Добавить запись</button>
                    <button
                        type={"submit"}
                        onClick={() => history.push('/calls')}
                        className={"standard_btn ambulance_btn"}>Просмотр записей</button>
                </div>
            </div>
        </div>
    );
}