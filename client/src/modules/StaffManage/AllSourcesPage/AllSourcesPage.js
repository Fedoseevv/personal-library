import './AllSourcesPage.css';
import {useHttp} from "../../../hooks/httpHook";
import {useCallback, useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {AllSourcesList} from "../AllSourcesList/AllSourcesList";
import {Loader} from '../../../components/loader/Loader';

export const AllSourcesPage = () => {
    const { loading, request } = useHttp();
    const [ books, setBooks ] = useState([]);
    const [ docs, setDocs ] = useState([]);
    const [ articles, setArticles ] = useState([]);
    const [ authors, setAuthors ] = useState([]);

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

    const fetchAuthors = useCallback(async () => {
        const authorsFetched = await request(`/api/author/all`, 'GET');
        setAuthors(authorsFetched);
    }, [ request ]);

    useEffect(async () => {
        await fetchAuthors();
    }, [ fetchAuthors ]);

    const onDeleteArticle = async (id) => {
        console.log(id)
        const deleted = await request('/api/articles/delete', 'POST', {id});
        const filteredArt = articles.filter(item => item.id_article != id);
        setArticles([...filteredArt])
        await fetchSources();
    }

    const onDeleteBook = async (id) => {
        const deleted = await request('/api/books/delete', 'POST', {id})
        console.log(id);
        const filteredBooks = books.filter(item => item.id_book != id)
        setBooks([...filteredBooks])
        await fetchSources();
    }

    const onDeleteDoc = async (id) => {
        const deleted = await request('/api/documents/delete', 'POST', {id})
        const filteredDocs = docs.filter(item => item.id_document != id);
        setDocs([...filteredDocs]);
        await fetchSources();
    }

    if (loading) {
        return <Loader />
    }

    return (
        <>
            <div className={"staff"}>
                { !loading &&  <AllSourcesList books={books}
                                               docs={docs}
                                               articles={articles}
                                               authors={authors}
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