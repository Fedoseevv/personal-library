import {PharmacyItem} from "../pharmacyItem/pharmacyItem";
import './PharmacyList.css';

export const PharmacyList = ({ drugs }) => {
    return (
        <div className={"drugs_container"}>
            {
                drugs.map(item => {
                    return <PharmacyItem
                            key={item.id}
                            item={item}
                            />
                })
            }
        </div>
    )
}