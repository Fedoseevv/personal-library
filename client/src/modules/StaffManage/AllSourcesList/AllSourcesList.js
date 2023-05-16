import './AllSourcesList.css';
import {BookItem} from "../BookItem/BookItem";
import {DocsItem} from "../DocsItem/DocsItem";
import {LinkItem} from "../LinkItem/LinkItem";

export const AllSourcesList = ({ books, docs, articles, onDeleteArticle, onDeleteBook, onDeleteDoc, authors }) => {
    return (
        <>
            {
                (books === undefined || books.length === 0) &&
                (docs === undefined || docs.length === 0) &&
                (articles === undefined || articles.length === 0) &&
                <h1>Ничего не найдено...</h1>
            }
            {
                books !== undefined && books.length > 0 &&
                <>
                    <h1 className={"staff_title"}>Книги</h1>
                    <div className={"staff_container"}>
                        {
                            books.map(item => {
                                return <BookItem
                                    item={item}
                                    key={item.id_book}
                                    authors={authors}
                                    allBooks={books}
                                    onDeleteBook={onDeleteBook} />
                            })
                        }
                    </div>
                </>
            }
            {
                docs !== undefined && docs.length > 0 &&
                <>
                    <h1 className={"staff_title"}>Документы</h1>
                    <div className={"staff_container"}>
                        {
                            docs.map(item => {
                                return <DocsItem
                                    item={item}
                                    key={item.id_document}
                                    authors={authors}
                                    onDeleteDoc={onDeleteDoc} />
                            })
                        }
                    </div>
                </>
            }
            {
                articles !== undefined && articles.length > 0 &&
                <>
                    <h1 className={"staff_title"}>Статьи</h1>
                    <div className="staff_container">
                        {
                            articles.map(item => {
                                return <LinkItem
                                    key={item.id_article}
                                    authors={authors}
                                    item={item}
                                    onDeleteArticle={onDeleteArticle} />
                            })
                        }
                    </div>
                </>
            }

        </>
    );
}