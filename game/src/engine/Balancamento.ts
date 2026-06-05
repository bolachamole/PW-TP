export const BALANCAMENTO = {
    ECONOMIA: {
        CUSTO_UPGRADE_BASE: 50,
        PENALIDADE_OURO_MORTE: 0.40,
        PENALIDADE_XP_MORTE: 0.20,
        OURO_BASE_VITORIA: 1000000,
        OURO_ESCALA_MAPA: 5
    },
    PREDIOS: {
        BONUS_CURA_POR_NIVEL: 0.10,
        BONUS_XP_POR_NIVEL: 0.15
    },
    MONSTROS: {

        MULT_OURO_CAMALEAO: 1.0,
        MULT_OURO_CAODECACA: 1.2,
        MULT_OURO_VINHA: 1.1,
        MULT_OURO_ARANHA: 1.3,
        MULT_OURO_PASSARO: 1.4,
        MULT_OURO_LOUVADEUS: 1.5,
        MULT_OURO_MERCENARIO: 1.7,
        MULT_OURO_URSO: 2.0,
        MULT_OURO_BOSS: 5.0

    },
    BOSS: {

        HP_BASE: 150,
        HP_ESCALA: 30,
        ATK_BASE: 20,
        ATK_ESCALA: 5,
        DEF_BASE: 6,
        DEF_ESCALA: 1

    }

};

export function calcularCustoUpgrade(nivelAtual: number): number {

    return (nivelAtual + 1) * BALANCAMENTO.ECONOMIA.CUSTO_UPGRADE_BASE + nivelAtual ** 2;

}

export function calcularOuroBaseCombate(mapaAtual: number): number {

    return BALANCAMENTO.ECONOMIA.OURO_BASE_VITORIA + (mapaAtual * BALANCAMENTO.ECONOMIA.OURO_ESCALA_MAPA);

}