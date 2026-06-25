import type { Creditos, Integrantes, Prof, Technologies } from "./helperTypes.js";

export function listProfs(profs: Prof[]){
    const list = profs.map((p)=>`<li>${p.nome}-${p.sala}</li>`);
    return `<ul>${list.join('')}</ul>`;
}

export function listTechs(technologies: Technologies[]){
    const list = technologies.filter((t)=>t.poweredByNodejs === true).map((t)=>`<li>${t.name} - ${t.type}</li>`);
    return `<ul>${list.join('')}</ul>`;
}

export function listIntegrantes(integrantes: Integrantes[]){
    const list = integrantes.map((i)=>`<li>${i.nome}: ${i.funcao}</li>`);
    return `<ul>${list.join('')}</ul>`;
}

export function listCredits(sons: Creditos[], sprites: Creditos[]){
    const listSons = sons.map((s)=>`<li><a href="${s.url}">${s.titulo}</a></li>`);
    const listSprites = sprites.map((s)=>`<li><a href="${s.url}">${s.titulo}</a></li>`);
    return `<p>Efeitos sonoros:</p><ul>${listSons.join('')}</ul>\n<p>Sprites:</p><ul>${listSprites.join('')}</ul>`;
}