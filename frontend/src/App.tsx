import {Route, Routes} from "react-router-dom";
import RegisterPage from "./pages/RegisterPage.tsx";
import LoginPage from './pages/LoginPage';
import HomePage from "./pages/HomePage.tsx";


const App = () => {
    return (
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
    );
};

export default App;