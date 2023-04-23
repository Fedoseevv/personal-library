import './DocVisits.css';
import {useAuth} from "../../../hooks/auth";
import {useHttp} from "../../../hooks/httpHook";
import {useHistory} from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
import {DocVisitsList} from "../DocVisitsList/DocVisitsList";

export const DocVisits = () => {
    const storage = JSON.parse(localStorage.getItem('userData'))
    const { loading, request } = useHttp();
    const [ visits, setVisits ] = useState([]);
    const history = useHistory();

    const fetchVisits = useCallback(async () => {
        const fetched = await request(`/api/patients/myVisits/${storage.userId}`);
        setVisits(fetched);
    }, [ request ]);

    useEffect(async () => {
        await fetchVisits();
    }, [ fetchVisits ]);

    const onCancelHandler = async (vis_id) => {
        console.log(`Отменяем: ${vis_id}`);
        const res = await request(`/api/staff/schedule/setUnBusy/${vis_id}`, 'GET')
        await fetchVisits();
    }

    const updateRec = async (body, setModalActive) => {
        console.log(body);
        const res = await request('/api/staff/schedule/updateBusy', 'POST', body)
        await fetchVisits();
    }

    if (loading) {
        return <h1>Loading...</h1>
    }

    return (
        <div className={"visits"}>
            { !loading && <DocVisitsList
                visits={visits}
                userId={storage.userId}
                updateRec={updateRec}
                onCancelHandler={onCancelHandler} /> }
        </div>
    );
}
