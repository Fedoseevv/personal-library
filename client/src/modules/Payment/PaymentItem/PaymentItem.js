import './PaymentItem.css';

export const PaymentItem = ({ order, closeOrder }) => {

    return (
        <div className={"paymentItem"}>
            <div className="paymentItem_container">
                <div className="paymentItem_title">ФИО пациента: { order.l_name + " " + order.f_name + " " + order.m_name }</div>
                <div className="paymentItem_content">
                    <div className="paymentItem_content__item">Дата получения препарата: { new Date(Date.parse(order.start_date)).toLocaleDateString() }</div>
                    <div className="paymentItem_content__item">Название препарата: { order.name } </div>
                    <div className="paymentItem_content__item">Количество: { order.total_price / order.cost } шт.</div>
                    <div className="paymentItem_content__item">Общая стоимость: { order.total_price } ₽</div>
                </div>
                <div className="paymentItem_btns">
                    <button
                        type={"submit"}
                        onClick={async () => { await closeOrder(order.id)}}
                        className={"standard_btn paymentItem_btn"}>Оплатить заказ</button>
                </div>
            </div>
        </div>
    );
}