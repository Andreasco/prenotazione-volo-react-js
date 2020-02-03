import React, {Component} from 'react';
import './LoginAmministratore.css'
import {Amministratore} from "../entities/Amministratore";
import axios from "axios";
import NavBar from "../NavBar/NavBar";

const httpOptions = {
    headers: { 'Content-Type': 'application/json' },
};

class LoginAmministratore extends Component{

    constructor(props){
        super(props);

        this.state = {
            toDashboard: false,
            usernameAmministratore: "",
            passwordAmministratore: ""
        };
    }

    urlLogin = 'http://localhost:8080/PrenotazioneVolo/rest/amministratores';

    render() {
        return (
            <div>
                <NavBar amministratore="active" username=""/>

                <div className="log-form">
                    <h1>Ciao amministratore! Fai il login o registrati</h1>
                    <form>
                        <input type="text" name="username" value={this.state.usernameAmministratore}
                               onChange={event => this.setState({ usernameAmministratore: event.target.value })} placeholder="username" /><br />

                        <input type="password" name="password" value={this.state.passwordAmministratore}
                               onChange={event => this.setState({ passwordAmministratore: event.target.value })} placeholder="password" /><br />

                        <button className="btn" onClick = {(e) => this.loginAdmin(e)}>Login</button>
                        <button className="btn" onClick = {(e) => this.registrazioneAdmin(e)}>Registrati</button>
                    </form>
                </div>
            </div>
        );
    }

    loginAdmin(e: React.MouseEvent<HTMLButtonElement, MouseEvent>){
        e.preventDefault();
        const admin = new Amministratore();
        admin.username = this.state.usernameAmministratore;
        admin.password = this.state.passwordAmministratore;
        console.log(admin.username + " " + admin.password);
        this.verificaAmministratore(admin);
    }

    registrazioneAdmin(e: React.MouseEvent<HTMLButtonElement, MouseEvent>){
        e.preventDefault();
        const admin = new Amministratore();
        admin.username = this.state.usernameAmministratore;
        admin.password = this.state.passwordAmministratore;
        this.creaAmministratore(admin);
    }

    verificaAmministratore(admin: Amministratore){
        axios.get(this.urlLogin + '/' + admin.username + '-' + admin.password)
            .then(resp => {
                this.go(admin);
            })
            .catch(() => {
                alert("Non c'è nessun amministratore con queste credenziali");
            })
    }

    creaAmministratore(admin: Amministratore) {
        axios.post(this.urlLogin, admin, httpOptions).then(() => {});
        window.location.reload();
    }

    go(admin: Amministratore){
        /*// è un modo per reindirizzare l'utente anche se non è quello giusto
        const link = "/amministratore/" + admin.username;
        // eslint-disable-next-line no-restricted-globals
        history.pushState(null, "Dashboard", link);
        window.location.reload();*/

        this.props.history.push('/amministratore/' + admin.username);
    }
}

export default LoginAmministratore;
