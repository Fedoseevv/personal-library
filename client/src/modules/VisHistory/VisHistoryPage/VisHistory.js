import './VisHistory.css';
import {useParams} from "react-router-dom";
import {useHttp} from "../../../hooks/httpHook";
import {useCallback, useEffect, useState} from "react";
import {VisitInfoItem} from "../../../pages/FindPatientPage/FindPatientPage";
import {VisHistoryList} from "../VisHistoryList/VisHistoryList";
import {AnHistoryList} from "../AnHistoryList/AnHistoryList";
import {SickListsList} from "../SickListsList/SickListsList";

export const VisHistory = () => {
    const patId = useParams().id;
    const { loading, request } = useHttp();

    const [ visits, setVisits ] = useState([]);
    const [ analysis, setAnalysis ] = useState([]);
    const [ sickLists, setSickLists ] = useState([]);

    const fetchVisits = useCallback(async () => {
        const fetched = await request(`/api/patients/allVisits/${patId}`);
        setVisits(fetched);
    }, [ request ]);

    const fetchAnalysis = useCallback(async () => {
        const fetched = await request(`/api/analysis/records/byPatId/${patId}`);
        setAnalysis(fetched);
    }, [ request ]);

    const fetchSickList = useCallback(async () => {
        const fetched = await request(`/api/visits/sickLists/byPatId/${patId}`);
        setSickLists(fetched);
    }, [ request ]);

    useEffect(async () => {
        await fetchSickList();
    }, [ fetchSickList ]);

    useEffect(async () => {
        await fetchVisits();
    }, [ fetchVisits ]);

    useEffect(async () => {
        await fetchAnalysis();
    }, [ fetchAnalysis ]);


    if (loading) {
        return <h1>Loading...</h1>
    }
    return (
        <div className={"visHistory"}>
            <div className="visHistory_container">
                <div className="visHistory_title">ЭМК пациента</div>
                <div className="visHistory_content">
                    <div className="visHistory_subtitle">Записи о посещениях медицинской организации</div>
                    <div className="visHistory_content__wrap">
                        {
                            <VisHistoryList visits={visits} />
                        }
                    </div>
                </div>
                <div className="visHistory_content">
                    <div className="visHistory_subtitle">Записи о медицинских исследованиях</div>
                    <div className="visHistory_content__wrap">
                        {
                            <AnHistoryList analysis={analysis} />
                        }
                    </div>
                </div>
                <div className="visHistory_content">
                    <div className="visHistory_subtitle">Записи о больничных листах</div>
                    <div className="visHistory_content__wrap">
                        <SickListsList patId={patId} items={sickLists} />
                    </div>
                </div>
            </div>
        </div>
    );
}