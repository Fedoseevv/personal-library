import {Switch, Route, Redirect} from "react-router-dom";
import {MainPage} from "./pages/MainPage/MainPage";
import {AddEmployee} from './pages/AddBook/AddEmployee';
import {StatisticPage} from "./modules/Statistic/StatisticPage/StatisticPage";
import {AuthPage} from "./pages/AuthPage/AuthPage";
import {AddPatient} from "./pages/AddDoc/AddPatient";
import {PharmacyPage} from "./pages/PharmacyPage/PharmacyPage";
import {AddArticle} from "./pages/AddPharmPage/AddArticle";
import {PharmaOrders} from "./pages/PharmaOrders/PharmaOrders";
import {AmbulancePage} from "./pages/AmbulancePage/AmbulancePage";
import {AddAmbulancePage} from "./pages/AddAmbulancePage/AddAmbulancePage";
import {AmbulanceCallPage} from "./pages/AmbulanceCallPage/AmbulanceCallPage";
import {AmbulanceCalls} from "./pages/AmbulanceCalls/AmbulanceCalls";
import {FindPatientPage} from "./pages/FindPatientPage/FindPatientPage";
import {PatientPage} from "./pages/PatientPage/PatientPage";
import {AddVacList} from "./modules/Vaccination/AddVacList/AddVacList";
import {VacPage} from "./modules/Vaccination/VacPage/VacPage";
import {AddVacRecord} from "./modules/Vaccination/AddVacRecord/AddVacRecord";
import {StaffPage} from "./modules/StaffManage/StaffPage/StaffPage";
import {DocVisits} from "./modules/PatientRecords/DocVisits/DocVisits";
import {AddPatientRecord} from "./modules/PatientRecords/AddPatientRecord/AddPatientRecord";
import {PatientVacsPage} from "./modules/PatientVacs/PatientVacsPage/PatientVacsPage";
import {DocRecordsPage} from "./modules/DocRecords/DocRecordsPage/DocRecordsPage";
import {BedFundPage} from "./modules/BedFund/BedFundPage/BedFundPage";
import {AnalysisPage} from "./modules/Analysis/AnalysisPage/AnalysisPage";
import {VisHistory} from "./modules/VisHistory/VisHistoryPage/VisHistory";
import {PatManagePage} from "./modules/PatManage/PatManagePage/PatManagePage";
import {PaymentPage} from "./modules/Payment/PaymentPage/PaymentPage";
import {CollectionPage} from "./modules/Collection/CollectionPage/CollectionPage";
import {AddCollection} from "./modules/Collection/AddCollection/AddCollection";
import {TargetCollection} from "./modules/Collection/TargetCollection/TargetCollection";
import {SearchPage} from "./modules/Search/SearchPage";
import {AddAuthor} from "./modules/Author/AddAuthor/AddAuthor";
import {AuthorPage} from "./modules/Author/AuthorPage";

export const useRoutes = isAuthenticated => {
    if (isAuthenticated) {
        return (
            <Switch>
                <Route path="/addEmp" exact>
                    <AddEmployee/>
                </Route>

                <Route path={"/collections"}>
                    <CollectionPage />
                </Route>
                <Route path={"/collection/:id"}>
                    <TargetCollection />
                </Route>
                <Route path={"/addCollection"}>
                    <AddCollection />
                </Route>
                <Route path={"/search"}>
                    <SearchPage />
                </Route>
                <Route path={'/authors'}>
                    <AuthorPage />
                </Route>
                <Route path={'/addAuthor'}>
                    <AddAuthor />
                </Route>
                <Route path="/addPatient">
                    <AddPatient/>
                </Route>

                <Route path='/pharmacy'>
                    <PharmacyPage/>
                </Route>
                <Route path="/addPharm">
                    <AddArticle/>
                </Route>
                <Route path="/pharmacy-orders">
                    <PharmaOrders/>
                </Route>
                <Route path="/ambulance">
                    <AmbulancePage />
                </Route>
                <Route path="/add-ambulance">
                    <AddAmbulancePage />
                </Route>
                <Route path="/add-call">
                    <AmbulanceCallPage />
                </Route>
                <Route path="/calls">
                    <AmbulanceCalls />
                </Route>
                <Route path={"/findPatient"}>
                    <FindPatientPage />
                </Route>
                <Route path={"/patient"}>
                    <PatientPage />
                </Route>

                <Route path={"/vacList"}>
                    <VacPage />
                </Route>
                <Route path={"/addVac-item"}>
                    <AddVacList />
                </Route>
                <Route path={'/addVac-rec'}>
                    <AddVacRecord />
                </Route>

                <Route path={'/staffManage'}>
                    <StaffPage />
                </Route>

                <Route path={'/patManage'}>
                    <PatManagePage />
                </Route>

                <Route path={'/bedFund'}>
                    <BedFundPage />
                </Route>


                {/* Роуты пациентов */}
                <Route path={"/patRecords"}>
                    <DocVisits />
                </Route>
                <Route path={'/addPatRecord'}>
                    <AddPatientRecord />
                </Route>
                <Route path={'/patientVacs'}>
                    <PatientVacsPage />
                </Route>


                {/* Роуты врачей */}
                <Route path={"/docRecords"}>
                    <DocRecordsPage />
                </Route>

                <Route path={"/visHistory/:id"}>
                    <VisHistory />
                </Route>

                {/* Роуты для сотрудников лаборатории */}
                <Route path={"/analysis"}>
                    <AnalysisPage />
                </Route>

                {/*Оплата за медицинские средства*/}
                <Route path={"/payment"}>
                    <PaymentPage />
                </Route>


                <Route path={"/"}>
                    <StaffPage />
                </Route>

            </Switch>
        );
    }
    return (
        <Switch>
            <Route path="/" exact>
                <AuthPage/>
            </Route>
            <Redirect to="/"/>
        </Switch>
    );
}