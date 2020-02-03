import {Tratta} from './Tratta';

export class Volo {
    id: number;
    tratta: Tratta;
    dataPartenza: number;
    dataArrivo: number;
    durata: number;
    prezzo: number;
    postiDisponibili: number;
}
