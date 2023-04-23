import {PatientVacsItem} from "../PatientVacsItem/PatientVacsItem";

import './PatientVacsList.css';

export const PatientVacsList = ({ vacs }) => {
    return (
        <>
            {
                vacs.map(vac => {
                    return <PatientVacsItem vac={vac}/>
                })
            }
        </>
    );
}