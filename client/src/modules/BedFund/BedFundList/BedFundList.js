import './BedFundList.css';
import {BedFundItem} from "../BedFundItem/BedFundItem";

export const BedFundList = ({ items, closeBed, openBed }) => {
    return (
        <>
            {
                items.map(item => {
                    return <BedFundItem
                                item={item}
                                closeBed={closeBed}
                                openBed={openBed} />
                })
            }
        </>
    )
}