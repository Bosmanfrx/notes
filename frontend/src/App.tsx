import React from 'react';
import './App.css';
import {Header} from "./header/Header";
import {Router} from "./Router";

function App() {
    return (
        <div className="container">
            <header>
                <Header/>
            </header>
            <main>
                <div className="content">
                    <Router />
                </div>
            </main>
        </div>
    );
}

export default App;
