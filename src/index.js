import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from './Home/Home';
import * as serviceWorker from './serviceWorker';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import LoginAmministratore from "./LoginAmministratore/LoginAmministratore";
import DashboardAmministratore from "./DashboardAmministratore/DashboardAmministratore";
import PageNotFound from "./PageNotFound/PageNotFound";
import LoginUtente from "./LoginUtente/LoginUtente";
import DashboardUtente from "./DashboardUtente/DashboardUtente";
import PrenotazioniUtente from "./Prenotazioni/PrenotazioniUtente";

const routing = (
    <Router>
        <div>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/amministratore/:username" component={DashboardAmministratore}/>
                <Route exact path="/amministratore" component={LoginAmministratore}/>
                <Route exact path="/utente/:username/prenotazioni" component={PrenotazioniUtente}/>
                <Route path="/utente/:username" component={DashboardUtente}/>
                <Route exact path="/utente" component={LoginUtente}/>
                <Route component={PageNotFound}/>
            </Switch>
        </div>
    </Router>
);

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
