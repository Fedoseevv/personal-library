import './VacPage.css';
import {useHistory} from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
import {useHttp} from "../../../hooks/httpHook";
import {VacList} from "../components/VacList/VacList";

export const VacPage = () => {
    const history = useHistory();
    const [ vacs, setVacs ] = useState([]);
    const { loading, request } = useHttp();

    const fetchVacs = useCallback(async () => {
        try {
            const fetched = await request('/api/vac', 'GET');
            setVacs(fetched);
        } catch (e) {}
    }, [ request ])

    useEffect(async () => {
        await fetchVacs()
    }, [fetchVacs]);

    const onDeleteHandler = async (vac_name) => {
        console.log(`Delete: ${vac_name}`);
        await request(`/api/vac/deleteVac/${vac_name}`, 'GET');
        await fetchVacs();
        // /api/vac/deleteVac

    }
    const onEditHandler = async (form) => {
        console.log(form)
        await request(`/api/vac/editVac`, 'POST', form)
        await fetchVacs()
    }

    if (loading) {
        return <h1>Loading...</h1>
    }

    if (vacs.length === 0) {
        return (
            <div className={"vacPage"}>
                <div className="vacPage_container">
                    <h1 className="vacPage_title">Модуль "Вакцинация"</h1>
                    <div className="not_found">В БД нет записей о вакцинах</div>
                    <div className="vacPage_btns">
                        <button
                            type={"submit"}
                            onClick={e => history.push('/addVac-item')}
                            className={"standard_btn vacPage_btn"}>Добавить вакцину</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={"vacPage"}>
            <div className="vacPage_container">
                <h1 className="vacPage_title">Модуль "Вакцинация"</h1>
                <h2 className={"vacPage_subtitle"}>Доступные вакцины:</h2>
                { !loading && <VacList vacs={vacs}
                                       onDeleteHandler={onDeleteHandler}
                                       onEditHandler={onEditHandler} /> }
                <div className="vacPage_btns">
                    <button
                        type={"submit"}
                        onClick={e => history.push('/addVac-item')}
                        className={"standard_btn vacPage_btn"}>Добавить вакцину</button>
                    <button
                        type={"submit"}
                        onClick={e => history.push('/addVac-rec')}
                        className={"standard_btn vacPage_btn"}>Добавить запись о вакцинации</button>
                </div>
            </div>
        </div>
    );
}