import { Metrica } from './metrica.model';

export  interface Material{
    _id:string;
    descricao:string;
    quantidade:number;
    metrica:Metrica;
    valor_entrada:number;
    valor_saida:number;
}