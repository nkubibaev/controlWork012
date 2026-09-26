import {Route, Routes} from "react-router-dom";
import RegisterPage from "./pages/RegisterPage.tsx";
import LoginPage from './pages/LoginPage';
import HomePage from "./pages/HomePage.tsx";
import RecipePage from "./pages/RecipePage.tsx";


const App = () => {
    return (
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/recipes/:id" element={<RecipePage />} />
        </Routes>
    );
};

export default App;