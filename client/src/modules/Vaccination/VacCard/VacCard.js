import './VacCard.css';

export const VacCard = ({ vac }) => {
    if (!vac.hasOwnProperty('vac_name')) {
        return <h1>Выберите вакцину</h1>
    }
    return (
        <div className={"vacCard"}>
            <div className="vacCard_container">
                <div className="vacCard_title">Данные о вакцине</div>
                <div className="vacCard_info">
                    <div className="patCard_info__item">Название: {vac.vac_name}</div>
                    <div className="patCard_info__item">Описание: {vac.vac_descr}</div>
                    <div className="patCard_info__item">Противопоказания:
                        <ol>
                        {
                            vac.contraindication.split('; ').map((item, i) => {
                                return <li>{i + 1}. {item}</li>
                            })
                        }
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
}