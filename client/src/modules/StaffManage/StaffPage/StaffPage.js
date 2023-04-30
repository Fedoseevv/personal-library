import './StaffPage.css';
import {useHttp} from "../../../hooks/httpHook";
import {useCallback, useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {StaffList} from "../StaffList/StaffList";

export const StaffPage = () => {
    const { loading, request } = useHttp();
    const [ books, setBooks ] = useState([]);
    const [ docs, setDocs ] = useState([]);
    const [ articles, setArticles ] = useState([]);

    const history = useHistory();

    const fetchSources = useCallback(async () => {
        const fetched = await request('/api/books/all', 'GET');
        const docsFetched = await request('/api/documents/all', 'GET')
        const articlesFetched = await request('/api/articles/all', 'GET')
        setBooks(fetched);
        setDocs(docsFetched)
        setArticles(articlesFetched)
    }, [ request ]);

    useEffect(async () => {
        await fetchSources();
    }, [fetchSources]);

    const onDeleteArticle = async (id) => {
        console.log(id)
        const deleted = await request('/api/articles/delete', 'POST', {id});
        await fetchSources();
    }

    const onDeleteBook = async (id) => {
        const deleted = await request('/api/books/delete', 'POST', {id})
        await fetchSources();
    }

    const onDeleteDoc = async (id) => {
        const deleted = await request('/api/documents/delete', 'POST', {id})
        await fetchSources();
    }

    if (loading) {
        return <h1>Loading...</h1>
    }

    return (
        <>
            <div className={"staff"}>
                { !loading &&  <StaffList books={books}
                                          docs={docs}
                                          articles={articles}
                                          onDeleteBook={onDeleteBook}
                                          onDeleteDoc={onDeleteDoc}
                                          onDeleteArticle={onDeleteArticle} /> }
                <button
                    type={"submit"}
                    onClick={() => history.push('/addEmp')}
                    className={"standard_btn"}>Добавить источник</button>
            </div>
        </>
    );
}