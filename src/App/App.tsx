import './App.css';
import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Dashboard from "../Dashboard/Dashboard";

function App() {
    return (
        <Router>
            <div className="app">
                <Routes>
                    <Route path='/' element={<Dashboard/>}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
