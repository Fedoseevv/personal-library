import '../../../reset.css';
import './StatisticPage.css';
import BarChart from "../components/BarChart";
import {useCallback, useEffect, useState} from "react";
import {useHttp} from "../../../hooks/httpHook";
import {StaffList} from "../../StaffManage/StaffList/StaffList";
import {VisByMonth} from "../components/VisByMonth/VisByMonth";
import {AnalysisByMonth} from "../components/AnalysisByMonth/AnalysisByMonth";
import {MostBusyDoc} from "../components/MostBusyDoc/MostBusyDoc";
import {BedFundStat} from "../components/BedFundStat/BedFundStat";
import {PatByMonth} from "../components/PatByMonth/PatByMonth";
import {StaffByMonth} from "../components/StaffByMonth/StaffByMonth";
import {AmbulanceByMonth} from "../components/AmbulanceByMonth/AmbulanceByMonth";



export const StatisticPage = () => {
    const { loading, request } = useHttp();

    const [ visByMonth, setVisByMonth ] = useState([]);
    const [ analysisByMonth, setAnalysisByMonth ] = useState([]);
    const [ busyDocs, setBusyDocs ] = useState([]);
    const [ bedFund, setBedFund ] = useState([]);
    const [ patByMonth, setPatByMonth ] = useState([]);
    const [ staffByMonth, setStaffByMonth ] = useState([]);
    const [ amb, setAmb ] = useState([]);

    const fetchVisByMonth = useCallback(async () => {
        const fetched = await request('/api/statistics/visByMonth');
        setVisByMonth(fetched);
    }, [ request ]);

    const fetchAnalysisByMonth = useCallback(async () => {
        const fetched = await request('/api/statistics/anByMonth');
        setAnalysisByMonth(fetched);
    }, [ request ]);

    const fetchBusyDocs = useCallback(async () => {
        const fetched = await request('/api/statistics/mostBusyDoc');
        setBusyDocs(fetched);
    }, [ request ]);

    const fetchBedFund = useCallback(async () => {
        const fetched = await request('/api/statistics/bedFund');
        setBedFund(fetched);
    }, [ request ]);

    const fetchPatByMonth = useCallback(async () => {
        const fetched = await request('/api/statistics/patStat');
        setPatByMonth(fetched);
    }, [ request ]);

    const fetchStaffByMonth = useCallback(async () => {
        const fetched = await request('/api/statistics/staffStat');
        setStaffByMonth(fetched);
    }, [ request ]);

    const fetchAmbByMonth = useCallback(async () => {
        const fetched = await request('/api/statistics/ambulanceStat');
        setAmb(fetched);
    }, [ request ]);

    useEffect(async () => {
        await fetchAmbByMonth();
    }, [ fetchAmbByMonth ]);

    useEffect(async () => {
        await fetchStaffByMonth();
    }, [ fetchStaffByMonth ]);

    useEffect(async () => {
        await fetchPatByMonth();
    }, [ fetchPatByMonth ]);

    useEffect(async () => {
        await fetchBedFund();
    }, [ fetchBedFund ]);

    useEffect(async () => {
        await fetchBusyDocs();
    }, [ fetchBusyDocs ]);

    useEffect(async () => {
        await fetchAnalysisByMonth();
    }, [ fetchAnalysisByMonth ]);

    useEffect(async () => {
        await fetchVisByMonth();
    }, [ fetchVisByMonth ]);

    if (loading) {
        return <h1>Loading...</h1>
    }

    return (
        <div className="statistic">
            <div className="statistic_container">
                <div className="statistic_title">Статистика медицинской организации</div>
                <div className="statistic_content">
                    <div className="statistic_content_item">
                        <div className="statistic_content__subtitle">Количество посещений медицинской организации</div>
                        <div className={"statistic_item bar"}>
                            { !loading &&  <VisByMonth visitsByMonth={visByMonth} /> }
                        </div>
                    </div>
                    <div className="statistic_content_item">
                        <div className="statistic_content__subtitle">Количество проведенных исследований</div>
                        <div className={"statistic_item bar"}>
                            { !loading && <AnalysisByMonth analysisByMonth={analysisByMonth} /> }
                        </div>
                    </div>
                    <div className="statistic_content_item">
                        <div className="statistic_content__subtitle">Загруженность специалистов за текущий месяц</div>
                        <div className={"statistic_item pie"}>
                            { !loading && <MostBusyDoc docsByMonth={busyDocs} /> }
                        </div>
                    </div>
                    <div className="statistic_content_item">
                        <div className="statistic_content__subtitle">Загруженность коечного фонда в настоящий момент времени</div>
                        <div className={"statistic_item pie"}>
                            { !loading && <BedFundStat bedFund={bedFund} /> }
                        </div>
                    </div>
                    <div className="statistic_content_item">
                        <div className="statistic_content__subtitle">Количество зарегестрированных пациентов за текущий год</div>
                        <div className={"statistic_item bar"}>
                            { !loading && <PatByMonth patByMonth={patByMonth} /> }
                        </div>
                    </div>
                    <div className="statistic_content_item">
                        <div className="statistic_content__subtitle">Количество новых сотрудников за текущий год</div>
                        <div className={"statistic_item bar"}>
                            { !loading && <StaffByMonth staffByMonth={staffByMonth} /> }
                        </div>
                    </div>
                    <div className="statistic_content_item">
                        <div className="statistic_content__subtitle">Количество вызовов скорой помощи за текущий год</div>
                        <div className={"statistic_item bar"}>
                            { !loading && <AmbulanceByMonth ambulanceByMonth={amb} /> }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}