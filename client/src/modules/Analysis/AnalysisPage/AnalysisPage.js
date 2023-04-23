import './AnalysisPage.css';
import {useHttp} from "../../../hooks/httpHook";
import {useCallback, useEffect, useState} from "react";
import {AnalysisList} from "../AnalysisList/AnalysisList";
import {useHistory} from "react-router-dom";
import {Modal} from "../../../components/modal/Modal";
import {useInput} from "../../../hooks/validationHook";

export const AnalysisPage = () => {
    const { loading, request } = useHttp();
    const [ analysis, setAnalysis ] = useState([]);
    const [ analysisType, setAnalysisType ] = useState([]);
    const [ patients, setPatients ] = useState([]);
    const [ addModalActive, setAddModalActive ] = useState(false);
    const [ recordModalActive, setRecordModalActive ] = useState(false);
    const [ recordForm, setRecordForm ] = useState({
        analysisType: '',
        user_id: ''
    });
    const history = useHistory();
    const analyzeName = useInput('', { isEmpty: true });
    const analyzeDescr = useInput('', { isEmpty: true });

    const fetchAnalysis = useCallback(async () => {
        const fetched = await request('/api/analysis/inProcess', 'GET');
        setAnalysis(fetched);
    }, [ request ]);

    const fetchAnalysisType = async () => {
        const fetched = await request('/api/analysis/types', 'GET');
        setAnalysisType(fetched);
    }
    const fetchPatients = async () => {
        const fetched = await request('/api/patients/', 'GET');
        setPatients(fetched);
    }

    const openAddRecord = async () => {
        await fetchAnalysisType();
        await fetchPatients();
        setRecordModalActive(true);
    }

    const addNewAnalyze = async () => {
        const body = {
            name: analyzeName.value,
            descr: analyzeDescr.value
        }
        console.log(body);
        const res = await request('/api/analysis/addNewType', 'POST', body);
        analyzeName.value = "";
        analyzeDescr.value = "";
        setAddModalActive(false);
    }

    const addNewRecord = async () => {
        console.log(recordForm);
        const res = await request('/api/analysis/addRecord', 'POST', {...recordForm});
        await fetchAnalysis();
        setRecordModalActive(false);
    }

    const changeHandler = event => {
        console.log(`${event.target.name}: ${event.target.value}`);
        setRecordForm({ ...recordForm, [event.target.name]: event.target.value })
    }

    const deleteHandler = async (an_id) => {
        const res = await request(`/api/analysis/deleteRecord/${an_id}`, 'GET');
        await fetchAnalysis();
    }

    const updateRecord = async (body) => {
        const res = await request('/api/analysis/updateRecord', 'POST', body);
        await fetchAnalysis();
    }

    useEffect(async () => {
        await fetchAnalysis();
    }, [ fetchAnalysis ]);

    if (loading) {
        return <h1>Loading...</h1>
    }

    return (
        <div className={"analysis"}>
            <div className="analysis_container">
                <h1 className="analysis_title">Направления, ожидающие заполнения</h1>
                <div className="analysis_content">
                    { !loading && <AnalysisList
                                        items={analysis}
                                        updateRecord={updateRecord}
                                        deleteHandler={deleteHandler} /> }
                </div>
                <div className="analysis_btns">
                    <button
                        type={"submit"}
                        onClick={openAddRecord}
                        className={"standard_btn analysis_btn"}>Добавить новую запись</button>
                    <button
                        type={"submit"}
                        onClick={() => setAddModalActive(true)}
                        className={"standard_btn analysis_btn"}>Добавить новый вид анализа</button>
                </div>
            </div>
            <Modal active={recordModalActive} setActive={setRecordModalActive}>
                <div className="analysis_addModal">
                    <div className="analysis_addModal__container">
                        <h1 className="analysis_addModal__title">Добавление новой записи об анализах</h1>
                        <div className="analysis_addModal__content">
                            <div className="analysis_addModal__subtitle">Выберите вид анализа</div>
                            <select onClick={changeHandler}
                                    className={"analysis_addModal__select"}
                                    name="analysisType" id="analysisType">
                                {
                                    analysisType.map(item => {
                                        return <option value={item.id}>{item.type}</option>
                                    })
                                }
                            </select>

                            <div className="analysis_addModal__subtitle">Выберите пациента</div>
                            <select onClick={changeHandler}
                                className={"analysis_addModal__select"}
                                name="user_id" id="user_id">
                                {
                                    patients.map(item => {
                                        return <option value={item.user_id}>{item.l_name + " " + item.f_name + " " + item.m_name + " - Паспорт РФ: " + item.pass_num}</option>
                                    })
                                }
                            </select>
                            <div className="analysis_addModal__btns">
                                <button
                                    type={"submit"}
                                    onClick={addNewRecord }
                                    disabled={recordForm.analysisType.length === 0
                                        || recordForm.user_id.length === 0}
                                    className={"standard_btn analysis_addModal__btn"}>Сохранить</button>
                                <button
                                    type={"submit"}
                                    onClick={() => setRecordModalActive(false)}
                                    className={"standard_btn analysis_addModal__btn"}>Отмена</button>
                            </div>
                        </div>
                        </div>
                    </div>
            </Modal>

            <Modal active={addModalActive} setActive={setAddModalActive}>
                <div className="analysis_addModal">
                    <div className="analysis_addModal__container">
                        <h1 className="analysis_addModal__title">Добавление нового вида анализа</h1>
                        <div className="analysis_addModal__content">
                            <div className={"standard_input__wrap"}>
                                {(analyzeName.isDirty && analyzeName.isEmpty)
                                    && <div className="incorrect_value">Поле не может быть пустым</div>}
                                <input
                                    placeholder={"Введите тип/название анализа"}
                                    value={analyzeName.value}
                                    onBlur={e => analyzeName.onBlur(e)}
                                    onChange={e => analyzeName.onChange(e)}
                                    type="text"/>
                            </div>
                            <div className={"standard_input__wrap"}>
                                {(analyzeDescr.isDirty && analyzeDescr.isEmpty)
                                    && <div className="incorrect_value">Поле не может быть пустым</div>}
                                <input
                                    placeholder={"Введите описание анализа"}
                                    value={analyzeDescr.value}
                                    onBlur={e => analyzeDescr.onBlur(e)}
                                    onChange={e => analyzeDescr.onChange(e)}
                                    type="text"/>
                            </div>
                            <div className="analysis_addModal__btns">
                                <button
                                    type={"submit"}
                                    onClick={addNewAnalyze}
                                    disabled={analyzeName.value.length === 0 || analyzeDescr.value.length === 0 || loading}
                                    className={"standard_btn analysis_addModal__btn"}>Сохранить</button>
                                <button
                                    type={"submit"}
                                    onClick={() => setAddModalActive(false)}
                                    className={"standard_btn analysis_addModal__btn"}>Отмена</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}