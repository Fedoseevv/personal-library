import {VacItem} from "../VacItem/VacItem";

export const VacList = ({ vacs, onEditHandler, onDeleteHandler }) => {
    return (
        <div className={"vacPage_items"}>
            {
                vacs.map(item => {
                    return <VacItem
                        key={item.vac_name}
                        item={item}
                        onEditHandler={onEditHandler}
                        onDeleteHandler={onDeleteHandler}
                    />
                })
            }
        </div>
    );
}