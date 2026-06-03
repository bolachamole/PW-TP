import { jogo } from "../engine/Jogo";
import { MenuConfigura } from "../ui/MenuConfigura";

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

        this.elementoDOM.innerHTML = `
            <h1>Caves of Memory</h1>
            <button id="btn-jogar">Novo Jogo</button>
            <button id="btn-configurar">Configurações</button>
        `;

        this.configurarEventos();

    }

    private configurarEventos(): void {

        if (!this.elementoDOM) return;

        const btnJogar = this.elementoDOM.querySelector('#btn-jogar');
        const btnConfigurar = this.elementoDOM.querySelector('#btn-configurar');
        
        btnJogar?.addEventListener('click', () => {
        
            console.log("[DEBUG] Botão Jogar clicado! Destruindo o menu...");
            
            this.fechar();
            
            jogo.iniciarPartida();

        });
    
        btnConfigurar?.addEventListener('click', () => {
        
            console.log("[DEBUG] Botão configurar clicado!");

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