import { jogo } from "../engine/Jogo.js";
import { calcularCustoUpgrade, BALANCAMENTO } from "../engine/Balancamento.js";
import type { Habilidade } from "../entities/Entidade.js";
import { NavegacaoTecladoMenu } from "../ui/NavegacaoTecladoMenu.js";

const HABILIDADES_DA_GUILDA: Habilidade[] = [
    { nome: "Ataque Preciso", descricao: "Causa dano garantido ignorando parte da defesa.", custoMP: 8, cura: 0, alcance: 2, tipo: 'ataque', som: null, multiplicador: 1.5 },
    { nome: "Fúria da Horda", descricao: "Ataque em área brutal que consome muita mana.", custoMP: 25, cura: 0, alcance: 3, tipo: 'ataquearea', som: null, multiplicador: 1.3 },
    { nome: "Vento Curativo", descricao: "Recupera 50% da vida máxima instantaneamente.", custoMP: 15, cura: 0.5, alcance: 0, tipo: 'cura', som: null }
];

export class Base {
    private elementoDOM: HTMLDivElement | null = null;
    private modalDOM: HTMLDivElement | null = null; // Container separado para o popup
    private navegacao?: NavegacaoTecladoMenu;

    public iniciarPartida(containerPai: HTMLElement): void {
        if (document.getElementById('base-forte')) return;

        this.elementoDOM = document.createElement('div');
        this.elementoDOM.id = 'base-forte';
        this.elementoDOM.className = 'base-forte';

        containerPai.appendChild(this.elementoDOM);
        this.renderizar();
    }

    public renderizar(): void {
        this.navegacao?.destruir();
        if (!this.elementoDOM) return;
        const jogador = jogo.jogador;

        // Limpa o conteúdo para redesenhar a base atualizada
        this.elementoDOM.innerHTML = `
            <div class="base-cabecalho">
                <h1>Acampamento Ancestral</h1>
                <div class="status-global">
                    <span>Ouro Acumulado: <strong>${jogador.ouro}</strong> 💰</span>
                </div>
            </div>

            <div class="base-cenario">
                
                <div class="predio-slot" id="slot-taverna" style="left: 10%; top: 35%;">
                    <img src="${this.obterImagemTaverna(jogador.nivelPredioCura)}" alt="Taverna">
                    <div class="predio-nome">Taverna (Nv.${jogador.nivelPredioCura})</div>
                </div>

                <div class="predio-slot" id="slot-treino" style="left: 65%; top: 38%;">
                    <img src="${this.obterImagemTreino()}" alt="Treino">
                    <div class="predio-nome">Treino (Nv.${jogador.nivelPredioTreinamento})</div>
                </div>

                <div class="predio-slot" id="slot-guilda" style="left: 44%; top: 6%;">
                    <img src="${this.obterImagemGuilda(jogador.nivelPredioHabilidades)}" alt="Guilda">
                    <div class="predio-nome">Guilda (Nv.${jogador.nivelPredioHabilidades})</div>
                </div>

            </div>

            <div class="base-controles">
                <button id="btn-iniciar-expedicao" class="btn-primario">Iniciar Expedição</button>
                <button id="btn-menu-inicial" class="btn-secundario">Voltar ao Menu</button>
            </div>
        `;

        this.configurarEventosCenario();
    }

    // --- LÓGICA DE DEFINIÇÃO VISUAL DOS PRÉDIOS ---

    private obterImagemTaverna(nivel: number): string {
        if (nivel === 1 || nivel === 0) return '/base/taverna_1.png';
        if (nivel === 2) return '/base/taverna_2.png';
        return '/base/taverna_3.png'; // Nível 3 ou superior
    }

    private obterImagemTreino(): string {
        return '/base/treino_1.png'; // Campo de treino só tem 1 visual
    }

    private obterImagemGuilda(nivel: number): string {
        if (nivel === 1 || nivel === 0) return '/base/guilda_1.png';
        if (nivel === 2) return '/base/guilda_2.png';
        return '/base/guilda_3.png';
    }

    // --- EVENTOS DE CLIQUE NOS PRÉDIOS ---

    private configurarEventosCenario(): void {

        if (!this.elementoDOM) return;

        const slotTaverna =
            this.elementoDOM.querySelector<HTMLElement>(
                '#slot-taverna'
            );

        const slotTreino =
            this.elementoDOM.querySelector<HTMLElement>(
                '#slot-treino'
            );

        const slotGuilda =
            this.elementoDOM.querySelector<HTMLElement>(
                '#slot-guilda'
            );

        const btnExpedicao =
            this.elementoDOM.querySelector<HTMLElement>(
                '#btn-iniciar-expedicao'
            );

        const btnMenu =
            this.elementoDOM.querySelector<HTMLElement>(
                '#btn-menu-inicial'
            );

        slotTaverna?.addEventListener('click', () => {
            this.abrirPopupTaverna();
        });

        slotTreino?.addEventListener('click', () => {
            this.abrirPopupTreino();
        });

        slotGuilda?.addEventListener('click', () => {
            this.abrirPopupGuilda();
        });

        btnExpedicao?.addEventListener('click', () => {

            jogo.jogador.resetarParaNovoMapa();

            this.fechar();

            jogo.iniciarMundo();

        });

        btnMenu?.addEventListener('click', () => {

            this.fechar();

            jogo.iniciarMenu();

        });

        this.navegacao?.destruir();

        const elementos: HTMLElement[] = [];

        if (slotGuilda) elementos.push(slotGuilda);
        if (slotTaverna) elementos.push(slotTaverna);
        if (slotTreino) elementos.push(slotTreino);
        if (btnExpedicao) elementos.push(btnExpedicao);
        if (btnMenu) elementos.push(btnMenu);

        this.navegacao = new NavegacaoTecladoMenu(
            elementos
        );

        this.navegacao.iniciar();

    }

