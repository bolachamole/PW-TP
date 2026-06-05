import { Jogo } from "./Jogo.js";

export interface Estado {
    entrar(jogo: Jogo, app: HTMLElement, ...args: any[]): void;
    sair(): void;
}