import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import {BrowserRouter} from "react-router-dom";
import {CssBaseline} from "@mui/material";
import AuthLoader from "./components/AuthLoader.tsx";
import Header from "./components/Header.tsx";
import {GoogleOAuthProvider} from "@react-oauth/google";

createRoot(document.getElementById('root')!).render(
    <GoogleOAuthProvider clientId="723403873149-8pu77hu0nsmsgv5fg15nk3b9sgn5ku56.apps.googleusercontent.com">
        <BrowserRouter>
            <AuthLoader>
                <Header />
                <CssBaseline />
                <App />
            </AuthLoader>
        </BrowserRouter>,
    </GoogleOAuthProvider>
)