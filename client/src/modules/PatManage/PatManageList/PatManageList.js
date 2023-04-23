import './PatManageList.css';
import {PatManageItem} from "../PatManageItem/PatManageItem";

export const PatManageList = ({ patients, onEditHandler, unpinHandler, pinHandler }) => {
    return (
        <>
            {
                patients.map(item => {
                    return <PatManageItem
                                item={item}
                                unpinHandler={unpinHandler}
                                pinHandler={pinHandler}
                                onEditHandler={onEditHandler} />
                })
            }
        </>
    );
}