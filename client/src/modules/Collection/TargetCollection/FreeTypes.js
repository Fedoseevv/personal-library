import {RecordModal} from "../../DocRecords/RecordModal/RecordModal";

export const FreeItemBook = ({ item, colId, onAddHandler }) => {

    return (
        <div className={"staff_item"}>
            <div className="staff_item__title">Название книги: '{item.title}'</div>

            <div className="staff_item__wrap">
                <div className="book_img__wrap">
                    <img src={item.cover} alt=""/>
                </div>
                <div className="staff_item__container">
                    <div className="staff_item__info">Год издания: <span>{item.year_of_publication} г.</span></div>
                    <div className="staff_item__info">Жанр: <span>{item.genre}</span></div>
                    <div className="staff_item__info">Краткая аннотация: <span>{item.brief_annotation}</span></div>
                    <div className="staff_item__info">Расположение на компьютере: <span>{item.location.replace("myproto://", "")}</span></div>
                    <div className="staff_item__info">Ключевые слова: <span>{item.keywords.toLowerCase().split(';').join(", ")}</span></div>
                    <div className="staff_item__info">Автор(-ы): <span>{item.authors.join("; ")}</span></div>
                    <div className="staff_item__info">Издательство: <span>{item.pub_name}</span></div>
                    <div className="staff_item__info">Город издания: <span>{item.city_of_publication}</span></div>
                    <div className="staff_item__btns">
                        <button
                            type={"submit"}
                            className={"standard_btn"}><a href={item.location}>Открыть локально</a></button>
                        <button
                            type={"submit"}
                            className={"standard_btn"}><a target="_blank" href={item.location_obl}>Открыть в облаке</a></button>
                        <button
                            type={"submit"}
                            onClick={async () => await onAddHandler(item.id_book, colId)}
                            className={"standard_btn"}>Добавить в коллекцию</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const FreeItemDoc = ({ item, colId, onAddHandler }) => {

    return (
        <div className={"article_item"}>
            <div className="article_item__title">Название статьи: '{item.title}'</div>
            <div className="article_item__container">
                <div className="article_item__info">Дата публикации статьи: {new Date(Date.parse(item.date_of_publication)).toLocaleDateString()}</div>
                <div className="staff_item__info">Автор(-ы): <span>{item.authors.join("; ")}</span></div>
                <div className="docs_item__btns">
                    <button
                        type={"submit"}
                        className={"standard_btn docs_standard__btn"}><a href={"myproto://" + item.location}>Открыть локально</a></button>
                    <button
                        type={"submit"}
                        className={"standard_btn docs_standard__btn"}><a target="_blank" href={item.location_obl}>Открыть в облаке</a></button>
                    <button
                        type={"submit"}
                        onClick={async () => await onAddHandler(item.id_document, colId)}
                        className={"standard_btn"}>Добавить в коллекцию</button>
                </div>
            </div>
        </div>
    )
}

export const FreeItemArticle = ({ item, colId, onAddHandler }) => {
    console.log(item)
    return (
        <div className={"article_item"}>
            <div className="article_item__title">Название статьи: '{item.title}'</div>
            <div className="article_item__container">
                <div className="article_item__info">Дата публикации статьи: {new Date(Date.parse(item.date_of_publication)).toLocaleDateString()}</div>
                <div className="staff_item__info">Автор(-ы): <span>{item.authors.join("; ")}</span></div>
                <div className="article_item__btns">
                    <button
                        type={"submit"}
                        className={"standard_btn article_standard__btn"}><a target="_blank" href={item.hyperlink}>Открыть статью</a></button>
                    <button
                        type={"submit"}
                        onClick={async () => await onAddHandler(item.id_article, colId)}
                        className={"standard_btn article_standard__btn"}>Добавить в коллекцию</button>
                </div>
            </div>
        </div>
    )
}