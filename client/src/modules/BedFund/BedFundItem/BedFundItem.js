import './BedFundItem.css';
import {useState} from "react";
import {Modal} from "../../../components/modal/Modal";
import {useHttp} from "../../../hooks/httpHook";

export const BedFundItem = ({ item, openBed, closeBed }) => {
    const { loading, request } = useHttp();
    const [ modalActive, setModalActive ] = useState(false);
    const [ bed, setBed ] = useState({
        ...item,
        status: item.pat_id == null && item.canused ? 'свободно' : 'занято'
    })
    const [pat, setPat] = useState({});
    const fetchPat = async () => {
        if (bed.pat_id != null) {
            const fetched = await request(`/api/patients/${bed.pat_id}`, 'GET')
            setPat(fetched);
        }
    }


    const openModal = async () => {
        await fetchPat()
            .then(() => setModalActive(true));
    }

    return (
        <div className={"bedFundItem"}>
            <div className="bedFundItem_container">
                <div onClick={openModal} className="bedFundItem_title">Койко-место</div>
                <div className="bedFundItem_content">
                    <div className="bedFundItem_content__item">Номер палаты: <span>{bed.room_number}</span></div>
                    <div className="bedFundItem_content__item">Номер койко-места: <span>{bed.num_bed}</span></div>
                    <div
                        className={"bedFundItem_content__item"}
                            >Статус: <span className={bed.status === 'занято' || !item.canused ? "red_status" : "green_status"}>{ item.canused ? bed.status : "Закрыто на ремонт" }</span></div>
                </div>
                <button
                    type={"submit"}
                    className={ item.canused ? "standard_btn bedFundItem_btn" : "hide_btn" }
                    onClick={async () => { await closeBed(bed.id)} }>Закрыть на ремонт</button>
                <button
                    type={"submit"}
                    className={ !item.canused ? "standard_btn bedFundItem_btn" : "hide_btn" }
                    onClick={async () => { await openBed(bed.id)} }>Открыть койко-место</button>
            </div>
            <Modal active={modalActive} setActive={setModalActive}>
                <div className="bedFundItem_modal">
                    <div className="bedFundItem_modal__title">Информация о койко-месте</div>
                    <div className="bedFundItem_modal__content">
                        <div className="bedFundItem_modal__item">Номер палаты: <span>{bed.room_number}</span></div>
                        <div className="bedFundItem_modal__item">Номер койко-места: <span>{bed.num_bed}</span></div>
                    </div>
                    <div className="bedFundItem_modal__content">
                        {
                            bed.pat_id != null ?
                                <div className={"bedFundItem_modal__info"}>
                                    <div className="bedFundItem_modal__title">Информация о пациенте</div>
                                    <div className="bedFundItem_modal__item">ФИО: <span>{pat.l_name + " " + pat.f_name + " " + pat.m_name}</span></div>
                                    <div className="bedFundItem_modal__item">Номер телефона: <span>{pat.phone_number}</span></div>
                                    <div className="bedFundItem_modal__item">Дата рождения: <span>{new Date(Date.parse(pat.birth_date)).toLocaleDateString()}</span></div>
                                    <div className="bedFundItem_modal__item">Адрес проживания: <span>{pat.address}</span></div>
                                    <div className="bedFundItem_modal__item">Паспорт РФ: <span>{pat.pass_num}</span></div>
                                    <div className="bedFundItem_modal__item">Полис ОМС: <span>{pat.oms_num}</span></div>
                                    <div className="bedFundItem_modal__item">СНИЛС: <span>{pat.snils}</span></div>

                                </div>
                            : <div className={"red_status"}>Пациент отсутствует</div>
                        }
                    </div>
                </div>
            </Modal>
        </div>
    );
}