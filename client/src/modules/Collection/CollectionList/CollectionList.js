import {CollectionItem} from "../CollectionItem/CollectionItem";

export const CollectionList = ({ collections, onDeleteHandler, openCollection }) => {

    return (
        <>
            {
                collections.map((item, index) => {
                    return <CollectionItem
                        item={item}
                        key={index}
                        openCollection={openCollection}
                        onDeleteHandler={onDeleteHandler} />
                })
            }
        </>
    )
}