import {Aeroporto} from './Aeroporto';

export class Tratta {
    id: number;
    aeroportoPartenza: Aeroporto;
    aeroportoDestinazione: Aeroporto;


    constructor() {
        const aer = new Aeroporto();
        aer.nome = "";
        this.aeroportoPartenza = aer;
        this.aeroportoDestinazione = aer;
    }
}
