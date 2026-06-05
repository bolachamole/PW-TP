import { jogo } from "../engine/Jogo.js";
import { MenuConfigura } from "../ui/MenuConfigura.js";
import { NavegacaoTecladoMenu } from "../ui/NavegacaoTecladoMenu.js";

export class MenuPrincipal {
  
    private elementoDOM: HTMLDivElement | null = null;
    private menuConfigura: MenuConfigura = new MenuConfigura();
    private navegacao?: NavegacaoTecladoMenu;  

    public abrir(containerPai: HTMLElement): void {
        if (document.getElementById('menu-principal')) return;

        this.elementoDOM = document.createElement('div');
        this.elementoDOM.id = 'menu-principal';
        this.elementoDOM.className = 'menu-screen';

        this.elementoDOM.style.backgroundImage = `
            linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8)), 
            url('wallpapers/wallpaper_menu.png')
        `;
        this.elementoDOM.style.backgroundSize = "cover"; // Faz a imagem preencher a tela toda
        this.elementoDOM.style.backgroundPosition = "center"; // Centraliza a arte
        this.elementoDOM.style.backgroundRepeat = "no-repeat"; // Impede que a imagem se repita se a tela for muito grande

        containerPai.appendChild(this.elementoDOM);
        this.conteudoInicialMenuPrincipal();
    }

    public conteudoInicialMenuPrincipal(): void {
        if (!this.elementoDOM) return;

        // Verifica dinamicamente no localStorage se existe progresso anterior salvo
        const temSaveAnterior = localStorage.getItem('caves_of_nodes_save') !== null;

        this.elementoDOM.innerHTML = `
            <h1>Caves of Nodes</h1>
            
            <h3>Setas para navegar, R para selecionar<h3>
            
            ${temSaveAnterior ? `<button id="btn-continuar" style="background-color: var(--success); color: white;">Continuar Jogo</button>` : ''}
            
            <button id="btn-jogar">${temSaveAnterior ? 'Novo Jogo (Apagar Progresso)' : 'Novo Jogo'}</button>
            <br></br>
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

        const elementos: HTMLElement[] = [];

        if (btnContinuar) {
            elementos.push(btnContinuar as HTMLElement);
        }

        elementos.push(btnJogar as HTMLElement);
        elementos.push(btnConfigurar as HTMLElement);

        this.navegacao?.destruir();

        this.navegacao =
            new NavegacaoTecladoMenu(elementos);

        this.navegacao.iniciar();
    }

    private fechar(): void {
        if (this.elementoDOM) {
            this.navegacao?.destruir();
            this.elementoDOM.remove();         
            this.elementoDOM = null; 
            console.log("[DEBUG] MenuPrincipal deletado com sucesso do DOM.");
        }
    }
}