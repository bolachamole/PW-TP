# Modelo Game Design Document - GDD

![Miniatura do YouTube.jpg](Modelo%20Game%20Design%20Document%20-%20GDD/Miniatura_do_YouTube.jpg)

Versão do Documento: 0.1
Autor: Alexandre Prado
Data: 12/06/2024

# 1. Projeto e Visão geral do Jogo

---

## ⇒ 1.1  High Concept (Conceito geral)

RPG tático,combate por turnos estilo darkest dungeon, com mecânica rogue-like, focado em combate.

## ⇒ 1.2  Game Overview (Visão Geral do jogo)

O jogador começa no overworld ( árvore com vários nós), cada nó representa um evento aleatório: combate, recompensa ou power-up. Ao fim de cada mapa de overworld há um nó de boss, O jogo vai aumentando de dificuldade a medida que se vai avançando nos mapas.

## ⇒ 1.3  Título do jogo

slay the graph

## ⇒ 1.4  O que faz dele único?

Nada (nota de pw)

## ⇒ 1.5  Principais Gameplay Features (Recursos de Jogabilidade)

 - Sistema de combate por turnos.
 - Sistema de progressão de perssonagem.
 - Multiplas habilidades.
 - Multiplos Inimigos.
 - Sistema de mana



# 4. Jogabilidade I: OCR e 3Cs

## ⇒ 4.1  Objective, Challenge e Reward - OCR

## ⇒ 4.1.1  Objective

           Chegar no final do matar e vencer o Boss.  

## ⇒ 4.1.2  Challenge

           Inimigos espalhados pelo mapa.

## ⇒ 4.1.2  Reward

           XP

## ⇒ 4.2  Camera, Character e Control - 3 Cs

## ⇒ 4.2.1  Câmera

            top-down no overworld (grafo),
            side-scroling no combate

## ⇒ 4.2.2 Personagem

            John Ancestoor 

## ⇒ 4.2.3 Controle

            Teclado

            Janela de interação:  e;
            Botão de confirmação: r;
            Navegação : setas;




# 6. Jogabilidade III: Fluxo


## ⇒ 6.1  Quais são as recompensas no jogo?

    XP, Items (poções)

## ⇒ 6.2  Quais são os seus inimigos e desafios no jogo?

- Largartos
- Cachorros
- Ursos
- Louva Deus Gigante
- Vinhas vivas
- Aranhas Gigantes
- Pássaros

## ⇒ 6.3  Qual o tipo de fluxo do seu jogo?

- Entrar no mapa
- Selecionar um nó adjacente
- Passar pelo evento do nó (combate, loja ou evento)
- Voltar para o mapa

# 8. Mecânicas

## ⇒ 8.1  Descreva a mecânica principal do seu jogo

Mecânicas do Personagems:

- Pontos de Vida
- Pontos de Mana
- Pool de xp
- Lista de habiliades com 5 slots


A mecânica de combate funciona da seguinte forma:

Existes dois turnos: o do personagem e o dos inimigos, então o fluxo de combate se dá por:

personagem->inimigos->personagem->inimigos->personagem->inimigos->personagem->inimigos

No turno do personagem padrão ele pode:

- Atacar 1 vez
- Andar 10 quadros
- Usar 1 poção




## ⇒ 8.2  Liste 3 regras do seu jogo

- Quando os pontos de vida do persogem cairem para zero é Game Over
- Quando todos os inimigos de um mapo forem derrotados o jogador pode ir pro nó adiante
- O jogador só pode seguir adiante no overworld

## ⇒ 8.3  Liste 3 parâmetros que você vai utilizar na sua mecânica principal

- Pontos de ataque
- Pontos de defesa
- Pontos de vida

# 9. Level Design I: Tutorial e Progressão

## ⇒ 9.1  Tipo de tutorial você vai utilizar

- Janela de dicas do browser

## ⇒ 9.2  Power-ups (se houver)

- Loja de power ups que usa xp como moeda

# 10. Level Design II: Níveis de Dificuldade

## ⇒ 10.1  Níveis de dificuldade que o player irá enfrentar

- A cada novo mapa o número de inimigos aumenta em 1.2x
- Novos inimigos aparecem a medida que se progredi para novos mapas


# 11. Level Design III: Comportamento dos Inimigos

## ⇒ 11.1  Liste o comportamento de todos os inimigos
Mecânicas dos Inimigos:

