import './App.css';
import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Dashboard from "../Dashboard/Dashboard";
import Login from "../Users/Login";
import SignUp from "../Users/SignUp";
import RequireToken from "./RequireToken";
import {createTheme, ThemeProvider} from "@mui/material";
import {SnackbarProvider} from "notistack";

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#3c3f5e',
        },
        secondary: {
            main: '#0058CB',
        },
        background: {
            default: '#1e1e26',
            paper: '#27293d',
        },
    },
    typography: {
        fontFamily: 'Plus Jakarta Sans, sans-serif',
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={3} autoHideDuration={5000}>
                <Router>
                    <div className="app" style={{height: '100vh'}}>
                        <Routes>
                            <Route path='/' element={<RequireToken><Dashboard/></RequireToken>}/>
                            <Route path='/login' element={<Login/>}/>
                            <Route path='/register' element={<SignUp/>}/>
                        </Routes>
                    </div>
                </Router>
            </SnackbarProvider>
        </ThemeProvider>
    );
}

export default App;
