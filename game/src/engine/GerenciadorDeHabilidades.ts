import type { Habilidade } from "../entities/Entidade.js";
import { COMPENDIO_HABILIDADES } from "../entities/Habilidades.js";

export class GerenciadorDeHabilidades {
    public habilidadeTemporaria: Habilidade | null = null;

    /**
     * Sincroniza e reconstrói o array ativo de habilidades injetando a lista permanente + temporária
     */
    public atualizarListaAtiva(_habilidadesAtuais: Habilidade[], nomesSalvos: string[]): Habilidade[] {
        const novaLista: Habilidade[] = [];
        
        // Reconstrói as permanentes a partir do modelo centralizado
        for (const nome of nomesSalvos) {
            const modelo = Object.values(COMPENDIO_HABILIDADES).find(h => h.nome === nome);
            if (modelo) novaLista.push({ ...modelo });
        }

        // Re-acopla o bônus temporário se ele existir
        if (this.habilidadeTemporaria) {
            novaLista.push({ ...this.habilidadeTemporaria });
        }

        return novaLista;
    }

    /**
     * Insere uma nova técnica permanente na árvore, validando duplicatas
     */
    public registrarAprendizado(listaAtiva: Habilidade[], novaHab: Habilidade): boolean {
        const jaConhece = listaAtiva.some(h => h.nome === novaHab.nome);
        if (jaConhece) return false;

        listaAtiva.push({ ...novaHab });
        console.log(`[Grimório] Nova técnica dominada: ${novaHab.nome}`);
        return true;
    }

    /**
     * Aplica ou substitui a habilidade temporária comprada na base
     */
    public mutarHabilidadeTemporaria(listaAtiva: Habilidade[], novaHab: Habilidade | null): Habilidade[] {
        let filtrada = listaAtiva;
        
        // Remove a temporária antiga se ela existir no array ativo
        if (this.habilidadeTemporaria) {
            filtrada = listaAtiva.filter(h => h.nome !== this.habilidadeTemporaria!.nome);
        }

        this.habilidadeTemporaria = novaHab;

        // Injeta a nova se não for nula
        if (novaHab) {
            filtrada.push({ ...novaHab });
            console.log(`[Grimório] Técnica temporária acoplada: ${novaHab.nome}`);
        }

        return filtrada;
    }
}