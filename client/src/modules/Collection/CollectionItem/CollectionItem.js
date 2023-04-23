import './CollectionItem.css';
import {useHttp} from "../../../hooks/httpHook";
import {Link, useHistory} from "react-router-dom";

export const CollectionItem = ({item, onDeleteHandler, openCollection}) => {
    const { loading, request } = useHttp();
    const history = useHistory();

    const prepForDelete = async () => {
        await onDeleteHandler(item.id_collection)
    }
    const prepForOpen = async () => {
        await openCollection(item.id_collection);
    }

    return (
        <div className={"card"}>
            <div className="card_title">Коллекция</div>
            <div className="card_content">
                <div className="card_content__item">Название коллекции: <span>{item.name}</span></div>
                <div className="card_content__item">Дата создания коллекции: <span>{new Date(Date.parse(item.date_of_creation)).toLocaleDateString()}</span></div>
            </div>
            <div className="card_btns__wrap">
                    <button
                        type={"submit"}
                        className={"standard_btn card_btn"}><Link to={`/collection/${item.id_collection}`}>Открыть</Link></button>
                <button
                    type={"submit"}
                    onClick={prepForDelete}
                    className={"standard_btn card_btn"}>Удалить</button>

            </div>
        </div>
    )
}