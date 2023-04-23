import './PharmaOrdersList.css';
import {PharmaOrdersItem} from "../PharmaOrdersItem/PharmaOrdersItem";

export const PharmaOrdersList = ({ orders, onCancelHandler, onConfirmHandler }) => {
    return (
        <div className="orders_container">
            {
                orders.map(item => {
                    return <PharmaOrdersItem
                        onCancelHandler={onCancelHandler}
                        onConfirmHandler={onConfirmHandler} item={item}/>
                })
            }
        </div>
    );
}