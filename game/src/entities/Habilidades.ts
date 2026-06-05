import type { Habilidade } from "./Entidade.js";
import { espada1, espada2, espada3 } from "../constants.js";

/**
 * Banco de dados centralizado de feitiços e técnicas do jogo.
 */
export const COMPENDIO_HABILIDADES: Record<string, Habilidade> = {
    espadada: { nome: "Espadada", descricao: "Ataque simples com a espada", custoMP: 0, cura: 0, alcance: 2, tipo: 'ataque', som: espada1 },
    golpeForte: { nome: "Golpe Forte", descricao: "Ataque poderoso que causa 2x dano", custoMP: 5, cura: 0, alcance: 2, tipo: 'ataque', som: espada2 },
    posturaDefensiva: { nome: "Postura Defensiva", descricao: "Dobra a defesa por um turno", custoMP: 3, cura: 0, alcance: 0, tipo: 'defesa', som: null },
    cura: { nome: "Cura", descricao: "Recupera 30% da vida máxima", custoMP: 8, cura: 0.3, alcance: 0, tipo: 'cura', som: null },
    rajada: { nome: "Rajada", descricao: "Ataque em área que causa 1.5x dano em todos", custoMP: 10, cura: 0, alcance: 3, tipo: 'ataquearea', som: espada3 },
    corteArqueado: { nome: "Corte Arqueado", descricao: "Ataque rápido de longo alcance", custoMP: 12, cura: 0, alcance: 4, tipo: 'ataque', som: espada2 },
    determinacaoHorda: { nome: "Determinação da Horda", descricao: "Aumenta drasticamente a defesa física", custoMP: 15, cura: 0, alcance: 0, tipo: 'defesa', som: null }
};

/**
 * Tabela de evolução (Level Design): Mapeia em quais níveis uma habilidade é destravada.
 */
export const TABELA_PROGRESSAO_HABILIDADES: Record<number, Habilidade> = {
    3: COMPENDIO_HABILIDADES.cura,
    5: COMPENDIO_HABILIDADES.rajada,
    7: COMPENDIO_HABILIDADES.corteArqueado
};