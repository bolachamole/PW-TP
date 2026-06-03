import { Entidade, type Habilidade } from "../Entidade.js";

const habilidades: Habilidade[] = [
    { nome: "Chicote", descricao: "Golpe de vinha", custoMP: 0, danoBase: 0, cura: 0, alcance: 2, tipo: 'ataque' },
    { nome: "Enroscar", descricao: "Suga a vida do alvo", custoMP: 5, danoBase: 0, cura: 0.2, alcance: 1, tipo: 'ataque' }
];

export function criarVinha(nivel: number): Entidade {
    const e = new Entidade("Vinha Viva", 45 + nivel * 10, 25, 10 + nivel * 2, 4, habilidades);
    return e;
}
