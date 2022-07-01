import './App.css';
import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Dashboard from "../Dashboard/Dashboard";
import Login from "../Users/Login";
import SignUp from "../Users/SignUp";
import RequireToken from "./RequireToken";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
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
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    scrollbarColor: "#6b6b6b #2b2b2b",
                    "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
                        backgroundColor: "transparent",
                    },
                    "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
                        borderRadius: 8,
                        backgroundColor: "#6b6b6b",
                        minHeight: 24,
                        border: "4px solid transparent",
                        backgroundClip: 'content-box',
                    },
                    "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
                        backgroundColor: "#959595",
                    },
                    "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active": {
                        backgroundColor: "#959595",
                    },
                    "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
                        backgroundColor: "#959595",
                    },
                    "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
                        backgroundColor: "#2b2b2b",
                    },
                    lineHeight: 1.3,
                },
            },
        },
    },
});

function App() {
    return (
        <>
            <ThemeProvider theme={theme}>
                <CssBaseline enableColorScheme/>
                <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
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
        </>
    );
}

export default App;
