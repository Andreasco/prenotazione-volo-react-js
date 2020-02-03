import React, {Component} from 'react';
import { Helmet } from "react-helmet";
import './DashboardAmministratore.css'
import DatePicker, {registerLocale} from "react-datepicker";
import {Aeroporto} from "../entities/Aeroporto";
import {Tratta} from "../entities/Tratta";
import {Volo} from "../entities/Volo";
import {Amministratore} from "../entities/Amministratore";
import axios from "axios";
import it from 'date-fns/locale/it'; //serve per aggiungere l'italiano a DatePicker

import "react-datepicker/dist/react-datepicker.css";
import NavBar from "../NavBar/NavBar";

const httpOptions = {
    headers: { 'Content-Type': 'application/json' },
};

class DashboardAmministratore extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dataPartenza: new Date(),
            dataPartenzaSelezionata: false,
            dataArrivo: new Date(),
            amministratore: new Amministratore("",""),
            aeroportoSelezionato: new Aeroporto(),
            trattaSelezionata: new Tratta(),
            flagTrattaSelezionata: false,
            voliByTratta: [],
            tratte: [],
            aeroporti: [],
            aeroportoInput: new Aeroporto(),
            usernameAmministratore: "",
            passwordAmministratore: "",
            prezzoInput: -1,
            aerPartInput: Aeroporto,
            aerDestInput: Aeroporto,
            voloSelezionato: Volo,
            flagVoloSelezionato: false
        };

        registerLocale('it', it); //serve per aggiungere l'italiano a DatePicker
        this.getAeroporti();
        this.getAmministratore();
        this.getTratte();
        this.aggiungiAeroporto = this.aggiungiAeroporto.bind(this);
        this.cancellaAeroporto = this.cancellaAeroporto.bind(this);
        this.aggiungiVolo = this.aggiungiVolo.bind(this);
        this.setDataArrivo = this.setDataArrivo.bind(this);
        this.setDataPartenza = this.setDataPartenza.bind(this);
        this.aggiungiTratta = this.aggiungiTratta.bind(this);
        this.getVoliByTratta = this.getVoliByTratta.bind(this);
        this.cancellaTratta = this.cancellaTratta.bind(this);
        this.selezionaVolo = this.selezionaVolo.bind(this);
        this.cancellaVolo = this.cancellaVolo.bind(this);
    }

    urlAeroporto = 'http://localhost:8080/PrenotazioneVolo/rest/aeroportos';
    urlAmministratore = 'http://localhost:8080/PrenotazioneVolo/rest/amministratores';
    urlTratta = 'http://localhost:8080/PrenotazioneVolo/rest/trattas';
    urlVolo = 'http://localhost:8080/PrenotazioneVolo/rest/volos';

    /***************** OPERAZIONI INIZIALI ***********************/

    getTratte(){
        axios.get(this.urlTratta).then(
            tratte => {
                this.setState({tratte : tratte.data});
            }
        );
    }

    getAeroporti(){
        axios.get(this.urlAeroporto).then(
            aeroporti => {
                this.setState({aeroporti : aeroporti.data});
            }
        );
    }

    getAmministratore(){
        const username = window.location.pathname.split('/')[2].toString();
        axios.get(this.urlAmministratore + '/' + username).then(
            amm => {
                //console.log(amm.data.username);
                this.setState({amministratore : amm.data});
            }
        );
    }

    /***************** SETTANO LA DATA USANDO IL DATEPICKER ***********************/

    setDataPartenza = date => {
        this.setState({dataPartenza: date});
        this.setState({dataPartenzaSelezionata: true});
        this.setState({dataArrivo: date});
    };

    setDataArrivo = date => {
        this.setState({dataArrivo: date});
    };

    /***************** OPERAZIONI AEROPORTO ***********************/

    aggiungiAeroporto(event){
        event.preventDefault();
        this.state.aeroportoInput.amministratore = this.state.amministratore;
        this.addAeroporto();
        window.location.reload();
        //console.log(this.state.aeroportoSelezionato);
    }

    addAeroporto(){
        //console.log(this.state.aeroportoInput);
        axios.post(this.urlAeroporto, this.state.aeroportoInput, httpOptions).then(() => {});
    }

    cancellaAeroporto(event){
        event.preventDefault();
        this.deleteAeroporto();
        window.location.reload();
    }

    deleteAeroporto(){
        axios.delete(this.urlAeroporto + "/" + this.state.aeroportoSelezionato.nome).then(() => {});
    }

    /***************** OPERAZIONI TRATTA ***********************/

    gestisciSelectPartenza(event){
        let indice = event.target.value;
        let aeroporto = this.state.aeroporti[indice];
        this.setState({aerPartInput : aeroporto})
    }

    gestisciSelectDestinazione(event){
        let indice = event.target.value;
        let aeroporto = this.state.aeroporti[indice];
        this.setState({aerDestInput : aeroporto})
    }

    aggiungiTratta(event){
        event.preventDefault();
        const tratta = new Tratta();
        tratta.aeroportoPartenza = this.state.aerPartInput;
        tratta.aeroportoDestinazione = this.state.aerDestInput;
        this.addTratta(tratta);
        window.location.reload();
        //console.log(this.state.aerPartInput);
        //console.log(this.state.aerDestInput);
    }

    addTratta(tratta){
        //console.log(tratta);
        axios.post(this.urlTratta, tratta, httpOptions).then(() => {});
    }

    getVoliByTratta(tratta){
        this.setState({trattaSelezionata : tratta});
        this.setState({flagTrattaSelezionata : true});
        //this.state.trattaSelezionata = tratta;
        //this.state.flagTrattaSelezionata = true;
        const aP = tratta.aeroportoPartenza.nome;
        const aD = tratta.aeroportoDestinazione.nome;
        this.findVoliByTratta(aP, aD);
    }

    findVoliByTratta(aP, aD){
        axios.get(this.urlVolo + '/' + aP + '-' + aD)
            .then(voliByTratta =>{
                this.setState({voliByTratta : voliByTratta.data});
            })
    }

    cancellaTratta(event){
        event.preventDefault();
        if (this.state.flagTrattaSelezionata){
            this.deleteTratta();
            window.location.reload();
        }
    }

    deleteTratta(){
        const aP = this.state.trattaSelezionata.aeroportoPartenza.nome;
        const aD = this.state.trattaSelezionata.aeroportoDestinazione.nome;
        axios.delete(this.urlTratta + '/' + aP + '-' + aD).then(() => {});
    }

    /***************** OPERAZIONI VOLO ***********************/

    aggiungiVolo(event){
        event.preventDefault();
        if (!this.state.trattaSelezionata.id)
            alert("Non hai selezionato nessuna tratta. Seleziona la tratta a cui aggiungere il volo.");
        if (this.state.prezzoInput < 0)
            alert("Non hai inserito nessun prezzo. Inserisci il costo per ogni posto del volo");

        const volo = new Volo();
        volo.tratta = this.state.trattaSelezionata;
        volo.prezzo = this.state.prezzoInput;
        volo.dataPartenza = this.state.dataPartenza;
        volo.dataArrivo = this.state.dataArrivo;

        this.addVolo(volo);
        window.location.reload();
    }

    addVolo(volo){
        axios.post(this.urlVolo, volo, httpOptions).then(() => {});
    }

    selezionaVolo(volo){
        this.setState({voloSelezionato : volo});
        this.setState({flagVoloSelezionato: true});
    }

    cancellaVolo(event){
        event.preventDefault();
        if (this.state.flagVoloSelezionato){
            this.deleteVolo();
            window.location.reload();
        }
    }

    deleteVolo(){
        const id = this.state.voloSelezionato.id;
        axios.delete(this.urlVolo + '/' + id).then(() => {});
    }

    convertiTimestamp(timestamp){
        const date = new Date(timestamp);
        return date.toString();
    }

    /***************** CODICE HTML ***********************/

    render() {
        return (
            <div>
                <Helmet>
                    <title>Dashboard amministratore</title>
                    <link rel="stylesheet" href="https://unpkg.com/purecss@1.0.1/build/pure-min.css"
                          integrity="sha384-oAOxQR6DkCoMliIh8yFnu25d7Eq/PHS21PClpwjOTeU2jRSq11vu66rf90/cZr47"
                          crossOrigin="anonymous" />
                </Helmet>

                <body>

                <NavBar amministratore="active" username=""/>

                <h1 className="titolo">Dashboard di {this.state.amministratore.username}</h1>

                <div className="tabellaAeroportiVoli">
                    <div className="tabellaAeroporti">
                        <form>
                            <h1>Lista aeroporti</h1>
                            <input className="inputAeroporto" type="text" name="nome" placeholder="nome"
                                   onChange={event => this.state.aeroportoInput.nome = event.target.value}/>
                            <input className="inputAeroporto" type="text" name="citta" placeholder="citta"
                                   onChange={event => this.state.aeroportoInput.citta = event.target.value}/>
                            <button className="btn" onClick = {this.aggiungiAeroporto}>Aggiungi</button>
                        </form>
                        <br/>
                        <br/>
                        <table className="pure-table pure-table-bordered">
                            <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Città</th>
                            </tr>
                            </thead>

                            <tbody>

                            {
                                this.state.aeroporti.map((aeroporto: Aeroporto) => {
                                    return (
                                        <tr className="cellaAeroporti" onClick={() => this.setState({aeroportoSelezionato : aeroporto})}>
                                            <td>{aeroporto.nome}</td>
                                            <td>{aeroporto.citta}</td>
                                        </tr>
                                    );
                                })
                            }

                            </tbody>
                        </table>

                        <div className="cancellaAeroporti">
                            <h3>Aeroporto selezionato: {this.state.aeroportoSelezionato.nome}</h3>
                            <br/>
                            <button className="bottoneCancellaAeroporti" onClick = {this.cancellaAeroporto}>Cancella</button>
                        </div>
                    </div>

                    <div className="aggiuntaVoli">
                        <h1>Aggiungi Volo</h1>
                        <form>
                            <h3>Tratta selezionata: {this.state.trattaSelezionata.aeroportoPartenza.nome + '-' + this.state.trattaSelezionata.aeroportoDestinazione.nome}</h3><br/>
                            <h3>Data partenza</h3>
                            <DatePicker
                                className="react-datepicker-popper"
                                locale="it"
                                showTimeSelect
                                selected={this.state.dataPartenza}
                                onChange={this.setDataPartenza}
                                timeFormat="HH:mm"
                                minDate={new Date()}
                                timeIntervals={15}
                                timeCaption="time"
                                dateFormat="MMMM d, yyyy h:mm aa"
                            /><br/>
                            <h3>Data arrivo</h3>
                            <DatePicker
                                className="react-datepicker-popper"
                                locale="it"
                                disabled={!this.state.dataPartenzaSelezionata}
                                showTimeSelect
                                selected={this.state.dataArrivo}
                                onChange={this.setDataArrivo}
                                timeFormat="HH:mm"
                                minDate={this.state.dataPartenza}
                                timeIntervals={15}
                                timeCaption="time"
                                dateFormat="MMMM d, yyyy h:mm aa"
                            />
                            <br/>
                            <br/>
                            <input className="inputAggiuntaVoli" type="text" dir="rtl" name="prezzo" onChange={event => this.setState({prezzoInput : event.target.value})} placeholder="prezzo"/> <p className="euro">€</p><br/>
                            <button className="btn" onClick = {this.aggiungiVolo}>Aggiungi</button>
                        </form>
                    </div>

                </div>

                <div className="tabellaTratteVoli">
                    <div className="tabellaTratte">
                        <form>
                            <h1>Lista tratte</h1>
                            <label>Aeroporto di partenza</label>
                            <select className="aerPartenza" onChange={e => this.gestisciSelectPartenza(e)}>

                                <option/>

                                {
                                    this.state.aeroporti.map((aeroporto, indice) =>
                                        <option value={indice} key={aeroporto.nome}>{aeroporto.nome}</option>
                                    )
                                }

                            </select>
                            <label>Aeroporto di destinazione</label>
                            <select className="aerDestinazione" onChange={e => this.gestisciSelectDestinazione(e)}>

                                <option/>

                                {
                                    this.state.aeroporti.map((aeroporto, indice) =>
                                            <option value={indice} key={aeroporto.nome}>{aeroporto.nome}</option>
                                    )
                                }

                            </select>
                            <button className="btn" onClick = {this.aggiungiTratta}>Aggiungi</button>
                        </form>
                        <br/>
                        <br/>
                        <table className="pure-table pure-table-bordered">
                            <thead>
                            <tr>
                                <th>Aeroporto di partenza</th>
                                <th>Aeroporto di destinazione</th>
                            </tr>
                            </thead>

                            <tbody>

                            {
                                this.state.tratte.map((tratta: Tratta) => {
                                    return (
                                        <tr className="cellaTratta" onClick={() => this.getVoliByTratta(tratta)}>
                                            <td>{tratta.aeroportoPartenza.nome}</td>
                                            <td>{tratta.aeroportoDestinazione.nome}</td>
                                        </tr>
                                    );
                                })
                            }
                            </tbody>
                        </table>

                        <div className="cancellaTratta">
                            <h3>Tratta selezionata: {this.state.trattaSelezionata.aeroportoPartenza.nome + '-' +
                                this.state.trattaSelezionata.aeroportoDestinazione.nome}</h3>
                            <br/>
                            <button className="bottoneCancellaTratta" onClick = {this.cancellaTratta}>Cancella</button>
                        </div>

                    </div>
                    <br/>
                    <br/>
                    <div className="tabellaVoli">
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
                                        <tr className="cellaVoli" onClick={() => this.selezionaVolo(volo)}>
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

                        <div className="cancellaVolo">
                            <h3>ID volo selezionato: {this.state.voloSelezionato.id}</h3>
                            <br/>
                            <button className="bottoneCancellaVolo" onClick = {this.cancellaVolo}>Cancella</button>
                        </div>
                    </div>
                </div>

                </body>
            </div>
        );
    }
}

export default DashboardAmministratore;
