import './AddVacList.css';
import {useHttp} from "../../../hooks/httpHook";
import {useHistory} from "react-router-dom";
import {useInput} from "../../../hooks/validationHook";

export const AddVacList = () => {
    const { loading, request } = useHttp();
    const history = useHistory();
    const name = useInput('', { isEmpty: true });
    const descr = useInput('', { isEmpty: true });
    const contr = useInput('', { isEmpty: true });

    const registerVac = async () => {
        const body = {
            vacName: name.value,
            vacDescr: descr.value,
            contraindication: contr.value
        }
        console.log(body);
        await request('/api/vac/addVac', 'POST', body)
            .then(response => {
                console.log(response);
                history.push('/vacList');
            })
    }

    // /api/vac/addVac
    return (
        <div className={"addVacList"}>
            <div className="addVacList_container">
                <h1 className="addVacList_title">Добавление вакцины</h1>
                <div className="addVacList_form">
                    <div className="standard_input__wrap">
                        {(name.isDirty && name.isEmpty)
                            && <div className="incorrect_value addVacList_incorrect__value">Поле не может быть пустым</div>}
                        <input type="text"
                               placeholder={"Введите название"}
                               value={name.value}
                               onChange={e => name.onChange(e)}
                               onBlur={e => name.onBlur(e)}/>
                    </div>
                    <div className="standard_input__wrap">
                        {(descr.isDirty && descr.isEmpty)
                            && <div className={"incorrect_value addVacList_incorrect__value"}>Поле не может быть пустым</div>}
                        <input type="text"
                               placeholder={"Введите описание"}
                               value={descr.value}
                               onChange={e => descr.onChange(e)}
                               onBlur={e => descr.onBlur(e)}/>
                    </div>
                    <div className="standard_input__wrap">
                        {(contr.isDirty && contr.isEmpty)
                            && <div className={"incorrect_value addVacList_incorrect__value"}>Поле не может быть пустым</div>}
                        <input type="text"
                               placeholder={"Введите противопоказания"}
                               value={contr.value}
                               onChange={e => contr.onChange(e)}
                               onBlur={e => contr.onBlur(e)}/>
                    </div>
                    <div className="addVacList_btns">
                        <button
                            onClick={registerVac}
                            type={"submit"}
                            disabled={ loading || !name.inputValid || !descr.inputValid || !contr.inputValid }
                            className="standard_btn addVacList_btn">Добавить вакцину</button>
                        <button
                            type={"submit"}
                            onClick={() => history.push('/vacList')}
                            className={"standard_btn addVacList_btn"}>Назад</button>
                    </div>
                </div>
            </div>
        </div>
    );
}