import React, {Component} from 'react';
import { Helmet } from "react-helmet";
import './DashboardUtente.css'
import {Tratta} from "../entities/Tratta";
import {Volo} from "../entities/Volo";
import {Prenotazione} from "../entities/Prenotazione";
import axios from "axios";
import {Utente} from "../entities/Utente";
import NavBar from "../NavBar/NavBar";

const httpOptions = {
    headers: { 'Content-Type': 'application/json' },
};

class DashboardUtente extends Component {

    urlUtente = 'http://localhost:8080/PrenotazioneVolo/rest/utentes';
    urlTratta = 'http://localhost:8080/PrenotazioneVolo/rest/trattas';
    urlVolo = 'http://localhost:8080/PrenotazioneVolo/rest/volos';
    urlPrenotazione = 'http://localhost:8080/PrenotazioneVolo/rest/prenotaziones';

    constructor(props) {
        super(props);

        this.state={
            utenteLoggato : new Utente(),
            aeroportoRicerca: "",
            tratteAttuali: [],
            trattaSelezionata: new Tratta(),
            voloSelezionato: new Volo(),
            nPostiScelti: -1,
            voliByTratta: [],
            postiDisponibili: []
        };

        this.getUtenteLoggato();
        this.listAllTratte();
        this.goPrenotazioni = this.goPrenotazioni.bind(this);
        this.cercaTratte = this.cercaTratte.bind(this);
        this.listAllTratte = this.listAllTratte.bind(this);
        this.getTratteByAeroportoPartenza = this.getTratteByAeroportoPartenza.bind(this);
        this.selezionaTratta = this.selezionaTratta.bind(this);
        this.selezionaTratta = this.selezionaTratta.bind(this);
        this.getVoliByTratta = this.getVoliByTratta.bind(this);
        this.selezionaVolo = this.selezionaVolo.bind(this);
        this.gestisciSelectNumeroPosti = this.gestisciSelectNumeroPosti.bind(this);
        this.prenota = this.prenota.bind(this);
        this.book = this.book.bind(this);
        this.getUtenteLoggato = this.getUtenteLoggato.bind(this);
    }

    goPrenotazioni(event){
        event.preventDefault();
        this.props.history.push('/utente/' + this.state.utenteLoggato.username + '/prenotazioni');
    }

    cercaTratte(event){
        event.preventDefault();
        this.getTratteByAeroportoPartenza();
        if (this.state.aeroportoRicerca === "") {
            this.listAllTratte();
        }
    }

    listAllTratte(){
        axios.get(this.urlTratta).then(
            tratte =>{
                this.setState({tratteAttuali : tratte.data});
            }
        );
    }

    getTratteByAeroportoPartenza(){
        axios.get(this.urlTratta + '/aeroportoPartenza=' + this.state.aeroportoRicerca).then(
            tratte =>{
                this.setState({tratteAttuali : tratte.data});
            }
        );
    }

    selezionaTratta(tratta){
        this.setState({trattaSelezionata: tratta});
        const aeroportoPartenza = tratta.aeroportoPartenza.nome;
        const aeroportoDestinazione = tratta.aeroportoDestinazione.nome;
        this.getVoliByTratta(aeroportoPartenza, aeroportoDestinazione);
    }

    getVoliByTratta(aeroportoPartenza, aeroportoDestinazione){
        axios.get(this.urlVolo + '/' + aeroportoPartenza + '-' + aeroportoDestinazione).then(
            voli =>{
                this.setState({voliByTratta : voli.data});
            }
        );
    }

    selezionaVolo(volo){
        if (this.state.nPostiScelti > volo.postiDisponibili)
            this.setState({nPostiScelti : -1});
        this.setState({postiDisponibili: []});
        this.setState({voloSelezionato: volo});
        console.log(this.state.voloSelezionato);
        console.log(volo);
        const newArray = [];
        for (let i = 0; i < volo.postiDisponibili; i++) {
            newArray.push(i + 1);
        }
        this.setState({postiDisponibili : newArray});

    }

    gestisciSelectNumeroPosti(e){
        this.setState({nPostiScelti : e.target.value});
    }

    prenota(event){
        event.preventDefault();
        console.log(this.state.nPostiScelti);
        const prenotazione = new Prenotazione();
        prenotazione.volo = this.state.voloSelezionato;
        prenotazione.numeroPosti = this.state.nPostiScelti;
        prenotazione.utente = this.state.utenteLoggato;
        console.log(prenotazione);
        this.book(prenotazione);
        alert('La prenotazione è stata aggiunta, trovi i dettagli e il codice della prenotazione nel tuo elenco prenotazioni');
        window.location.reload();
    }

