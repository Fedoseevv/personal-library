import {Switch, Route, Redirect} from "react-router-dom";
import {AddBook} from './pages/AddBook/AddBook';
import {AuthPage} from "./pages/AuthPage/AuthPage";
import {AddDocument} from "./pages/AddDoc/AddDocument";
import {AddArticle} from "./pages/AddArticle/AddArticle";
import {AllSourcesPage} from "./modules/StaffManage/AllSourcesPage/AllSourcesPage";
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
                    <AddBook/>
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
                    <AddDocument/>
                </Route>

                <Route path="/addPharm">
                    <AddArticle/>
                </Route>

                <Route path={'/staffManage'}>
                    <AllSourcesPage />
                </Route>

                <Route path={"/"}>
                    <AllSourcesPage />
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