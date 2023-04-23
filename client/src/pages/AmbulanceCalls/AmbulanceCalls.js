import {useHttp} from "../../hooks/httpHook";
import {useCallback, useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {AmbulanceCallList} from "../../components/AmbulanceCallList/AmbulanceCallList";

import './AmbulanceCalls.css';

export const AmbulanceCalls = () => {
    const { request, loading } = useHttp();
    const [calls, setCalls] = useState([]);
    const history = useHistory();

    const userData = JSON.parse(localStorage.getItem('userData'));

    const fetchData = useCallback(async () => {
        const data = await request('/api/ambulance/allCalls', 'GET')
        setCalls(data);
    }, [request]);

    useEffect(async () => {
        await fetchData();
    }, [fetchData]);

    const onCancelHandler = async (id) => {
        console.log(id);
        const res = await request(`/api/ambulance/cancelCall/${id}`, 'GET');
        await fetchData();
        history.push('/calls');
    }
    const onConfirmHandler = async (body) => {
        console.log(body);
        const res = await request(`/api/ambulance/confirmCall`, 'POST', body);
        await fetchData();
        history.push('/calls');
    }

    if (loading) {
        return <h1>Loading...</h1>
    }

    return (
        <div className={"ambulanceCalls"}>
            <div className="ambulanceCalls__title">Вызовы</div>
            { !loading && <AmbulanceCallList calls={calls}
                                             onCancelHandler={onCancelHandler}
                                             onConfirmHandler={onConfirmHandler}/> }
            <div className={"ambulanceCalls_btn__wrap"}>
                <button
                    onClick={() => history.push('/ambulance')}
                    type={"submit"}
                    className={ userData.role === 'admin' || userData.role === 'hostess' ? "standard_btn ambulanceCalls_btn__back" : 'hide_btn' }>Назад</button>
            </div>
        </div>

    );
}