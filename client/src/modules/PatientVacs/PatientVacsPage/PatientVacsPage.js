import './PatientVacsPage.css'
import {useCallback, useEffect, useState} from "react";
import {useHttp} from "../../../hooks/httpHook";
import {PatientVacsList} from "../PatientVacsList/PatientVacsList";

export const PatientVacsPage = () => {
    const userId = JSON.parse(localStorage.getItem('userData')).userId;
    const [ vacs, setVacs ] = useState([]);
    const { loading, request } = useHttp();

    const fetchVacs = useCallback(async () => {
        const fetched = await request(`/api/vac/patVac/${userId}`, 'GET');
        setVacs(fetched);
    }, [ request ]);

    useEffect(async () => {
        await fetchVacs();
    }, [ fetchVacs ]);

    if (loading) {
        return <h1>Loading...</h1>
    }

    return (
        <div className={"PatientVacsPage"}>
            <div className="PatientVacsPage_container">
                <h1 className="PatientVacsPage_title">Мои записи о вакцинации</h1>
                <div className="PatientVacsPage_content">
                    { !loading && <PatientVacsList vacs={vacs} /> }
                </div>
            </div>
        </div>
    );
}