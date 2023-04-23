import './PharmaOrdersItem.css';
import {useHistory} from "react-router-dom";
import {useHttp} from "../../hooks/httpHook";
import {useState} from "react";
import './OrderModal.css';

import {Modal} from "../modal/Modal";
import {useInput} from "../../hooks/validationHook";
import {changeDate, onlyDigit} from "../../helpfulFunctions/validationFunctions";

export const PharmaOrdersItem = ({ item, onCancelHandler, onConfirmHandler }) => {
    const { order_id, name, count, order_date, delivery_date, isdelivered, total_price } = item;
    const endDate = useInput('', {isEmpty: true, isDate: true});
    const mPrice = useInput('', { isEmpty: true, isDigit: true });
    const rec = useInput('', { isEmpty: true });
    const history = useHistory();
    const { loading, request } = useHttp();
    const [modalActive, setModalActive] = useState(false);

    const prepareData = () => {
        const body = {
            ...item,
            cost: mPrice.value,
            end_date: endDate.value,
            recomendation: rec.value
        }
        onConfirmHandler(body);
    }

    return (
      <div className="PharmaOrder_item">
          <div className="PharmaOrder_item__container">
              <div className="PharmaOrder_item__info">
                  <div className="PharmaOrder_item__id">Идентификатор заказа: <span>{order_id}</span></div>
                  <div className="PharmaOrder_item__name">Название препарата: <span>{name}</span></div>
                  <div className="PharmaOrder_item__count">Количество: <span>{count}</span></div>
                  <div className="PharmaOrder_item__total">Стоимость заказа: <span>{total_price}</span> ₽</div>
                  <div className="PharmaOrder_item__date">Дата заказа: <span>{new Date(Date.parse(order_date)).toLocaleDateString()}</span></div>
                  <div className="PharmaOrder_item__delivery">Ориентировочная дата доставки: <span>{delivery_date.slice(0, 10)}</span></div>
                  <div
                      className={isdelivered ? "PharmaOrder_item__isDelivery green" : "PharmaOrder_item__isDelivery red"}
                  >Статус заказа: <span>{isdelivered ? 'Заказ доставлен' : 'Заказ не доставлен'}</span></div>
              </div>
              <div className="PharmaOrder_actions">
                  <div className="PharmaOrder_actions__title">Заказ доставлен?</div>
                  <div className="PharmaOrder_btns__wrap">
                      <button
                          onClick={() => setModalActive(true)}
                          type={"submit"}
                          className="standard_btn PharmaOrder_btn">Подтвердить доставку</button>
                      <button
                          onClick={() => onCancelHandler(order_id)}
                          type={"submit"}
                          className="standard_btn PharmaOrder_btn">Отменить заказ</button>
                  </div>
              </div>
          </div>
          <Modal active={modalActive} setActive={setModalActive}>
              <div className="order_modal__info">
                  <div className="order_modal__id">Номер заказа: <span>{order_id}</span></div>
                  <div className="order_modal__name">Название препарата: <span>{name}</span></div>
                  <div className="order_modal__count">Количество: <span>{count}</span> шт.</div>
                  <div className="order_modal__price">Общая стоимость: <span>{total_price}</span> ₽</div>
                  <div className="order_modal__price">Закупочная цена за штуку: <span>{total_price / count}</span> ₽</div>
                  <div className="order_modal__endDate">Дата заказа: <span>{new Date(Date.parse(order_date)).toLocaleDateString()}</span></div>
                  <div className="standard_input__wrap">
                      {(endDate.isDirty && endDate.isEmpty) && <div className="incorrect_value">Поле не может быть пустым</div>}
                      <input
                          placeholder={"Укажите срок годности"}
                          type="text" value={endDate.value}
                          onChange={e => endDate.onChange(e)}
                          onBlur={e => endDate.onBlur(e)}
                          onInput={e => changeDate(e)}
                      />
                  </div>
                  <div className="standard_input__wrap">
                      {(mPrice.isDirty && mPrice.isEmpty) && <div className="incorrect_value">Поле не может быть пустым</div>}
                      <input placeholder={"Введите стоимость для продажи"}
                             type="text"
                             value={mPrice.value}
                             onChange={e => mPrice.onChange(e)}
                             onBlur={e => mPrice.onBlur(e)}
                             onInput={e => onlyDigit(e)}/>
                  </div>
                  <div className="standard_input__wrap">
                      {(rec.isDirty && rec.isEmpty) && <div className="incorrect_value">Поле не может быть пустым</div>}
                      <input
                          value={rec.value}
                          onChange={e => rec.onChange(e)}
                          onBlur={e => rec.onBlur(e)}
                          placeholder={"Укажите рекомендации по назначению"}
                          type="text"/>
                  </div>
                  <div className="order_form__btns">
                      <button
                          className="standard_btn order_form__btn"
                          type={"submit"}
                          disabled={loading || !endDate.inputValid || !mPrice.inputValid || !rec.inputValid }
                          onClick={prepareData}>Подтвердить получение</button>
                  </div>
              </div>
          </Modal>
      </div>
    );
}
