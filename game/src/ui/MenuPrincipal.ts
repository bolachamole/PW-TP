import { jogo } from "../engine/Jogo.js";
import { MenuConfigura } from "../ui/MenuConfigura.js";

export class MenuPrincipal {
  
    private elementoDOM: HTMLDivElement | null = null;
    private menuConfigura: MenuConfigura = new MenuConfigura();

    public abrir(containerPai: HTMLElement): void {
        if (document.getElementById('menu-principal')) return;

        this.elementoDOM = document.createElement('div');
        this.elementoDOM.id = 'menu-principal';
        this.elementoDOM.className = 'menu-screen';

        containerPai.appendChild(this.elementoDOM);
        this.conteudoInicialMenuPrincipal();
    }

    public conteudoInicialMenuPrincipal(): void {
        if (!this.elementoDOM) return;

        // Verifica dinamicamente no localStorage se existe progresso anterior salvo
        const temSaveAnterior = localStorage.getItem('caves_of_memory_save') !== null;

        this.elementoDOM.innerHTML = `
            <h1>Caves of Memory</h1>
            
            ${temSaveAnterior ? `<button id="btn-continuar" style="background-color: var(--success); color: white;">Continuar Jogo</button>` : ''}
            
            <button id="btn-jogar">${temSaveAnterior ? 'Novo Jogo (Apagar Progresso)' : 'Novo Jogo'}</button>
            <button id="btn-configurar">Configurações</button>
        `;

        this.configurarEventos(temSaveAnterior);
    }

    private configurarEventos(temSaveAnterior: boolean): void {
        if (!this.elementoDOM) return;

        const btnContinuar = this.elementoDOM.querySelector('#btn-continuar');
        const btnJogar = this.elementoDOM.querySelector('#btn-jogar');
        const btnConfigurar = this.elementoDOM.querySelector('#btn-configurar');
        
        // Evento do botão Continuar Jogo
        if (temSaveAnterior && btnContinuar) {
            btnContinuar.addEventListener('click', () => {
                console.log("[DEBUG] Carregando a jornada salva...");
                this.fechar();
                jogo.continuarPartida();
            });
        }

        // Evento do botão Novo Jogo
        btnJogar?.addEventListener('click', () => {
            if (temSaveAnterior) {
                // Confirmação de segurança para evitar cliques acidentais que apaguem o progresso do usuário
                const confirmarSubescrita = confirm("Alerta: Existe um jogo salvo na memória. Começar um Novo Jogo apagará permanentemente todo o seu progresso anterior. Deseja continuar?");
                if (!confirmarSubescrita) return;
            }

            console.log("[DEBUG] Iniciando uma nova partida do zero absoluto...");
            this.fechar();
            jogo.novoJogoPartida();
        });
    
        btnConfigurar?.addEventListener('click', () => {
            console.log("[DEBUG] Acessando menu de configurações...");
            this.elementoDOM!.innerHTML = '';
            this.menuConfigura.abrir(this.elementoDOM!, () => {
                this.conteudoInicialMenuPrincipal();
            });
        });
    }

    private fechar(): void {
        if (this.elementoDOM) {
            this.elementoDOM.remove();         
            this.elementoDOM = null; 
            console.log("[DEBUG] MenuPrincipal deletado com sucesso do DOM.");
        }
    }
}