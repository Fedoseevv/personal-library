import './AddCollection.css';
import {useInput} from "../../../hooks/validationHook";
import {useHttp} from "../../../hooks/httpHook";
import {useHistory} from "react-router-dom";
import {Loader} from "../../../components/loader/Loader";

export const AddCollection = () => {
    const title = useInput('', {isEmpty: true, minLength: 1})
    const { loading, request } = useHttp();
    const history = useHistory();

    const registerHandler = async () => {
        try {
            const form = {
                name: title.value
            }
            console.log(form);
            await request('/api/collections/add', 'POST', {...form});
            history.push('/collections');
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
        </div>
    )
}