import { Metrica } from './metrica.model';

export  interface Material{
    _id:string;
    descricao:string;
    quantidade:number;
    metrica:Metrica;
}