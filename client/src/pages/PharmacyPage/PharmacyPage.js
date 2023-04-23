import {PharmacyItem} from "../../components/pharmacyItem/pharmacyItem";
import {useHistory, Link} from "react-router-dom";
import {useCallback, useContext, useEffect, useState} from "react";
import {useHttp} from "../../hooks/httpHook";
import {AuthContext} from "../../context/AuthContext";
import {PharmacyList} from "../../components/PharmacyList/PharmacyList";


import './PharmacyPage.css';

export const PharmacyPage = () => {
    const history = useHistory();

    const [ drugs, setDrugs ] = useState([]);
    const { loading, request } = useHttp();
    const { token } = useContext(AuthContext);

    const fetchDrugs = useCallback(async () => {
        try {
            const fetched = await request('/api/pharmacy/all', 'GET');
            setDrugs(fetched);
        } catch (e) {}
    }, [token, request]);

    const overduePharma = async () => {
        const res = await request('/api/pharmacy/deleteOverdue', 'GET');
        await fetchDrugs();
    }

    useEffect(async () => {
        await fetchDrugs()
    }, [fetchDrugs])

    if (loading) {
        return <h1>Loading...</h1>
    }

    return (
        <div className="pharmacy">
            <div className="pharmacy_title">Товары на складе</div>
            { !loading && <PharmacyList drugs={drugs} /> }
            <div className="pharm_add__btns">
                <button
                    className="standard_btn pharm_btn"
                    onClick={overduePharma}
                    type="submit">Списать просроченные препараты</button>
                <button
                    onClick={() => history.push('/addPharm')}
                    className="standard_btn pharm_btn"
                    type="submit">
                    Сформировать заказ
                </button>
                <button
                    type={"submit"}
                    onClick={() => history.push('/pharmacy-orders')}
                    className="standard_btn pharm_btn">
                    Заказы
                </button>
            </div>
        </div>
    )
}