- Pontos de Vida
- Pontos de Mana
- Lista de habiliades

No turno dos inimigos:

- Todos se movem ao mesmo tempo
- Todos atacam

# 12. Level Design IV: Balanceamento

## ⇒ 12.1  Liste os sistemas de mecânicas que poderão receber balanceados durante o jogo

- Pontos de vida nos inimigos
- Pontos de mana dos inimigos
- Lista de habiliades do inimigos
- Quantidade de inimigos
- Número de nós de inimigos
- Pontos de vida do jogador
- Pontos de mana do jogador
- Lista de habiliades do jogador

# 13. História e Narrativa

## ⇒ 13.1  Defina o estilo da narrativa do jogo

Fantasia



## ⇒ 13.2  Em até 2 parágrafos, resuma como será a história do jogo

<TODO>


# 15. UI/UX Interface do usuário

## ⇒ 15.1 Liste todas as telas de interface do usuário incluindo HUD

- Lista de habilidades (inimigos e personagem)
    - personagem: Estilo moba, barra na parte inferior da telam como habilidaes   associadas a um atalho
    - inimigo: Lista horiontal simples

- Barra de pontos de vida (inimigos e personagem)
- Barra de pontos de mana (inimigos e personagem)
- Barra de xp (somente pro personagem)
- Mapa de overwolrd: Grafo com nós de combate, eventos ou loja
- Mapa de combate: Top-down dividido em quadrados
- Loja de habilidades: Lista vertical simples
- Tela de pause
- Tela de game over

## ⇒ 15.2 Fluxo de funcionamento dos botões de todas as telas

- Lista de habilidades:

- Mapa de overwolrd:
            interação:  e;
            Botão de confirmação: r;
            Navegação : setas;

- Tela de pause:
            Botão de confirmação: r;
            Navegação : setas;

- Loja de habilidades:
            interação:  e;
            Botão de confirmação: r;
            Navegação : setas;

## ⇒ 15.3 Fluxo de funcionamento dos informações da HUD que estarão diretamente ligadas a gameplay

- Lista de habilidades:
            Habilidade 1: a
            Habilidade 2: s
            Habilidade 3: d
            Habailidade 4: f
            Habailidade 5: g
- Mapa de combate:
            interação:  e;
            Botão de confirmação: r;
            Navegação : setas;

---

# **Referências de imagens**

[](https://www.notion.so)

[](https://www.notion.so)

[](https://www.notion.so)

# **Referências de videos**

[https://www.notion.so](https://www.notion.so)

[https://www.notion.so](https://www.notion.so)

[https://www.notion.so](https://www.notion.so)

# **Referências de audios**

[https://www.notion.so](https://www.notion.so)

[https://www.notion.so](https://www.notion.so)

[https://www.notion.so](https://www.notion.so)

# **Anexo de arquivos**

[https://www.notion.so](https://www.notion.so)

[https://www.notion.so](https://www.notion.so)

[https://www.notion.so](https://www.notion.so)

Adicione quantas referências achar necessário

---

<aside>
<img src="https://www.notion.so/icons/video-game-classic_blue.svg" alt="https://www.notion.so/icons/video-game-classic_blue.svg" width="40px" /> Editado e melhorado por [Fork Games ST](https://www.forkgamesst.com/) a partir do Template do [Game Dev Tales](https://www.notion.so/e1fd596e628d4ef28b5e693da3a3534b?pvs=21).

                                                                                                                                                                                                                                                                              

---

Se esse template foi útil para você não deixe de nos seguir nos links a baixo:

---

<aside>
<img src="https://www.notion.so/icons/alien-pixel_blue.svg" alt="https://www.notion.so/icons/alien-pixel_blue.svg" width="40px" /> [**INSTAGRAM**](https://www.instagram.com/forkgamesst/)

</aside>

<aside>
<img src="https://www.notion.so/icons/globe_blue.svg" alt="https://www.notion.so/icons/globe_blue.svg" width="40px" /> [**SITE**](https://www.forkgamesst.com/)

</aside>

<aside>
<img src="https://www.notion.so/icons/username_blue.svg" alt="https://www.notion.so/icons/username_blue.svg" width="40px" /> **forkgamesst@gmail.com**

</aside>

---

Sinta-se a vontade para compartilhar e usar esse template como achar melhor. 😉

</aside>
