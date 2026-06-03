import { Entidade, type Habilidade } from "../Entidade.js";

const habilidades: Habilidade[] = [
    { nome: "Picada", descricao: "Picada venenosa", custoMP: 0, danoBase: 0, cura: 0, alcance: 1, tipo: 'ataque' },
    { nome: "Teia", descricao: "Prende o alvo", custoMP: 3, danoBase: 0, cura: 0, alcance: 3, tipo: 'ataque' }
];

export function criarAranha(nivel: number): Entidade {
    const e = new Entidade("Aranha", 35 + nivel * 9, 20, 14 + nivel * 3, 2, habilidades);
    return e;
}
