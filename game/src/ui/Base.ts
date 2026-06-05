import { jogo } from "../engine/Jogo.js";
import { calcularCustoUpgrade, BALANCAMENTO } from "../engine/Balancamento.js";
import type { Habilidade } from "../entities/Entidade.js";

const HABILIDADES_DA_GUILDA: Habilidade[] = [
    {
        nome: "Ataque Preciso",
        descricao: "Causa dano garantido ignorando parte da defesa.",
        custoMP: 8,
        cura: 0,
        alcance: 2,
        tipo: 'ataque',
        som: null
    },
    {
        nome: "Fúria da Horda",
        descricao: "Ataque em área brutal que consome muita mana.",
        custoMP: 25,
        cura: 0,
        alcance: 3,
        tipo: 'ataquearea',
        som: null
    },
    {
        nome: "Vento Curativo",
        descricao: "Recupera 50% da vida máxima instantaneamente.",
        custoMP: 15,
        cura: 0.5,
        alcance: 0,
        tipo: 'cura',
        som: null
    }
];

export class Base {
    private elementoDOM: HTMLDivElement | null = null;

    public iniciarPartida(containerPai: HTMLElement): void {
        if (document.getElementById('base-forte')) return;

        this.elementoDOM = document.createElement('div');
        this.elementoDOM.id = 'base-forte';
        this.elementoDOM.className = 'base-forte';

        containerPai.appendChild(this.elementoDOM);
        this.renderizar();
    }

    public renderizar(): void {
        if (!this.elementoDOM) return;

        const jogador = jogo.jogador;

        const custoCura = calcularCustoUpgrade(jogador.nivelPredioCura);
        const custoTreino = calcularCustoUpgrade(jogador.nivelPredioTreinamento);
        const custoHab = calcularCustoUpgrade(jogador.nivelPredioHabilidades);

        const pctCuraExibicao = BALANCAMENTO.PREDIOS.BONUS_CURA_POR_NIVEL * 100;
        const pctXpExibicao = BALANCAMENTO.PREDIOS.BONUS_XP_POR_NIVEL * 100;

        let html = `
            <div class="base-cabecalho">
                <h1>Acampamento Ancestral</h1>
                <div class="status-global">
                    <span>Ouro Acumulado: <strong>${jogador.ouro}</strong> 💰</span>
                </div>
            </div>

            <div class="predios-container">
                <div class="predio-card">
                    <h3>Tenda de Cura (Nvl ${jogador.nivelPredioCura})</h3>
                    <p>Recupera <strong>${jogador.nivelPredioCura * pctCuraExibicao}%</strong> de HP após cada combate.</p>
                    <button class="btn-upgrade" data-predio="cura" data-custo="${custoCura}">
                        Melhorar Tenda (Custo: ${custoCura} Ouro)
                    </button>
                </div>

                <div class="predio-card">
                    <h3>Campo de Treino (Nvl ${jogador.nivelPredioTreinamento})</h3>
                    <p>Bônus de <strong>${jogador.nivelPredioTreinamento * pctXpExibicao}%</strong> no ganho de XP.</p>
                    <button class="btn-upgrade" data-predio="treinamento" data-custo="${custoTreino}">
                        Melhorar Campo (Custo: ${custoTreino} Ouro)
                    </button>
                </div>

                <div class="predio-card">
                    <h3>Guilda de Habilidades (Nvl ${jogador.nivelPredioHabilidades})</h3>
                    <p>Desbloqueia habilidades ativas para a próxima expedição.</p>
                    <button class="btn-upgrade" data-predio="habilidades" data-custo="${custoHab}">
                        Melhorar Guilda (Custo: ${custoHab} Ouro)
                    </button>
                    
                    <div class="secao-habilidades" style="margin-top: 15px;">
                        <h4>Equipar Habilidade Temporária:</h4>
                        <select id="select-habilidade" ${jogador.nivelPredioHabilidades === 0 ? 'disabled' : ''}>
                            <option value="-1">Nenhuma (Economizar Slot)</option>
                            ${HABILIDADES_DA_GUILDA.map((hab, index) => {
                                const disponivel = index < jogador.nivelPredioHabilidades;
                                const selecionado = jogador.habilidadeTemporaria?.nome === hab.nome ? 'selected' : '';
                                return `<option value="${index}" ${!disponivel ? 'disabled' : ''} ${selecionado}>
                                    ${hab.nome} ${!disponivel ? '(Requer Nvl ' + (index + 1) + ')' : ''}
                                </option>`;
                            }).join('')}
                        </select>
                    </div>
                </div>
            </div>

            <div class="base-controles">
                <button id="btn-iniciar-expedicao" class="btn-primario">Iniciar Expedição</button>
                <button id="btn-menu-inicial" class="btn-secundario">Voltar ao Menu</button>
            </div>
        `;

        this.elementoDOM.innerHTML = html;
        this.configurarEventos();
    }

    private configurarEventos(): void {
        if (!this.elementoDOM) return;

        const botoesUpgrade = this.elementoDOM.querySelectorAll('.btn-upgrade');
        botoesUpgrade.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target as HTMLButtonElement;
                const predio = target.getAttribute('data-predio');
                const custo = parseInt(target.getAttribute('data-custo') || '0');

                if (jogo.jogador.gastarOuro(custo)) {
                    console.log(`[DEBUG] Prédio ${predio} melhorado com sucesso!`);
                    if (predio === 'cura') jogo.jogador.nivelPredioCura++;
                    if (predio === 'treinamento') jogo.jogador.nivelPredioTreinamento++;
                    if (predio === 'habilidades') jogo.jogador.nivelPredioHabilidades++;
                    
                    jogo.jogador.salvar();
                    this.renderizar();
                } else {
                    alert("Ouro insuficiente para esta melhoria!");
                }
            });
        });

        const selectHabilidade = this.elementoDOM.querySelector('#select-habilidade') as HTMLSelectElement;
        if (selectHabilidade) {
            selectHabilidade.addEventListener('change', (e) => {
                const target = e.target as HTMLSelectElement;
                const index = parseInt(target.value);
                
                if (index === -1) {
                    jogo.jogador.aplicarHabilidadeTemporaria(null);
                } else {
                    jogo.jogador.aplicarHabilidadeTemporaria(HABILIDADES_DA_GUILDA[index]);
                }
                jogo.jogador.salvar();
            });
        }

        const btnMenuInicial = this.elementoDOM.querySelector('#btn-menu-inicial');
        const btnIniciarExpedicao = this.elementoDOM.querySelector('#btn-iniciar-expedicao');
        
        btnMenuInicial?.addEventListener('click', () => {
            this.fechar();
            jogo.iniciarMenu();
        });
    
        btnIniciarExpedicao?.addEventListener('click', () => {
            jogo.jogador.resetarParaNovoMapa();
            this.fechar();
            jogo.iniciarMundo();
        });
    }

    private fechar(): void {
        if (this.elementoDOM) {
            this.elementoDOM.remove();         
            this.elementoDOM = null; 
            console.log("[DEBUG] Base (Hamlet) fechada com sucesso.");
        }
    }
}