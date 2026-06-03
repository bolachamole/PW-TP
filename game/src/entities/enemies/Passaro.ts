import { Entidade, type Habilidade } from "../Entidade.js";

const habilidades: Habilidade[] = [
    { nome: "Bicada", descricao: "Bicada precisa", custoMP: 0, danoBase: 0, cura: 0, alcance: 2, tipo: 'ataque' },
    { nome: "Mergulho", descricao: "Ataque aéreo", custoMP: 4, danoBase: 0, cura: 0, alcance: 4, tipo: 'ataque' }
];

export function criarPassaro(nivel: number): Entidade {
    const e = new Entidade("Pássaro", 30 + nivel * 8, 15, 16 + nivel * 4, 1, habilidades);
    return e;
}
