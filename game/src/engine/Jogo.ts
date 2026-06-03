import { Base } from "../ui/Base";
import { MenuPrincipal } from "../ui/MenuPrincipal";

export type EstadoJogo = 'MenuInicial' | 'Base' | 'Mundo' | 'Combate' | 'Pause' | 'Derrota';

class Jogo {

    app: HTMLElement;

    private menuPrincipal: MenuPrincipal = new MenuPrincipal();
    private estadoAtual: EstadoJogo = 'MenuInicial';
    private base: Base = new Base();

    constructor(){
    
        this.app = document.getElementById("app")!;
    
    }

    private mudarEstado(novoEstado: EstadoJogo): void {

        this.estadoAtual = novoEstado;

        console.log(`[DEBUG] Estado alterado para ${novoEstado}`);

    }

    public executando (){

        if (this.estadoAtual == 'MenuInicial') {
            
            this.menuPrincipal.abrir(this.app);
        
        }

        if (this.estadoAtual == 'Base') {
            this.base.iniciarPartida(this.app);
        }

    }

    public iniciarPartida(): void {
        
        this.mudarEstado('Base');

        this.executando();

    }

    public iniciarMenu(): void {

        this.mudarEstado('MenuInicial');

        this.executando();

    }

}

export const jogo = new Jogo();