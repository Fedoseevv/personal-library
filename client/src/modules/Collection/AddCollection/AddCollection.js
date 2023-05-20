import './AddCollection.css';
import {useInput} from "../../../hooks/validationHook";
import {useHttp} from "../../../hooks/httpHook";
import {useHistory} from "react-router-dom";
import {Loader} from "../../../components/loader/Loader";
import {useCallback, useEffect, useState} from "react";
import {Modal} from "../../../components/modal/Modal";

export const AddCollection = () => {
    const title = useInput('', {isEmpty: true, minLength: 1})
    const { loading, request } = useHttp();
    const history = useHistory();
    const [collections, setCollections] = useState([])
    const [modalActive, setModalActive] = useState(false)

    const fetchCollections = useCallback(async () => {
        const collectionsFetched = await request('/api/collections/all', 'GET');
        setCollections(collectionsFetched);
    }, [ request ]);

    useEffect(async () => {
        await fetchCollections();
    }, [fetchCollections]);

    const registerHandler = async () => {
        try {
            const form = {
                name: title.value
            }
            console.log(form);
            const findByName = collections.filter(item => item.name === title.value)
            if (findByName.length > 0) {
                console.log("Такая уже есть")
                setModalActive(true)
                title.setValue("")
            } else {
                await request('/api/collections/add', 'POST', {...form});
                history.push('/collections');
            }
        } catch (e) {} // Пустой, т.к мы его уже обработали в хуке
    }

    if (loading) {
        return <Loader />
    }


    return (
        <div className="add_patient">
            <div className="add_patient__container">
                <h1 className="add_patient__header">Добавление коллекции</h1>
                <div className="addPat_form__wrap">
                    <div className="addCol_form">
                        <div className="addPat_form__input">
                            {(title.isDirty && title.minLengthError)
                                && <div className="incorrect_value">Необходимо указать название</div>}
                            <input
                                placeholder="Введите название коллекции"
                                id="title"
                                type="text"
                                name="title"
                                value={title.value}
                                onChange={e => title.onChange(e)}
                                onBlur={e => title.onBlur(e)}/>
                        </div>
                        <button
                            onClick={registerHandler}
                            className="standard_btn addPat_form__btn"
                            disabled={loading || !title.inputValid}
                        >Сохранить
                        </button>
                    </div>
                </div>
            </div>
            <Modal active={modalActive} setActive={setModalActive}>
                <div className={"collection_modal"}>
                    <h1 className={"staff_title__main"}>Коллекция с таким именем уже существует</h1>
                    <button
                        type={"submit"}
                        onClick={e => setModalActive(false)}
                        className={"standard_btn staff_schedule__btn"}>Закрыть</button>
                </div>
            </Modal>
        </div>
    )
}