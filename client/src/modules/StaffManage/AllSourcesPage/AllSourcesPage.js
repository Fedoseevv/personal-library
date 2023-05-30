import './AllSourcesPage.css';
import {useHttp} from "../../../hooks/httpHook";
import {useCallback, useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {AllSourcesList} from "../AllSourcesList/AllSourcesList";
import {Loader} from '../../../components/loader/Loader';
import {useAuth} from "../../../hooks/auth";

export const AllSourcesPage = () => {
    const auth = useAuth()
    const { loading, request } = useHttp();
    const [ books, setBooks ] = useState([]);
    const [ visibleBooks, setVisibleBooks ] = useState([]);
    const [ docs, setDocs ] = useState([]);
    const [ visibleDocs, setVisibleDocs ] = useState([]);
    const [ articles, setArticles ] = useState([]);
    const [ visibleArticles, setVisibleArticles ] = useState([]);
    const [ authors, setAuthors ] = useState([]);

    const [searchStr, setSearchStr] = useState('');

    const history = useHistory();

    const test = useCallback(async () => {
        try {
            const token = await JSON.parse(localStorage.getItem('userData')).token
            const isAuthenticated = await request('/api/user/auth', 'GET', null, {
                Authorization: `Bearer ${token}`
            })
        } catch (e) {
            console.log("Пользователь неавторизован")
            auth.logout()
            window.location.reload()
        }

    }, [])

    useEffect(() => {
        test()
    }, [test])

    const fetchSources = useCallback(async () => {
        console.log("fetch sources")
        const fetched = await request('/api/books/all', 'GET');
        const docsFetched = await request('/api/documents/all', 'GET')
        const articlesFetched = await request('/api/articles/all', 'GET')
        setBooks(fetched);
        setVisibleBooks(fetched);
        setDocs(docsFetched)
        setVisibleDocs(docsFetched)
        setArticles(articlesFetched)
        setVisibleArticles(articlesFetched)
    }, [ request ]);

    useEffect(async () => {
        await fetchSources();
    }, [fetchSources]);

    const fetchAuthors = useCallback(async () => {
        console.log("fetch authors")
        const authorsFetched = await request(`/api/author/all`, 'GET');
        setAuthors(authorsFetched);
    }, [  ]);

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

    const onChangeSearch = (e) => {
        const str = e.target.value || ''
        console.log(e.target.value)
        const updatedBooks = books.filter(book => book.title.toLowerCase().includes(str.toLowerCase()))
        setVisibleBooks([...updatedBooks])

        const updatedDocs = docs.filter(doc => doc.title.toLowerCase().includes(str.toLowerCase()))
        setVisibleDocs([...updatedDocs])

        const updatedArticles = articles.filter(art => art.title.toLowerCase().includes(str.toLowerCase()))
        setVisibleArticles([...updatedArticles])
    }

    if (loading) {
        return <Loader />
    }

    return (
        <>
            <div className={"staff"}>
                {/*<div className="staff_title__main">Действия</div>*/}
                {/*<button*/}
                {/*    type={"submit"}*/}
                {/*    style={{marginRight: 0, marginBottom: '25px'}}*/}
                {/*    onClick={() => history.push('/addEmp')}*/}
                {/*    className={"standard_btn"}>Добавить источник</button>*/}
                <div className="staff_title__main">Литературные источники</div>
                <form>
                    <input onChange={onChangeSearch} type="text" placeholder="Искать здесь..." />
                    <button type="submit"></button>
                </form>
                { !loading &&  <AllSourcesList books={visibleBooks}
                                               docs={visibleDocs}
                                               articles={visibleArticles}
                                               authors={authors}
                                               onDeleteBook={onDeleteBook}
                                               onDeleteDoc={onDeleteDoc}
                                               onDeleteArticle={onDeleteArticle} /> }
            </div>
        </>
    );
}