    // --- CONSTRUTOR DE POPUPS (MODALS MANUAIS) ---

    private abrirPopupBase(titulo: string, conteudoHTML: string, callbackConfigurarEventos: (modal: HTMLDivElement) => void): void {
        if (this.modalDOM) this.fecharPopup(); // Previne duplicação

        this.modalDOM = document.createElement('div');
        this.modalDOM.className = 'modal-overlay'; // Cobre a tela inteira
        
        this.modalDOM.innerHTML = `
            <div class="modal-conteudo">
                <button class="btn-fechar-popup">X</button>
                <h2>${titulo}</h2>
                <div class="modal-corpo">
                    ${conteudoHTML}
                </div>
            </div>
        `;

        this.elementoDOM?.appendChild(this.modalDOM);

        // Configura o evento do botão de fechar genérico
        this.modalDOM.querySelector('.btn-fechar-popup')?.addEventListener('click', () => {
            this.fecharPopup();
        });

        // Executa a injeção dos eventos específicos deste prédio
        callbackConfigurarEventos(this.modalDOM);

        const navegaveis =
            Array.from(
                this.modalDOM.querySelectorAll(
                    'button, select'
                )
            ) as HTMLElement[];

        this.navegacao?.destruir();

        this.navegacao =
            new NavegacaoTecladoMenu(
                navegaveis,
                () => this.fecharPopup()
            );

        this.navegacao.iniciar();

    }

    private fecharPopup(): void {
        if (this.modalDOM) {
            this.modalDOM.remove();
            this.modalDOM = null;
        }
        this.renderizar(); // Re-renderiza a base para atualizar a carteira de ouro ou imagens dos prédios
    }

    // --- CONTEÚDOS ESPECÍFICOS DE CADA PRÉDIO ---

    private abrirPopupTaverna(): void {
        const jogador = jogo.jogador;
        const custo = calcularCustoUpgrade(jogador.nivelPredioCura);
        const pctCuraExibicao = BALANCAMENTO.PREDIOS.BONUS_CURA_POR_NIVEL * 100;

        const html = `
            <p>A Taverna oferece descanso. Recupera <strong>${jogador.nivelPredioCura * pctCuraExibicao}%</strong> de HP após cada combate.</p>
            <button class="btn-upgrade" data-custo="${custo}">
                Melhorar Taverna (Custo: ${custo} Ouro)
            </button>
        `;

        this.abrirPopupBase(`Taverna (Nvl ${jogador.nivelPredioCura})`, html, (modal) => {
            modal.querySelector('.btn-upgrade')?.addEventListener('click', (_e) => {
                if (jogo.jogador.gastarOuro(custo)) {
                    jogo.jogador.nivelPredioCura++;
                    jogo.jogador.salvar();
                    this.fecharPopup();
                    this.abrirPopupTaverna(); // Reabre atualizado
                } else {
                    alert("Ouro insuficiente!");
                }
            });
        });
    }

    private abrirPopupTreino(): void {
        const jogador = jogo.jogador;
        const custo = calcularCustoUpgrade(jogador.nivelPredioTreinamento);
        const pctXpExibicao = BALANCAMENTO.PREDIOS.BONUS_XP_POR_NIVEL * 100;

        const html = `
            <p>Manequins e alvos. Bônus de <strong>${jogador.nivelPredioTreinamento * pctXpExibicao}%</strong> no ganho de XP.</p>
            <button class="btn-upgrade" data-custo="${custo}">
                Melhorar Campo (Custo: ${custo} Ouro)
            </button>
        `;

        this.abrirPopupBase(`Campo de Treino (Nvl ${jogador.nivelPredioTreinamento})`, html, (modal) => {
            modal.querySelector('.btn-upgrade')?.addEventListener('click', () => {
                if (jogo.jogador.gastarOuro(custo)) {
                    jogo.jogador.nivelPredioTreinamento++;
                    jogo.jogador.salvar();
                    this.fecharPopup();
                    this.abrirPopupTreino();
                } else {
                    alert("Ouro insuficiente!");
                }
            });
        });
    }

    private abrirPopupGuilda(): void {
        const jogador = jogo.jogador;
        const custo = calcularCustoUpgrade(jogador.nivelPredioHabilidades);

        const html = `
            <p>Desbloqueia habilidades ativas para a próxima expedição.</p>
            <button class="btn-upgrade" data-custo="${custo}">
                Melhorar Guilda (Custo: ${custo} Ouro)
            </button>
            <hr style="margin: 15px 0;">
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
        `;

        this.abrirPopupBase(`Guilda de Habilidades (Nvl ${jogador.nivelPredioHabilidades})`, html, (modal) => {
            // Lógica do Upgrade
            modal.querySelector('.btn-upgrade')?.addEventListener('click', () => {
                if (jogo.jogador.gastarOuro(custo)) {
                    jogo.jogador.nivelPredioHabilidades++;
                    jogo.jogador.salvar();
                    this.fecharPopup();
                    this.abrirPopupGuilda();
                } else {
                    alert("Ouro insuficiente!");
                }
            });

            // Lógica do Select de Habilidades
            const selectHabilidade = modal.querySelector('#select-habilidade') as HTMLSelectElement;
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
        });
    }

    private fechar(): void {

        this.navegacao?.destruir();
        this.navegacao = undefined;

        if (this.modalDOM) {
            this.modalDOM.remove();
            this.modalDOM = null;
        }

        if (this.elementoDOM) {
            this.elementoDOM.remove();
            this.elementoDOM = null;
        }

    }
}