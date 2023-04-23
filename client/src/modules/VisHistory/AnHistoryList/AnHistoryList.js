import {AnHistoryItem} from "../AnHistoryItem/AnHistoryItem";

export const AnHistoryList = ({ analysis }) => {
    return (
        <>
            {
                analysis.map(item => {
                    return <AnHistoryItem item={item} />
                })
            }
        </>
    );
}