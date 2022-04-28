import './App.css';
import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Dashboard from "../Dashboard/Dashboard";
import Login from "../Users/Login";
import SignUp from "../Users/SignUp";
import RequireToken from "./RequireToken";

function App() {
    return (
        <Router>
            <div className="app">
                <Routes>
                    <Route path='/' element={<RequireToken><Dashboard/></RequireToken>}/>
                    <Route path='/login' element={<Login/>}/>
                    <Route path='/register' element={<SignUp/>}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
