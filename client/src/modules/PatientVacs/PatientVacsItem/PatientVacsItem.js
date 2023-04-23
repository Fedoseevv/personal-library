import './PatientVacsItem.css';
import {useState} from "react";
import {Modal} from "../../../components/modal/Modal";
import {useHttp} from "../../../hooks/httpHook";

export const PatientVacsItem = ({ vac }) => {
    const [ modalActive, setModalActive ] = useState(false);
    const [ vacInfo, setVacInfo ] = useState({});
    const { loading, request } = useHttp();

    const fetchInfo = async () => {
        const fetched = await request(`/api/vac/byName/${vac.vac_name}`);
        setVacInfo(fetched[0]);
    }

    const showModalInfo = async () => {
        await fetchInfo()
            .then(() => setModalActive(true));
    }

    return (
        <div className={"PatientVacsItem"}>
            <div className="PatientVacsItem_container">
                <div className="PatientVacsItem_item">Название вакцины: <button
                                                                            onClick={showModalInfo}
                                                                            className={"PatientVacsItem_btn"}>{vac.vac_name}</button></div>
                <div className="PatientVacsItem_item">
                    Дата вакцинации: <span>{new Date(Date.parse(vac.vac_date)).toLocaleDateString()}</span>
                </div>
            </div>
            <Modal active={modalActive && !loading } setActive={setModalActive}>
                <div className="patientVacsItem_modal">
                    <div className="patientVacsItem_modal__container">
                        <div className="patientVacsItem_modal_title">{vacInfo.vac_name}</div>
                        <div className="patientVacsItem_modal_item">Описание: {vacInfo.vac_descr}</div>
                        <div className="patientVacsItem_modal_item">Противопоказания:</div>
                        <ol>
                            { !(!!vacInfo.contraindication) ? "" :
                                vacInfo.contraindication.split('; ').map((item, i) => {
                                    return <li>{i + 1}. {item}</li>
                                })
                            }
                        </ol>
                    </div>
                </div>
            </Modal>
        </div>
    );
}