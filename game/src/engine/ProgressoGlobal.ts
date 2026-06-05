type TipoPredio = 'cura' | 'treinamento' | 'habilidades';

class ProgressoGlobal {
    
    private readonly STORAGE_KEY = 'caves_of_memory_progresso';
    
    public ouro: number = 0;
    public nivelPredioCura: number = 0;
    public nivelPredioTreinamento: number = 0;
    public nivelPredioHabilidades: number = 0;

    public habilidadeBonusProximaRun: string | null = null;

    constructor() {

        this.carregar();

    }

    public salvar(): void {

        const dadosParaSalvar = {

            ouro: this.ouro,
            nivelPredioCura: this.nivelPredioCura,
            nivelPredioTreinamento: this.nivelPredioTreinamento,
            nivelPredioHabilidades: this.nivelPredioHabilidades,
            habilidadeBonusProximaRun: this.habilidadeBonusProximaRun

        };

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dadosParaSalvar));
        console.log('[DEBUG] Progresso global salvo com sucesso.');

    }

    public carregar(): void {
    
        const dadosSalvos = localStorage.getItem(this.STORAGE_KEY);
    
        if (dadosSalvos) {
    
            try {
    
                const dados = JSON.parse(dadosSalvos);
                this.ouro = dados.ouro ?? 0;
                this.nivelPredioCura = dados.nivelPredioCura ?? 0;
                this.nivelPredioTreinamento = dados.nivelPredioTreinamento ?? 0;
                this.nivelPredioHabilidades = dados.nivelPredioHabilidades ?? 0;
                this.habilidadeBonusProximaRun = dados.habilidadeBonusProximaRun ?? null;
                console.log('[DEBUG] Progresso global carregado do localStorage.');
    
            } catch (e) {
    
                console.error('[ERRO] Falha ao carregar progresso, resetando para o padrão.', e);
    
            }
    
        }
    
    }

    public adicionarOuro(quantidade: number): void {
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

    public melhorarPredio(tipo: TipoPredio, custo: number): boolean {
    
        if (!this.gastarOuro(custo)) {
    
            return false;
    
        }

        if (tipo === 'cura') this.nivelPredioCura++;
        else if (tipo === 'treinamento') this.nivelPredioTreinamento++;
        else if (tipo === 'habilidades') this.nivelPredioHabilidades++;

        this.salvar();
        return true;
    
    }

    public getModificadorCuraPosCombate(): number {
    
        return this.nivelPredioCura * 0.10; 
    
    }

    public getModificadorXP(): number {
    
        return 1.0 + (this.nivelPredioTreinamento * 0.15);
    
    }

    public consumirHabilidadeTemporaria(): string | null {
    
        const skill = this.habilidadeBonusProximaRun;
        this.habilidadeBonusProximaRun = null;
        this.salvar();
    
        return skill;
    
    }

}

export const progressoGlobal = new ProgressoGlobal();