import './VisHistoryList.css';
import {VisHistoryItem} from "../VisHistoryItem/VisHistoryItem";

export const VisHistoryList = ({ visits }) => {
    return (
        <>
            {
                visits.map(item => {
                    return <VisHistoryItem item={item} />
                })
            }
        </>
    );
}