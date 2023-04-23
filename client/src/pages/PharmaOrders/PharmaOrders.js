import './PharmaOrders.css';
import {useCallback, useEffect, useState} from "react";
import {useHttp} from "../../hooks/httpHook";
import {PharmaOrdersList} from "../../components/PharmaOrdersList/PharmaOrdersList";
import {useHistory} from "react-router-dom";
import {Modal} from "../../components/modal/Modal";

export const PharmaOrders = () => {
    const { loading, setLoading, request } = useHttp();
    const [orders, setOrders] = useState([]);
    const history = useHistory();

    const fetchOrders = useCallback(async () => {
        const fetched = await request('/api/pharmacy/orders', 'GET');
        setOrders(fetched);
    }, [request]);

    useEffect(async () => {
        await fetchOrders();
    }, [fetchOrders]);

    const onCancelHandler = async (order_id) => {
        console.log(`Отмена: ${order_id}`);
        const body = {order_id: order_id};
        const res = await request('/api/pharmacy/cancel-order', 'POST', body);
        await fetchOrders();
    }

    const onConfirmHandler = async (body) => {
        console.log(body);
        const res = await request('/api/pharmacy/confirm-order', 'POST', body);
        history.push('/pharmacy');
    }

    if (loading) {
        return <h1>Loading...</h1>
    }

    return (
        <div className="pharmacy_orders">
            <h1 className="pharmacy_orders__title">Активные заказы</h1>
            {
                orders.length !== 0 ? <PharmaOrdersList orders = {orders}
                                                  onConfirmHandler={onConfirmHandler}
                                                  onCancelHandler={onCancelHandler}/>
                    :
                    <>
                        <div className={"pharmacy_orders__information"}>В данный момент нет активных заказов</div>
                    </>
            }
            <div className="pharmacy_orders__btns">
                <button
                    className={"standard_btn pharmacy_orders__btn"}
                    onClick={() => history.push('/pharmacy')}
                    type={"submit"}>Назад</button>
            </div>
        </div>
    );
}