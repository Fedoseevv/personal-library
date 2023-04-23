import './StaffList.css';
import {StaffItem} from "../StaffItem/StaffItem";
import {DocsItem} from "../DocsItem/DocsItem";
import {LinkItem} from "../LinkItem/LinkItem";

export const StaffList = ({ books, docs, articles, onDeleteHandler, onEditHandler }) => {
    return (
        <>
            <h1 className={"staff_title"}>Литературные источники</h1>
            <div className={"staff_container"}>
                {
                    books.map(item => {
                        return <StaffItem item={item}
                                          onEditHandler={onEditHandler}
                                          onDeleteHandler={onDeleteHandler} />
                    })
                }
            </div>
            <h1 className={"staff_title"}>Документы</h1>
            <div className={"staff_container"}>
                {
                    docs.map(item => {
                        return <DocsItem item={item} />
                    })
                }
            </div>
            <h1 className={"staff_title"}>Статьи</h1>
            <div className="staff_container">
                {
                    articles.map(item => {
                        return <LinkItem item={item} />
                    })
                }
            </div>

        </>
    );
}