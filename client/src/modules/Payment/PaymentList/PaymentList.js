import {PaymentItem} from "../PaymentItem/PaymentItem";

export const PaymentList = ({ orders, closeOrder }) => {
    return (
        <>
            {
                orders.map(order => {
                    return <PaymentItem
                                order={order}
                                closeOrder={closeOrder} />
                })
            }
        </>
    );
}
