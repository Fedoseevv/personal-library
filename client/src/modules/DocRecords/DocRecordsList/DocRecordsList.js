import {DocRecordsItem} from "../DocRecordsItem/DocRecordsItem";

export const DocRecordsList = ({ visits }) => {

    return (
        <>
            {
                visits.map((vis, index) => {
                    return <DocRecordsItem key={index} vis={vis} />
                })
            }
        </>
    );
}