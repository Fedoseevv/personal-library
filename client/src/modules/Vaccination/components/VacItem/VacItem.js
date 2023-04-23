import './VacItem.css';
import './EditModal.css';
import {useState} from "react";
import {Modal} from "../../../../components/modal/Modal";

export const VacItem = ({ item, onDeleteHandler, onEditHandler }) => {
    const [ modalActive, setModalActive ] = useState(false);
    const [ form, setForm ] = useState({
        vac_name: item.vac_name,
        vac_descr: item.vac_descr,
        contraindication: item.contraindication
    });
    const contraindication = item.contraindication.split('; ');
    const changeHandler = event => {
        console.log(event.target.value);
        setForm({...form, [event.target.name]: event.target.value})
    }

    return (
        <div className={"vacPage_item"}>
            <div className="vacPage_item__container">
                <div className="vacPage_item__name">{item.vac_name}</div>
                <div className="vacPage_item__descr">Описание: <span>{item.vac_descr}</span></div>
                <div className="vacPage_item__subtitle">Противопоказания:</div>
                <ol className={"vacPage_item__contr"}>
                    {
                        contraindication.map((item, i) => {
                            return <li>{i + 1}. {item}</li>
                        })
                    }
                </ol>
                <div className="vacItem_btns">
                    <button
                        type={"submit"}
                        className={"standard_btn vacItem_btn"}
                        onClick={e => setModalActive(true)}>Редактировать</button>
                    <button
                        type={"submit"}
                        className={"standard_btn vacItem_btn"}
                        onClick={e => onDeleteHandler(item.vac_name)} >Удалить</button>
                </div>
            </div>
            <Modal active={modalActive} setActive={setModalActive}>
                <div className="edit_modal">
                    <div className="edit_modal__title">Редактирование информации</div>
                    <div className="edit_modal__wrap">
                        <div className="standard_input__wrap">
                            <input type="text"
                                   value={form.vac_name}
                                   name={"vac_name"}
                                   placeholder={"Введите название вакцины"}/>
                        </div>
                        <div className="standard_input__wrap">
                            <input type="text"
                                   value={form.vac_descr}
                                   name={"vac_descr"}
                                   onChange={changeHandler}
                                   placeholder={"Введите описание вакцины"}/>
                        </div>
                        <div className="standard_input__wrap">
                            <input type="text"
                                   value={form.contraindication}
                                   name={"contraindication"}
                                   onChange={changeHandler}
                                   placeholder={"Введите противопоказания вакцины"}/>
                        </div>
                        <div className="edit_modal__btns">
                            <button
                                type={"submit"}
                                onClick={e => onEditHandler(form)}
                                className={"standard_btn edit_modal__btn"}>Сохранить изменения</button>
                            <button
                                type={"submit"}
                                onClick={e => setModalActive(false)}
                                className={"standard_btn edit_modal__btn"}>Отмена</button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}