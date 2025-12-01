import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { DataProvider } from './context/DataContext'

const AppWithData = () => {
    const { user } = useAuth();
    return (
        <DataProvider key={user?.id || 'guest'}>
            <App />
        </DataProvider>
    );
};

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <AppWithData />
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>,
)
