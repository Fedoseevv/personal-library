import './DocVisitsList.css'
import {DocVisitsItem} from "../DocVisitsItem/DocVisitsItem";
import {Link, useHistory} from "react-router-dom";

export const DocVisitsList = ({ visits, userId, onCancelHandler, updateRec }) => {
    const patId = JSON.parse(localStorage.getItem('userData')).userId;
    const history = useHistory();
    return (
        <>
            <h1 className="visits_title">Мои записи</h1>
            <div className={"visits_container"}>
                {
                    visits.length !== 0 ? visits.map(item => {
                        return <DocVisitsItem
                            item={item}
                            updateRec={updateRec}
                            onCancelHandler={onCancelHandler} />
                    })
                        : <div className={"visits_noInfo"}>У вас пока нет записей о визитах к врачу...</div>
                }
            </div>
            <div className="visits_btns">
                <button
                    onClick={() => history.push('/addPatRecord')}
                    type={"submit"}
                    className={"standard_btn visits_list__btn"}>Записаться к врачу</button>
                <Link to={`visHistory/${patId}`}>
                    <button
                        type={"submit"}
                        className={"standard_btn visits_list__btn"}>Посмотреть мою ЭМК</button>
                </Link>
            </div>
        </>
    );
}