    book(prenotazione){
        axios.post(this.urlPrenotazione, prenotazione, httpOptions).then(() => {});
    }

    getUtenteLoggato(){
        const username = window.location.pathname.split('/')[2].toString();
        axios.get(this.urlUtente + '/' + username).then(
            utente => {
                //console.log(utente.data.username);
                this.setState({utenteLoggato : utente.data});
            }
        );
    }

    convertiTimestamp(timestamp){
        const date = new Date(timestamp);
        return date.toString();
    }

    render() {
        return (
            <div>
                <Helmet>
                    <title>Dashboard utente</title>
                    <link rel="stylesheet" href="https://unpkg.com/purecss@1.0.1/build/pure-min.css"
                          integrity="sha384-oAOxQR6DkCoMliIh8yFnu25d7Eq/PHS21PClpwjOTeU2jRSq11vu66rf90/cZr47"
                          crossOrigin="anonymous" />
                </Helmet>

                <body>

                <NavBar utente="active" flag={true} username={this.state.utenteLoggato.username}/>

                <h1 style={{textAlign: "center", fontSize: "300%"}}>Dashboard utente, prenota un volo!</h1>

                <div className="sceltaTratta">
                    <form className="formSceltaTratta">
                        <h1>Scegli la tua tratta</h1>
                        <input className="sceltaAeroporto" type="text" name="partenza" required onChange={event => this.setState({aeroportoRicerca : event.target.value})}
                               placeholder="Partenza" style={{color: "#3f0900"}}/>
                        <button className="btn" style={{color: "black"}} onClick={this.cercaTratte}>Cerca</button>
                    </form>

                <table className="pure-table pure-table-bordered">
                    <thead>
                    <tr>
                        <th>Partenza</th>
                        <th>Destinazione</th>
                    </tr>
                    </thead>

                    <tbody>

                    {
                        this.state.tratteAttuali.map((tratta: Tratta) => {
                            return (
                                <tr className="cellaTratte" onClick={() => this.selezionaTratta(tratta)}>
                                    <td>{tratta.aeroportoPartenza.nome}</td>
                                    <td>{tratta.aeroportoDestinazione.nome}</td>
                                </tr>
                            );
                        })
                    }

                    </tbody>
                </table>
                </div>

                <div className="dettaglio">

                    <h1>Dettaglio selezione</h1>

                    <table className="pure-table pure-table-bordered">
                        <thead>
                        <tr>
                            <th>Aeroporto partenza</th>
                            <th>Città partenza</th>
                            <th>Aeroporto destinazione</th>
                            <th>Città destinazione</th>
                        </tr>
                        </thead>

                        <tbody>
                        <tr className="cellaAeroportiSelezionati">
                            <td>{this.state.trattaSelezionata.aeroportoPartenza.nome}</td>
                            <td>{this.state.trattaSelezionata.aeroportoPartenza.citta}</td>
                            <td>{this.state.trattaSelezionata.aeroportoDestinazione.nome}</td>
                            <td>{this.state.trattaSelezionata.aeroportoDestinazione.citta}</td>
                        </tr>
                        </tbody>
                    </table>

                    <h1>Voli disponibili</h1>

                    <table className="pure-table pure-table-bordered">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Ora partenza</th>
                            <th>Ora arrivo</th>
                            <th>Durata</th>
                            <th>Prezzo</th>
                        </tr>
                        </thead>

                        <tbody>

                        {
                            this.state.voliByTratta.map((volo: Volo) => {
                                return (
                                    <tr className="cellaVoliDisponibili" onClick={() => this.selezionaVolo(volo)}>
                                        <td>{volo.id}</td>
                                        <td>{this.convertiTimestamp(volo.dataPartenza)}</td>
                                        <td>{this.convertiTimestamp(volo.dataArrivo)}</td>
                                        <td>{volo.durata}</td>
                                        <td>{volo.prezzo}€</td>
                                    </tr>
                                );
                            })
                        }
                        </tbody>
                    </table>

                    <h2>ID volo selezionato: {this.state.voloSelezionato.id}</h2>
                    <h2>Quanti posti vuoi prenotare?</h2>
                    <select className="nPostiScelti" onChange={e => this.gestisciSelectNumeroPosti(e)}>
                        <option/>

                        {
                            this.state.postiDisponibili.map(numero =>
                                <option value={numero} key={numero}>{numero}</option>
                            )
                        }

                    </select>

                    <button className="btn" disabled={this.state.nPostiScelti < 1} style={{color: "black"}}
                            onClick = {this.prenota}>Prenota</button>

                </div>

                </body>
            </div>
        );
    }
}

export default DashboardUtente;
