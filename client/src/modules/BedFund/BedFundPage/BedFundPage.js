import './BedFundPage.css';
import {useHttp} from "../../../hooks/httpHook";
import {useCallback, useEffect, useState} from "react";
import {BedFundList} from "../BedFundList/BedFundList";
import {Modal} from "../../../components/modal/Modal";

export const BedFundPage = () => {
    const { loading, request } = useHttp();
    const [ beds, setBeds ] = useState([]);

    const [ deleteModal, setDeleteModal ] = useState(false);
    const [ delRoom, setDelRoom ] = useState(null);

    const [ addModal, setAddModal ] = useState(false);
    const [ newRoom, setNewRoom ] = useState({
        roomNumber: null,
        bedNumbers: []
    });

    const fetchBeds = useCallback(async () => {
        const fetched = await request('/api/bedFund', 'GET');
        setBeds(fetched);
    }, [ request ]);

    const closeBed = async (bedId) => {
        const res = await request(`/api/bedFund/close/${bedId}`);
        await fetchBeds();
    }
    const openBed = async (bedId) => {
        const res = await request(`/api/bedFund/open/${bedId}`);
        await fetchBeds();
    }

    const addRoom = async () => {
        console.log(newRoom)
        const fetched = await request('/api/bedFund/add', 'POST', {...newRoom})
        setAddModal(false)
        await fetchBeds();
    }

    const parseNewRoom = (e) => {
        if (e.target.name === "bedNumbers") {
            setNewRoom({...newRoom, bedNumbers: e.target.value.split(" ")})
        } else if (e.target.name === "roomNumber") {
            setNewRoom({...newRoom, roomNumber: e.target.value});
        }
    }
    const deleteRoom = async () => {
        console.log(delRoom)
        const fetched = await request(`/api/bedFund/delete/${delRoom}`, 'GET');
        setDeleteModal(false);
        await fetchBeds();
    }


    useEffect(async () => {
        await fetchBeds();
    }, [ fetchBeds ]);


    if (loading) {
        return <h1>Loading...</h1>
    }

    return (
      <div className={"bedFund"}>
          <div className="bedFund_container">
              <h1 className="bedFund_title">Коечный фонд медицинской организации</h1>
              <div className="bedFund_content">
                  { !loading && <BedFundList
                                    items={beds}
                                    closeBed={closeBed}
                                    openBed={openBed} /> }
              </div>
              <div className="bedFund_btns">
                  <button
                      type={"submit"}
                      onClick={() => setAddModal(true)}
                      className={"standard_btn bedFund_btn"}>Добавить палату</button>
                  <button
                      type={"submit"}
                      onClick={() => setDeleteModal(true)}
                      className={"standard_btn bedFund_btn"}>Удалить палату</button>
              </div>
          </div>
          <Modal active={addModal} setActive={setAddModal}>
              <div className={"bedFund_modal"}>
                  <div className="bedFund_modal__container">
                      <div className="bedFund_modal__title">Добавление палаты</div>
                      <div className="bedFund_modal__content">
                          <div className={"standard_input__wrap"}>
                              <input
                                  placeholder={"Введите номер палаты"}
                                  onChange={parseNewRoom}
                                  name={"roomNumber"}
                                  type="text"/>
                          </div>
                          <div className={"standard_input__wrap"}>
                              <input
                                  placeholder={"Введите номера койко-мест через пробел"}
                                  onChange={parseNewRoom}
                                  name={"bedNumbers"}
                                  type="text"/>
                          </div>
                      </div>
                      <div className="bedFund_modal__btns">
                          <button
                              type={"submit"}
                              onClick={addRoom}
                              className={"standard_btn bedFund_modal__btn"}>
                              Подтвердить
                          </button>
                          <button
                              type={"submit"}
                              onClick={() => setAddModal(false)}
                              className={"standard_btn bedFund_modal__btn"}>Отмена</button>
                      </div>
                  </div>
              </div>
          </Modal>
          <Modal active={deleteModal} setActive={setDeleteModal}>
              <div className={"bedFund_modal"}>
                  <div className="bedFund_modal__container">
                      <div className="bedFund_modal__title">Удаление палаты</div>
                      <div className="bedFund_modal__content">
                          <div className={"standard_input__wrap"}>
                              <input
                                  placeholder={"Введите номер палаты"}
                                  onChange={e => setDelRoom(e.target.value)}
                                  type="text"/>
                          </div>
                      </div>
                      <div className="bedFund_modal__btns">
                          <button
                              type={"submit"}
                              onClick={deleteRoom}
                              className={"standard_btn bedFund_modal__btn"}>
                              Подтвердить
                          </button>
                          <button
                              type={"submit"}
                              onClick={() => setDeleteModal(false)}
                              className={"standard_btn bedFund_modal__btn"}>Отмена</button>
                      </div>
                  </div>
              </div>
          </Modal>
      </div>
    );
}