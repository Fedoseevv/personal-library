import './AmbulanceList.css';
import {AmbulanceItem} from "../AmbulanceItem/AmbulanceItem";

export const AmbulanceList = ({ groups }) => {
    return (
        <div className={"ambulance_list__wrap"}>
            {
                groups.map(group => {
                    return <AmbulanceItem
                            key={group.brigade_id}
                            group={group}
                    />
                })
            }
        </div>
    );
}