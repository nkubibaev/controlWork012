import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import {BrowserRouter} from "react-router-dom";
import {CssBaseline} from "@mui/material";
import AuthLoader from "./components/AuthLoader.tsx";

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <AuthLoader>
            <CssBaseline />
            <App />
        </AuthLoader>
    </BrowserRouter>,
)
