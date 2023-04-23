import {SickListItem} from "../SickListItem/SickListItem";

export const SickListsList = ({ items, patId }) => {
    return (
        <>
            {
                items.map(item => {
                    return <SickListItem patId={patId} item={item} />
                })
            }
        </>
    );
}