import React from 'react';
import './Home.css';
import {Link} from "react-router-dom";

const Home = () => {
    return (
        <div id="header-wrapper">
            <div id="header" className="container">
                <div id="logo">
                    <h1>Unical Airlines</h1>
                </div>
            </div>

            <div id="banner-wrapper">
                <div id="banner" className="container">
                    <div className="title">
                        <h2>Benvenuto! Pronto a viaggiare?</h2>
                        <span className="byline">Sei un amministratore o un utente?</span>
                    </div>
                    <div>
                        <Link to="/amministratore" className="button">Amministratore</Link>
                        <Link to="/utente" className="button">Utente</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
