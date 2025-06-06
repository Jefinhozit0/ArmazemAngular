import { Cliente } from "./cliente";
import { Produto } from "./produto";

export class Cesta {
    codigo : number =0; 
    total: number=0;
    cliente: Cliente = new Cliente();
    itens: Produto[] = [];
}
