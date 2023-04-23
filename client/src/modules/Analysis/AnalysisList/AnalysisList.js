import './AnalysisList.css';
import {AnalysisItem} from "../AnalysisItem/AnalysisItem";

export const AnalysisList = ({ items, deleteHandler, updateRecord }) => {
    return (
        <>
            {
                items.length !== 0 ? items.map(item => {
                    return <AnalysisItem
                                deleteHandler={deleteHandler}
                                updateRecord={updateRecord}
                                item={item} />
                })
                    : <h1 className={"analysis_info__msg"}>В данный момент активных записей нет...</h1>
            }
        </>
    );
}