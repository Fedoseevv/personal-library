import './CollectionPage.css';
import {useHttp} from "../../../hooks/httpHook";
import {useCallback, useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {CollectionList} from "../CollectionList/CollectionList";
import {Loader} from "../../../components/loader/Loader";

export const CollectionPage = () => {
    const { loading, request } = useHttp();
    const [ collections, setCollections ] = useState([]);
    const [ books, setBooks ] = useState([]);
    const [ docs, setDocs ] = useState([]);
    const [ articles, setArticles ] = useState([]);
    const [ msg, setMsg ] = useState("");

    const hist = useHistory();

    const fetchAllSources = useCallback(async () => {
        const collectionsFetched = await request('/api/collections/all', 'GET');
        const booksFetched = await request('/api/books/all', 'GET');
        const docsFetched = await request('/api/documents/all', 'GET')
        const articlesFetched = await request('/api/articles/all', 'GET');
        setCollections(collectionsFetched);
        setBooks(booksFetched);
        setDocs(docsFetched)
        setArticles(articlesFetched)
    }, [ request ]);

    const openCollection = (id) => {
      console.log("open collection:" + id)
        console.log(collections.length)
        // hist.push('/addCollection')
    }

    const onDeleteHandler = async (id_collection) => {
        const body = {
            id: id_collection
        }
        const res = await request('/api/collections/delete', 'POST', body);
        await fetchAllSources();
    }


    useEffect(async () => {
        await fetchAllSources();
    }, [fetchAllSources]);

    if (loading) {
        return <Loader />
    }


    return (
        <>
            <div className={"staff"} id={"report"}>
                <button
                    type={"submit"}
                    onClick={() => hist.push('/addCollection')}
                    className={"standard_btn without_space"} style={{marginBottom: "20px"}}>Добавить коллекцию</button>
                <h1 className={"staff_title"}>Мои коллекции</h1>
                <div className="collection_wrap">
                    {
                        !loading && <CollectionList collections={collections}
                                                    openCollection={openCollection}
                                                    onDeleteHandler={onDeleteHandler} />

                    }
                </div>
            </div>
        </>
    )
}

