import './PatientPage.css'

export const PatientPage = ({ patient }) => {
    return (
        <h1>{patient.user_id}</h1>
    );
}