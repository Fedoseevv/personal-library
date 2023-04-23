import './ScheduleCard.css'
import {useHttp} from "../../../hooks/httpHook";
import {useCallback, useEffect, useState} from "react";

export const ScheduleCard = ({ doc, changeVis }) => {
    const { loading, request } = useHttp();
    const [ schedule, setSchedule ] = useState([]);

    const fetchSchedule = useCallback(async (doc_id) => {
        const fetched = await request(`/api/staff/schedule/${doc_id}`, 'GET')
            .then(response => setSchedule(response.sort()));
    }, [ request ])

    useEffect(async () => {
        await fetchSchedule(doc.user_id);
    },[ fetchSchedule, doc ]);


    if (!doc.hasOwnProperty('user_id')) {
        return <div>Специалист не выбран...</div>
    }

    const getDateWithTime = (date) => {
        const obj = new Date (Date.parse(date))
        return obj.toLocaleDateString() + " " + obj.toLocaleTimeString().slice(0, -3);
    }
    const getOnlyTime = (date) => {
        const obj = new Date (Date.parse(date))
        return obj.toLocaleTimeString().slice(0, -3);
    }


    if (loading) {
        return <h1>Loading...</h1>
    }

    return (
        <select onClick={changeVis} className={"addVisit_docs__item"} name="date" id="date">
            {
                schedule.map(item => {
                    return <option value={item.vis_id}>
                        {
                            getDateWithTime(item.start_date) + " - " + getOnlyTime(item.end_date)
                        }
                    </option>
                })
            }
        </select>
    );
}
