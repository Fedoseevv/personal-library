import {BrowserRouter as Router} from "react-router-dom";
import "./reset.css";
import "./index.css";
import {useRoutes} from "./routes";
import {useAuth} from "./hooks/auth";
import {AuthContext} from "./context/AuthContext";
import {Header} from "./components/header/header";

function App() {
    const {token, login, logout, userId, role} = useAuth();
    const isAuthenticated = !!token;
    const routes = useRoutes(isAuthenticated);
    console.log(userId);
    return (
        <AuthContext.Provider value={{
            token, login, logout, userId, role, isAuthenticated
        }}>
            {isAuthenticated ? <Header isAuth={isAuthenticated} userId={userId} role={role}/> : <></>}
            {routes}
        </AuthContext.Provider>
    );
}

export default App;
