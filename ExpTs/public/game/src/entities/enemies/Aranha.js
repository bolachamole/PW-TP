import { insetos, pewpew } from "../../constants.js";
import { Entidade } from "../Entidade.js";
const habilidades = [
    { nome: "Picada", descricao: "Picada venenosa", custoMP: 0, cura: 0, alcance: 1, tipo: 'ataque', som: insetos },
    { nome: "Teia", descricao: "Prende o alvo", custoMP: 3, cura: 0, alcance: 3, tipo: 'ataque', som: pewpew }
];
export function criarAranha(nivel) {
    const e = new Entidade("Aranha", 35 + nivel * 9, 20, 14 + nivel * 3, 2, habilidades);
    return e;
}
