import './PatientCard.css';

export const PatientCard = ({ pat }) => {
    if (!pat.hasOwnProperty('user_id')) {
        return <h1>Выберите пациента</h1>
    }

    return (
        <div className={"patCard"}>
            <div className="patCard_container">
                <div className="patCard_title">Данные о пациенте</div>
                <div className="patCard_info">
                    <div className="patCard_info__item">Идентификатор: <span>{pat.user_id}</span></div>
                    <div className="patCard_info__item">Фамилия: <span>{pat.l_name}</span></div>
                    <div className="patCard_info__item">Имя: <span>{pat.f_name}</span></div>
                    <div className="patCard_info__item">Отчество: <span>{pat.m_name}</span></div>
                    <div className="patCard_info__item">Номер телефона: <span>{pat.phone_number}</span></div>
                    <div className="patCard_info__item">Дата рождения: <span>{pat.birth_date}</span></div>
                    <div className="patCard_info__item">Адрес проживания: <span>{pat.address}</span></div>
                    <div className="patCard_info__item">Полис ОМС: <span>{pat.oms_num}</span></div>
                    <div className="patCard_info__item">Паспорт РФ: <span>{pat.pass_num}</span></div>
                    <div className="patCard_info__item">СНИЛС: <span>{pat.snils}</span></div>
                </div>
            </div>
        </div>
    );
}