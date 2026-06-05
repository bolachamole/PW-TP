import { bounce, corte } from "../../constants.js";
import { Entidade, type Habilidade } from "../Entidade.js";

const habilidades: Habilidade[] = [
    { nome: "Corte", descricao: "Golpe rápido", custoMP: 0, cura: 0, alcance: 1, tipo: 'ataque', som: corte },
    { nome: "Investida", descricao: "Avança e ataca", custoMP: 4, cura: 0, alcance: 3, tipo: 'ataque', som: bounce }
];

export function criarLouvaDeus(nivel: number): Entidade {
    const e = new Entidade("Louva Deus", 50 + nivel * 12, 15, 20 + nivel * 5, 2, habilidades);
    return e;
}
