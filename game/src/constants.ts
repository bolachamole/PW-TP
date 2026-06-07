export const SPRITES = {
    player: "sprites/PraetorianPrime.png",
    louvadeus: "sprites/Salthopper.png",
    cao: "sprites/Dog_cherub.png",
    urso: "sprites/Bear.png",
    camaleao: "sprites/Horned_chameleon.png",
    aranha: "sprites/Greater_voider.png",
    passaro: "sprites/White_esh.png",
    mercenario: "sprites/DreamTortoise.png",
    vinha: "sprites/Qudzu.png",
    boss: "sprites/StarEyeEsper.png",
    base: "sprites/Ovw_joppa.png",
    combate: "sprites/Lunge_skill.png",
    loja: "sprites/Elder_irudad.png",
    evento: "sprites/Chest.png" 
}

export const BALANCAMENTO = {
    BOSS: {
        HP_BASE: 150,
        HP_ESCALA: 30,
        ATK_BASE: 20,
        ATK_ESCALA: 5,
        DEF_BASE: 6,
        DEF_ESCALA: 1
    },
    JOGADOR: {
        NOME_PADRAO: "John Ancestoor",
        HP_INICIAL: 100,
        MP_INICIAL: 50,
        ATK_INICIAL: 15,
        DEF_INICIAL: 5,
        
        XP_INICIAL: 0,
        XP_REQUISITO_INICIAL: 50,
        POCOES_INICIAL: 3,
        MAPA_INICIAL: 0,
        
        // Atributos de Progressão por Level Up
        MULT_XP_PROXIMO_NIVEL: 1.5,
        CRESCIMENTO_HP: 20,
        CRESCIMENTO_MP: 10,
        CRESCIMENTO_ATK: 3,
        CRESCIMENTO_DEF: 1,
        
        // Mecânicas de Itens e Expedição
        EFICACIA_POCAO_HP: 0.40, // Recupera 40% da vida máxima
        RECARGA_POCOES_MAPA: 3,  // Quantidade de poções ao resetar run
        
        // Identificadores de Chaves e Identidade
        SKILLS_INICIAIS: ["espadada", "golpeForte", "posturaDefensiva"],
        STORAGE_KEY: "jogador_save"
    },
    MUNDO: {
        STORAGE_KEY: "caves_of_nodes_save"
    }
};

let pasta = "sons/";
export const espada1 = new Audio(`${pasta}espada1.mp3`);
export const espada2 = new Audio(`${pasta}espada2.mp3`);
export const espada3 = new Audio(`${pasta}espada3.mp3`);
export const magia1 = new Audio(`${pasta}magia1.mp3`);
export const magia2 = new Audio(`${pasta}magia2.mp3`);
export const insetos = new Audio(`${pasta}termites_and_ants-mike-koenig.mp3`);
export const pewpew = new Audio(`${pasta}Silencer-SoundBible.com-2147317264.mp3`);
export const corte = new Audio(`${pasta}corte1.mp3`);
export const uivo = new Audio(`${pasta}Coyote-howl.mp3`)
export const explosao1 = new Audio(`${pasta}explosao1.mp3`);
export const explosao2 = new Audio(`${pasta}explosao2.mp3`);
export const bounce = new Audio(`${pasta}Bounce-SoundBible.com-12678623.mp3`)
export const chicote = new Audio(`${pasta}chicote.mp3`);
export const urso = new Audio(`${pasta}urso.mp3`);
export const mordida = new Audio(`${pasta}Bite-SoundBible.com-2056759375.mp3`);
export const vitoria = new Audio(`${pasta}congrats.mp3`);
export const somGlobal = [espada1, espada2, espada3, magia1, magia2, insetos, pewpew, corte, uivo, explosao1, explosao2, bounce, chicote, urso, mordida, vitoria];