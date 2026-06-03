import { Entidade, type Habilidade } from "../Entidade.js";

const habilidades: Habilidade[] = [
    { nome: "Garra", descricao: "Golpe de garra", custoMP: 0, danoBase: 0, cura: 0, alcance: 1, tipo: 'ataque' },
    { nome: "Esmagar", descricao: "Ataque pesado", custoMP: 5, danoBase: 0, cura: 0, alcance: 2, tipo: 'ataque' }
];

export function criarUrso(nivel: number): Entidade {
    const e = new Entidade("Urso", 80 + nivel * 15, 20, 18 + nivel * 4, 5, habilidades);
    return e;
}
