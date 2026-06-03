import { Entidade, type Habilidade } from "../Entidade.js";

const habilidades: Habilidade[] = [
    { nome: "Mordida", descricao: "Mordida rápida", custoMP: 0, danoBase: 0, cura: 0, alcance: 1, tipo: 'ataque' }
];

export function criarLargato(nivel: number): Entidade {
    const e = new Entidade("Largato", 30 + nivel * 8, 10, 8 + nivel * 2, 2, habilidades);
    return e;
}
