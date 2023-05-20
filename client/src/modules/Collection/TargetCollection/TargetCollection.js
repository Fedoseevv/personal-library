import {useHistory, useParams} from "react-router-dom";
import {useHttp} from "../../../hooks/httpHook";
import {useCallback, useEffect, useState} from "react";
import {TargetItemArticle, TargetItemBook, TargetItemDoc} from "./TargetTypes";
import './TargetCollection.css';
import {FreeItemArticle, FreeItemBook, FreeItemDoc} from "./FreeTypes";
import {Loader} from "../../../components/loader/Loader";

export const TargetCollection = ({ item }) => {
    const id = useParams().id;

    const { loading, request } = useHttp();

    const downloadPdf = async () => {
        try {
            // Выполняем GET-запрос на сервер
            const response = await fetch(`/api/collections/report/${id}`);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            // Создаем ссылку для скачивания PDF-файла
            const link = document.createElement('a');
            link.href = url;
            link.download = 'Collection.pdf';

            // Добавляем ссылку на страницу и нажимаем на нее
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error(err);
        }
    };

    const [ isNewVisible, setIsNewVisible ] = useState(false);
    const [ isBtnVisible, setBtnVisible ] = useState(true);
    const setVisible = () => {
        setIsNewVisible(true);
        setBtnVisible(false);
    }

    const [ freeBooks, setFreeBooks ] = useState([]);
    const [ collBooks, setCollBooks ] = useState([]);

    const [ freeDocs, setFreeDocs ] = useState([]);
    const [ collDocs, setCollDocs ] = useState([]);

    const [ freeArticles, setFreeArticles ] = useState([]);
    const [ collArticles, setCollArticles ] = useState([]);


    const [ collection, setCollection ] = useState({});
    const history = useHistory();

    const fetchAllData = useCallback(async () => {
        const collectionsFetched = await request('/api/collections/all', 'GET');

        const booksFetched = await request('/api/books/inCollection', 'POST', {id: id});
        const booksFreeFetched = await request('/api/books/notInCollection', 'POST', {id: id});

        const docsFreeFetched = await request('/api/documents/notInCollection', 'POST', {id: id});
        const docsFetched = await request('/api/documents/inCollection', 'POST', {id: id});

        const articleFreeFetched = await request('/api/articles/notInCollection', 'POST', {id: id});
        const articlesFetched = await request('/api/articles/inCollection', 'POST', {id: id});


        setCollection(collectionsFetched.filter(item => item.id_collection == id)[0]);

        setFreeBooks(booksFreeFetched);
        setCollBooks(booksFetched);

        setFreeDocs(docsFreeFetched);
        setCollDocs(docsFetched);

        setFreeArticles(articleFreeFetched);
        setCollArticles(articlesFetched);

    }, [ request ]);

    useEffect(async () => {
       await fetchAllData();
    }, [ fetchAllData ]);

    const deleteBookFromCollection = async (bookId, colId) => {
        const deleted = await request('/api/books/deleteFromCollection', 'POST', {bookId, colId})
        const target = collBooks.filter(book => book.id_book == bookId)[0]
        setCollBooks(collBooks.filter(book => book.id_book != bookId))
        setFreeBooks([...freeBooks, target])
    }

    const deleteDocFromCollection = async (docId, colId) => {
        const deleted = await request('/api/documents/deleteFromCollection', 'POST', {docId, colId})
        const target = collDocs.filter(doc => doc.id_document == docId)[0]
        setCollDocs(collDocs.filter(doc => doc.id_document != docId))
        setFreeDocs([...freeDocs, target])
    }

    const deleteArtFromCollection = async (artId, colId) => {
        const deleted = await request('/api/articles/deleteFromCollection', 'POST', {artId, colId})
        const target = collArticles.filter(article => article.id_article == artId)[0]
        setCollArticles(collArticles.filter(article => article.id_article != artId))
        setFreeArticles([...freeArticles, target]);
    }

    const addBookInCollection = async (bookId, colId) => {
        const add = await request('/api/books/addInCollection', 'POST', {bookId, colId})
        setFreeBooks(freeBooks.filter(book => book.id_book != bookId))
        const target = freeBooks.filter(art => art.id_book == bookId)[0]
        setCollBooks([...collBooks, target]);
    }
    const addDocInCollection = async (docId, colId) => {
        const add = await request('/api/documents/addInCollection', 'POST', {docId, colId})
        setFreeDocs(freeDocs.filter(doc => doc.id_document != docId))
        const target = freeDocs.filter(doc => doc.id_document == docId)[0]
        setCollDocs([...collDocs, target])
        console.log(docId, colId)
    }
    const addArtInCollection = async (artId, colId) => {
        const add = await request('/api/articles/addInCollection', 'POST', {artId, colId})
        setFreeArticles(freeArticles.filter(art => art.id_article != artId))
        const target = freeArticles.filter(art => art.id_article == artId)[0]
        setCollArticles([...collArticles, target]);

    }

    if (loading) {
        return <Loader />
    }

    return (
        <>
            <div className={"staff"}>
                <div className="collection_btn__wrap">
                    {/*<button*/}
                    {/*    type={"submit"}*/}
                    {/*    onClick={setVisible}*/}
                    {/*    className={isBtnVisible ? "standard_btn collection_btn" : "hide_block"}>Добавить источник</button>*/}
                    <button
                        type={"submit"}
                        disabled={collBooks.length === 0 && collArticles.length === 0 && collDocs.length === 0}
                        onClick={downloadPdf}
                        className={"standard_btn collection_btn without_space"}>Сформировать отчет</button>
                </div>
                <h1 className={"staff_title__main"} style={{marginTop: '15px', marginBottom: '25px'}}>Название коллекции: {collection.name}</h1>
                {
                    collBooks.length === 0 && collArticles.length === 0 && collDocs.length === 0 && <h1>Нет элементов коллекции</h1>
                }
                <div className="staff_container">
                    {
                        collBooks.map((item, ind) => {
                            return <TargetItemBook key={ind} item={item} colId={id} onDeleteHandler={deleteBookFromCollection} />
                        })
                    }
                </div>
                <div className="staff_container">
                    {
                        collDocs.map((item, ind) => {
                            return <TargetItemDoc key={ind} item={item} colId={id} onDeleteHandler={deleteDocFromCollection} />
                        })
                    }
                </div>
                <div className="staff_container">
                    {
                        collArticles.map((item, ind) => {
                            return <TargetItemArticle key={ind} item={item} colId={id} onDeleteHandler={deleteArtFromCollection} />
                        })
                    }
                </div>

                <h1 className={isNewVisible ? "staff_title" : "hide_block"}>Источники, которые можно добавить</h1>
                <div className={isNewVisible ? "staff_container" : "hide_block"}>
                    {
                        freeBooks.map((item, ind) => {
                            return <FreeItemBook key={ind} item={item} colId={id} onAddHandler={addBookInCollection} />
                        })
                    }
                </div>
                <div className={isNewVisible ? "staff_container" : "hide_block"}>
                    {
                        freeDocs.map((item, ind) => {
                            return <FreeItemDoc key={ind} item={item} colId={id} onAddHandler={addDocInCollection} />
                        })
                    }
                </div>
                <div className={isNewVisible ? "staff_container" : "hide_block"}>
                    {
                        freeArticles.map((item, ind) => {
                            return <FreeItemArticle key={ind} item={item} colId={id} onAddHandler={addArtInCollection} />
                        })
                    }
                </div>
            </div>
        </>
    )
}