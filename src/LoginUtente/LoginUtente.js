import React, {Component} from 'react';
import './LoginUtente.css'
import {Utente} from "../entities/Utente";
import axios from "axios";
import NavBar from "../NavBar/NavBar";

const httpOptions = {
    headers: { 'Content-Type': 'application/json' },
};

class LoginUtente extends Component{

    constructor(props){
        super(props);

        this.state = {
            toDashboard: false,
            usernameUtente: "",
            passwordUtente: ""
        };
    }

    urlLogin = 'http://localhost:8080/PrenotazioneVolo/rest/utentes';

    render() {
        return (
            <div>

                <NavBar utente="active" username=""/>

                <div className="log-form">
                    <h1>Ciao utente! Fai il login o registrati</h1>
                    <form>
                        <input type="text" name="username" value={this.state.usernameUtente}
                               onChange={event => this.setState({ usernameUtente: event.target.value })} placeholder="username" /><br />

                        <input type="password" name="password" value={this.state.passwordUtente}
                               onChange={event => this.setState({ passwordUtente: event.target.value })} placeholder="password" /><br />

                        <button className="btn" onClick = {(e) => this.loginUtente(e)}>Login</button>
                        <button className="btn" onClick = {(e) => this.registrazioneUtente(e)}>Registrati</button>
                    </form>
                </div>
            </div>
        );
    }

    loginUtente(e: React.MouseEvent<HTMLButtonElement, MouseEvent>){
        e.preventDefault();
        const utente = new Utente();
        utente.username = this.state.usernameUtente;
        utente.password = this.state.passwordUtente;
        console.log(utente.username + " " + utente.password);
        this.verificaUtente(utente);
    }

    verificaUtente(utente: Utente){
        axios.get(this.urlLogin + '/' + utente.username + '-' + utente.password)
            .then(resp => {
                this.go(utente);
            })
            .catch(() => {
                alert("Non c'è nessun utente con queste credenziali");
            })
    }

    registrazioneUtente(e: React.MouseEvent<HTMLButtonElement, MouseEvent>){
        e.preventDefault();
        const utente = new Utente();
        utente.username = this.state.usernameUtente;
        utente.password = this.state.passwordUtente;
        this.creaUtente(utente);
    }

    creaUtente(utente: Utente) {
        axios.post(this.urlLogin, utente, httpOptions).then(() => {});
        window.location.reload();
    }

    go(utente: Utente){
        this.props.history.push('/utente/' + utente.username);
    }
}

export default LoginUtente;
