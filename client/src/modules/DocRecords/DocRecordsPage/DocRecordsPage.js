import './DocRecordsPage.css'
import {useHttp} from "../../../hooks/httpHook";
import {useCallback, useEffect, useState} from "react";
import {DocVisitsList} from "../../PatientRecords/DocVisitsList/DocVisitsList";
import {DocRecordsList} from "../DocRecordsList/DocRecordsList";

export const DocRecordsPage = () => {
    const userId = JSON.parse(localStorage.getItem('userData')).userId
    const { loading, request } = useHttp();
    const [ visits, setVisits ] = useState([]);

    const fetchVisits = useCallback(async () => {
        const fetched = await request(`/api/staff/schedule/onlyBusy/${userId}`, 'GET');
        setVisits(fetched)
    }, [ request ]);

    useEffect(async () => {
        await fetchVisits()
    }, [ fetchVisits ]);

    if (loading) {
        return <h1>Loading...</h1>
    }

    return (
        <div className={"docVisits"}>
            <div className="docVisits_container">
                <h1 className="docVisits_title">Мои Записи</h1>
                <div className="docVisits_content">
                    { !loading && <DocRecordsList visits={visits}/> }
                </div>
            </div>
        </div>
    );
}