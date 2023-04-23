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

    const fetchStaff = useCallback(async () => {
        const fetched = await request('/api/books/all', 'GET');
        const docsFetched = await request('/api/documents/all', 'GET')
        const articlesFetched = await request('/api/articles/all', 'GET')
        setBooks(fetched);
        setDocs(docsFetched)
        setArticles(articlesFetched)
    }, [ request ]);

    useEffect(async () => {
        await fetchStaff();
    }, [fetchStaff]);

    const onDeleteHandler = async (user_id) => {
        console.log(`Увольняем: ${user_id}`);
        const res = await request(`/api/staff/delete/${user_id}`);
        await fetchStaff();
    }

    const onEditHandler = async (body) => {
        console.log(body);
        const res = await request('/api/staff/edit', 'POST', body);
        await fetchStaff();
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
                                          onEditHandler={onEditHandler}
                                          onDeleteHandler={onDeleteHandler} /> }
                <button
                    type={"submit"}
                    onClick={() => history.push('/addEmp')}
                    className={"standard_btn"}>Добавить источник</button>
            </div>
        </>
    );
}