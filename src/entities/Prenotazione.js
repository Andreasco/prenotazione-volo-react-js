import {Volo} from '../entities/Volo';
import {Utente} from '../entities/Utente';

export class Prenotazione {
    id: number;
    volo: Volo;
    utente: Utente;
    numeroPosti: number;
    prezzoPrenotazione: number;
    codicePrenotazione: string;

}
