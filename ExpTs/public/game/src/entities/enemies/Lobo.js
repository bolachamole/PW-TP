import { Entidade } from "../Entidade.js";
const habilidades = [
    { nome: "Mordida", descricao: "Mordida forte", custoMP: 0, danoBase: 0, cura: 0, alcance: 1, tipo: 'ataque' },
    { nome: "Uivo", descricao: "Aumenta o ataque", custoMP: 3, danoBase: 0, cura: 0, alcance: 0, tipo: 'defesa' }
];
export function criarLobo(nivel) {
    const e = new Entidade("Lobo", 40 + nivel * 10, 15, 12 + nivel * 3, 3, habilidades);
    return e;
}
