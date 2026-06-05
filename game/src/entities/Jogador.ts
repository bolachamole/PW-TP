import { Entidade, type Habilidade } from "./Entidade.js";
import { espada1, espada2, espada3 } from "./../constants.js";

const HABILIDADES_INICIAIS: Habilidade[] = [
    {
        nome: "Espadada",
        descricao: "Ataque simples com a espada",
        custoMP: 0,
        cura: 0,
        alcance: 2,
        tipo: 'ataque',
        som: espada1
    },
    {
        nome: "Golpe Forte",
        descricao: "Ataque poderoso que causa 2x dano",
        custoMP: 5,
        cura: 0,
        alcance: 2,
        tipo: 'ataque',
        som: espada2
    },
    {
        nome: "Postura Defensiva",
        descricao: "Dobra a defesa por um turno",
        custoMP: 3,
        cura: 0,
        alcance: 0,
        tipo: 'defesa',
        som: null
    },
    {
        nome: "Cura",
        descricao: "Recupera 30% da vida máxima",
        custoMP: 8,
        cura: 0.3,
        alcance: 0,
        tipo: 'cura',
        som: null
    },
    {
        nome: "Rajada",
        descricao: "Ataque em área que causa 1.5x dano em todos",
        custoMP: 10,
        cura: 0,
        alcance: 3,
        tipo: 'ataquearea',
        som: espada3
    }
];

export class Jogador extends Entidade {
    public xp: number;
    public xpParaProximoNivel: number;
    public pocoes: number;
    public mapaAtual: number;

    public ouro: number;
    public nivelPredioCura: number;
    public nivelPredioTreinamento: number;
    public nivelPredioHabilidades: number;
    public habilidadeTemporaria: Habilidade | null = null;

    private readonly STORAGE_KEY = 'caves_of_memory_save';

    constructor() {
    
        super("John Ancestoor", 100, 50, 15, 5, [...HABILIDADES_INICIAIS]);
        this.xp = 0;
        this.xpParaProximoNivel = 50;
        this.pocoes = 3;
        this.mapaAtual = 0;
        
    
        this.ouro = 0;
        this.nivelPredioCura = 0;
        this.nivelPredioTreinamento = 0;
        this.nivelPredioHabilidades = 0;

        this.carregar();
    }

    public salvar(): void {
    
        const dadosDoSave = {
    
            nivel: this.nivel,
            xp: this.xp,
            xpParaProximoNivel: this.xpParaProximoNivel,
            hpMax: this.hpMax,
            mpMax: this.mpMax,
            atk: this.atk,
            defesa: this.defesa,
            ouro: this.ouro,
            nivelPredioCura: this.nivelPredioCura,
            nivelPredioTreinamento: this.nivelPredioTreinamento,
            nivelPredioHabilidades: this.nivelPredioHabilidades
    
        };
    
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dadosDoSave));
    
        console.log("[DEBUG] Progresso do jogador salvo com sucesso.");
    
    }

    public carregar(): void {
    
        const dadosSalvos = localStorage.getItem(this.STORAGE_KEY);
    
        if (dadosSalvos) {
    
            try {
    
                const dados = JSON.parse(dadosSalvos);
                this.nivel = dados.nivel ?? 1;
                this.xp = dados.xp ?? 0;
                this.xpParaProximoNivel = dados.xpParaProximoNivel ?? 50;
                this.hpMax = dados.hpMax ?? 100;
                this.mpMax = dados.mpMax ?? 50;
                this.atk = dados.atk ?? 15;
                this.defesa = dados.defesa ?? 5;
                this.ouro = dados.ouro ?? 0;
                this.nivelPredioCura = dados.nivelPredioCura ?? 0;
                this.nivelPredioTreinamento = dados.nivelPredioTreinamento ?? 0;
                this.nivelPredioHabilidades = dados.nivelPredioHabilidades ?? 0;
                
                this.vivo = true;

                this.hp = this.hpMax;
                this.mp = this.mpMax;
    
                console.log("[DEBUG] Progresso do jogador carregado com sucesso.");
    
            } catch (e) {
    
                console.error("[ERRO] Erro ao ler dados salvos, iniciando novo jogo.", e);
    
            }
    
        }
    
    }

    public ganharXP(quantidade: number): boolean {

        
        const modificadorComBonus = 1.0 + (this.nivelPredioTreinamento * 0.15);
        const xpFinal = Math.floor(quantidade * modificadorComBonus);

        this.xp += xpFinal;
        
        if (this.xp >= this.xpParaProximoNivel) {

            this.subirDeNivel();
            this.salvar();
            return true;

        }
    
        this.salvar();
    
        return false;
    
    }

    private subirDeNivel(): void {
        this.xp -= this.xpParaProximoNivel;
        this.nivel++;
        this.xpParaProximoNivel = Math.floor(this.xpParaProximoNivel * 1.5);
        this.hpMax += 20;
        this.hp = this.hpMax;
        this.mpMax += 10;
        this.mp = this.mpMax;
        this.atk += 3;
        this.defesa += 1;
        console.log(`[DEBUG] Jogador subiu para o nível ${this.nivel}!`);
    }

    public ganharOuro(quantidade: number): void {
        this.ouro += quantidade;
        this.salvar();
    }

    public gastarOuro(quantidade: number): boolean {
        if (this.ouro >= quantidade) {
            this.ouro -= quantidade;
            this.salvar();
            return true;
        }
        return false;
    }

    public usarPocao(): boolean {
        if (this.pocoes <= 0) return false;
        this.pocoes--;
        this.curar(Math.floor(this.hpMax * 0.4));
        return true;
    }

    public aplicarCuraPosCombate(): void {
        if (this.nivelPredioCura > 0) {
            const pctCura = this.nivelPredioCura * 0.10; // 10% por nível
            const totalCura = Math.floor(this.hpMax * pctCura);
            this.curar(totalCura);
            console.log(`[DEBUG] Prédio de Cura curou o jogador em ${totalCura} HP.`);
        }
    }

    public resetarParaNovoMapa(): void {
        this.hp = this.hpMax;
        this.mp = this.mpMax;
        this.pocoes = 3;
        this.vivo = true;
    }

    public aplicarHabilidadeTemporaria(hab: Habilidade | null): void {
        if (this.habilidadeTemporaria) {
            this.habilidades = this.habilidades.filter(h => h.nome !== this.habilidadeTemporaria!.nome);
        }

        this.habilidadeTemporaria = hab;

        if (hab) {
            this.habilidades.push(hab);
            console.log(`[DEBUG] Habilidade temporária ativada para esta run: ${hab.nome}`);
        }
    }
}