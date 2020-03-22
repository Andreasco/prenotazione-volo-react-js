import React, {Component} from 'react';
import {Helmet} from "react-helmet";
import './PrenotazioniUtente.css'
import {Prenotazione} from "../entities/Prenotazione";
import axios from "axios";
import NavBar from "../NavBar/NavBar";

class PrenotazioniUtente extends Component {

    urlPrenotazione = 'http://localhost:8080/PrenotazioneVolo/rest/prenotaziones';

    constructor(props) {
        super(props);

        this.state={
            utente: "",
            prenotazioni: [],
            prenotazioneSelezionata: new Prenotazione()
        };

        this.getUsernameUtente();
        this.getPrenotazioniUtente();
        this.cancellaPrenotazione = this.cancellaPrenotazione.bind(this);
    }

    /***************** OPERAZIONI INIZIALI ***********************/

    getUsernameUtente(){
        this.state.utente = window.location.pathname.split('/')[2].toString(); //perchè setState è asincrono e non si vedrebbe il nome nella pagina
    }

    getPrenotazioniUtente(){
        axios.get(this.urlPrenotazione + '/' + this.state.utente).then(
            pren =>{
                this.setState({prenotazioni : pren.data})
            }
        );
    }

    /***************** OPERAZIONI CANCELLAZIONE ***********************/

    cancellaPrenotazione(){
        const idPrenotazione = this.state.prenotazioneSelezionata.id;
        axios.delete(this.urlPrenotazione + '/' + idPrenotazione).then(() => {});
        window.location.reload();
    }

    /***************** OPERAZIONI AUSILIARIE ***********************/

    selezionaPrenotazione(prenotazione){
        this.setState({prenotazioneSelezionata : prenotazione});
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
                    <title>Prenotazioni utente</title>
                    <link rel="stylesheet" href="https://unpkg.com/purecss@1.0.1/build/pure-min.css"
                          integrity="sha384-oAOxQR6DkCoMliIh8yFnu25d7Eq/PHS21PClpwjOTeU2jRSq11vu66rf90/cZr47"
                          crossOrigin="anonymous" />
                </Helmet>

                <body>

                <NavBar prenotazioni="active" flag={true} username={this.state.utente}/>

                <h1 style={{textAlign: "center", fontSize: "300%"}}>Prenotazioni di {this.state.utente}</h1>
                <h3 style={{textAlign: "center", fontSize: "200%"}}>Qui puoi gestire le tue prenotazioni. Ricordati di presentare il codice al check-in</h3>


                <div className="listaPrenotazioni">
                    <table className="pure-table pure-table-bordered">
                        <thead>
                        <tr>
                            <th>ID prenotazione</th>
                            <th>Aeroporto partenza</th>
                            <th>Città partenza</th>
                            <th>Aeroporto destinazione</th>
                            <th>Città destinazione</th>
                            <th>Data partenza</th>
                            <th>Data arrivo</th>
                            <th>Durata</th>
                            <th>Numero posti</th>
                            <th>Prezzo totale</th>
                            <th>Codice prenotazione</th>
                        </tr>
                        </thead>

                        <tbody>

                        {
                            this.state.prenotazioni.map((prenotazione: Prenotazione) => {
                                return (
                                    <tr className="cellaPrenotazioni" onClick={() => this.selezionaPrenotazione(prenotazione)}>
                                        <td>{prenotazione.id}</td>
                                        <td>{prenotazione.volo.tratta.aeroportoPartenza.nome}</td>
                                        <td>{prenotazione.volo.tratta.aeroportoPartenza.citta}</td>
                                        <td>{prenotazione.volo.tratta.aeroportoDestinazione.nome}</td>
                                        <td>{prenotazione.volo.tratta.aeroportoDestinazione.citta}</td>
                                        <td>{this.convertiTimestamp(prenotazione.volo.dataPartenza)}</td>
                                        <td>{this.convertiTimestamp(prenotazione.volo.dataArrivo)}</td>
                                        <td>{prenotazione.volo.durata}</td>
                                        <td>{prenotazione.numeroPosti}</td>
                                        <td>{prenotazione.prezzoPrenotazione}€</td>
                                        <td>{prenotazione.codicePrenotazione}</td>
                                    </tr>
                                );
                            })
                        }

                        </tbody>
                    </table>

                    <div className="cancellaPrenotazione">
                        <h3>ID prenotazione selezionata: {this.state.prenotazioneSelezionata.id}</h3><br/>
                        <button className="bottoneCancellaPrenotazione" style={{color: "black"}} onClick={this.cancellaPrenotazione}>Cancella</button>
                    </div>
                </div>

                </body>
            </div>
        );
    }
}

export default PrenotazioniUtente;
