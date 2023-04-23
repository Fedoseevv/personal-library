import './PaymentPage.css';

import {useHttp} from "../../../hooks/httpHook";
import {useCallback, useEffect, useState} from "react";
import {PaymentList} from "../PaymentList/PaymentList";

export const PaymentPage = () => {
    const { loading, request } = useHttp();
    const [ orders, setOrders ] = useState([]);

    const fetchOrders = useCallback(async () => {
        const fetched = await request('/api/payments/unpaid');
        setOrders(fetched)
    }, [ request ]);

    const closeOrder = async (id) => {
        const res = await request(`/api/payments/closeOrder/${id}`);
        console.log(id);
        await fetchOrders();
    }

    useEffect(async () => {
        await fetchOrders();
    }, [ fetchOrders ]);

    if (loading) {
        return <h1>Loading...</h1>
    }
    return (
        <div className={"payment"}>
            <div className="payment_container">
                <h1 className="payment_title">Неоплаченные медицинские препараты</h1>
                <div className="payment_content">
                    {
                        <PaymentList
                                orders={orders}
                                closeOrder={closeOrder} />
                    }
                </div>
                <div className={"payment_btns"}>
                    <button type={"submit"} className={"standard_btn payment_btn"}>Посмотреть ранние записи</button>
                </div>
            </div>
        </div>
    );
}