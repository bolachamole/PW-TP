import { Entidade, type Habilidade } from "../Entidade.js";

const habilidades: Habilidade[] = [
    { nome: "Corte", descricao: "Golpe rápido", custoMP: 0, danoBase: 0, cura: 0, alcance: 1, tipo: 'ataque' },
    { nome: "Investida", descricao: "Avança e ataca", custoMP: 4, danoBase: 0, cura: 0, alcance: 3, tipo: 'ataque' }
];

export function criarLouvaDeus(nivel: number): Entidade {
    const e = new Entidade("Louva Deus", 50 + nivel * 12, 15, 20 + nivel * 5, 2, habilidades);
    return e;
}
