import { Entidade } from "./Entidade.js";
import { COMPENDIO_HABILIDADES, TABELA_PROGRESSAO_HABILIDADES } from "./Habilidades.js";
import { GerenciadorDeHabilidades } from "../engine/GerenciadorDeHabilidades.js";
import { magia2, BALANCAMENTO } from "../constants.js";
export class Jogador extends Entidade {
    // Inicialização orientada a dados a partir do arquivo de Balanceamento
    xp = BALANCAMENTO.JOGADOR.XP_INICIAL;
    xpParaProximoNivel = BALANCAMENTO.JOGADOR.XP_REQUISITO_INICIAL;
    pocoes = BALANCAMENTO.JOGADOR.POCOES_INICIAL;
    GerenciadorDeHabilidades = new GerenciadorDeHabilidades();
    STORAGE_KEY = BALANCAMENTO.JOGADOR.STORAGE_KEY;
    kills = 0;
    constructor() {
        // Inicializa os atributos e monta o kit de skills mapeando as chaves configuradas
        super(BALANCAMENTO.JOGADOR.NOME_PADRAO, BALANCAMENTO.JOGADOR.HP_INICIAL, BALANCAMENTO.JOGADOR.MP_INICIAL, BALANCAMENTO.JOGADOR.ATK_INICIAL, BALANCAMENTO.JOGADOR.DEF_INICIAL, BALANCAMENTO.JOGADOR.SKILLS_INICIAIS.map(chave => ({ ...COMPENDIO_HABILIDADES[chave] })));
        this.carregar();
    }
    // =========================================================================
    // PROPRIEDADES COMPUTADAS (PROXY DE META-PROGRESSÃO)
    // =========================================================================
    get habilidadeTemporaria() { return this.GerenciadorDeHabilidades.habilidadeTemporaria; }
    // =========================================================================
    // PERSISTÊNCIA ISOLADA
    // =========================================================================
    salvar() {
        const dadosDoSave = {
            nivel: this.nivel,
            xp: this.xp,
            xpParaProximoNivel: this.xpParaProximoNivel,
            hpMax: this.hpMax,
            mpMax: this.mpMax,
            atk: this.atk,
            defesa: this.defesa,
            habilidadesPermanentes: this.habilidades
                .filter(h => !this.habilidadeTemporaria || h.nome !== this.habilidadeTemporaria.nome)
                .map(h => h.nome)
        };
        //localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dadosDoSave));
        //console.log("[Save] Atributos e grimório do herói sincronizados.");
    }
    carregar() {
        const dadosSalvos = localStorage.getItem(this.STORAGE_KEY);
        if (!dadosSalvos)
            return;
        try {
            const dados = JSON.parse(dadosSalvos);
            this.nivel = dados.nivel ?? 1;
            this.xp = dados.xp ?? BALANCAMENTO.JOGADOR.XP_INICIAL;
            this.xpParaProximoNivel = dados.xpParaProximoNivel ?? BALANCAMENTO.JOGADOR.XP_REQUISITO_INICIAL;
            this.hpMax = dados.hpMax ?? BALANCAMENTO.JOGADOR.HP_INICIAL;
            this.mpMax = dados.mpMax ?? BALANCAMENTO.JOGADOR.MP_INICIAL;
            this.atk = dados.atk ?? BALANCAMENTO.JOGADOR.ATK_INICIAL;
            this.defesa = dados.defesa ?? BALANCAMENTO.JOGADOR.DEF_INICIAL;
            this.vivo = true;
            this.hp = this.hpMax;
            this.mp = this.mpMax;
            if (dados.habilidadesPermanentes && Array.isArray(dados.habilidadesPermanentes)) {
                this.habilidades = this.GerenciadorDeHabilidades.atualizarListaAtiva(this.habilidades, dados.habilidadesPermanentes);
            }
            console.log("[Save] Ficha do herói restaurada com sucesso.");
        }
        catch (e) {
            console.error("[ERRO] Falha crítica ao ler save do herói.", e);
        }
    }
    // =========================================================================
    // MATEMÁTICA DE PROGRESSÃO E COMBATE
    // =========================================================================
    ganharXP(quantidade) {
        const xpFinal = quantidade;
        this.xp += xpFinal;
        if (this.xp >= this.xpParaProximoNivel) {
            this.subirDeNivel();
            //this.salvar();
            return true;
        }
        //this.salvar();
        return false;
    }
    subirDeNivel() {
        this.xp -= this.xpParaProximoNivel;
        this.nivel++;
        // Multiplicadores e incrementos baseados inteiramente no arquivo de Balanceamento
        this.xpParaProximoNivel = Math.floor(this.xpParaProximoNivel * BALANCAMENTO.JOGADOR.MULT_XP_PROXIMO_NIVEL);
        this.hpMax += BALANCAMENTO.JOGADOR.CRESCIMENTO_HP;
        this.hp = this.hpMax;
        this.mpMax += BALANCAMENTO.JOGADOR.CRESCIMENTO_MP;
        this.mp = this.mpMax;
        this.atk += BALANCAMENTO.JOGADOR.CRESCIMENTO_ATK;
        this.defesa += BALANCAMENTO.JOGADOR.CRESCIMENTO_DEF;
        console.log(`[Evolução] John Ancestoor avançou para o Nível ${this.nivel}!`);
        const habilidadeNova = TABELA_PROGRESSAO_HABILIDADES[this.nivel];
        if (habilidadeNova) {
            this.GerenciadorDeHabilidades.registrarAprendizado(this.habilidades, habilidadeNova);
        }
    }
    usarPocao() {
        if (this.pocoes <= 0)
            return false;
        this.pocoes--;
        // Cura parametrizada dinamicamente
        this.curar(Math.floor(this.hpMax * BALANCAMENTO.JOGADOR.EFICACIA_POCAO_HP));
        magia2.play();
        return true;
    }
    aplicarCuraPosCombate() {
        const totalCura = this.hpMax;
        this.curar(totalCura);
        console.log(`[Efeito Passivo] Cura de acampamento ativada: +${totalCura} HP.`);
    }
    resetarParaNovoMapa() {
        this.hp = this.hpMax;
        this.mp = this.mpMax;
        this.pocoes = BALANCAMENTO.JOGADOR.RECARGA_POCOES_MAPA;
        this.vivo = true;
    }
    resetarParaNivel1() {
        this.nivel = 1;
        this.xp = BALANCAMENTO.JOGADOR.XP_INICIAL;
        this.xpParaProximoNivel = BALANCAMENTO.JOGADOR.XP_REQUISITO_INICIAL;
        this.hpMax = BALANCAMENTO.JOGADOR.HP_INICIAL;
        this.mpMax = BALANCAMENTO.JOGADOR.MP_INICIAL;
        this.atk = BALANCAMENTO.JOGADOR.ATK_INICIAL;
        this.defesa = BALANCAMENTO.JOGADOR.DEF_INICIAL;
        this.hp = this.hpMax;
        this.mp = this.mpMax;
        this.pocoes = BALANCAMENTO.JOGADOR.POCOES_INICIAL;
        this.vivo = true;
        this.defesaBonus = 0;
        this.habilidades = BALANCAMENTO.JOGADOR.SKILLS_INICIAIS.map(chave => ({ ...COMPENDIO_HABILIDADES[chave] }));
        this.kills = 0;
        localStorage.removeItem(this.STORAGE_KEY);
    }
    aplicarHabilidadeTemporaria(hab) {
        this.habilidades = this.GerenciadorDeHabilidades.mutarHabilidadeTemporaria(this.habilidades, hab);
    }
}
