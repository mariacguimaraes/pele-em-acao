# Comparativo: main × `feat/reestrutura-abertura-menu-bloco1`

Data: 19/11/2026 · Escopo: Abertura, Menu e Bloco 1 · Capturas em [`docs/comparativo/`](comparativo/) (janela de 1440×900).

## Links

| Versão | Endereço |
|---|---|
| Branch nova, local | <http://localhost:8000/> (tem `?cena=<id>` para abrir direto numa cena) |
| Branch nova, preview da Vercel | <https://pele-em-acao-git-feat-reestrutura-abertura-0ec4b0-projects-8325.vercel.app/> (pede login na Vercel) |
| Main (produção) | <https://pele-em-acao.vercel.app/> |
| Main, dentro da branch | `/legado/` (no localhost ou no preview) |

---

## 1. Tela por tela

Status: **ok** = resolvido e testado · **parcial** = funciona, com ressalva · **pendente** = não feito.

| Tela | Como era na main | Como ficou | Problema resolvido | Status | Captura |
|---|---|---|---|---|---|
| **Abertura · Tela inicial** | Título em texto solto; botões "Começar" (centro) e "Sobre" (canto superior esquerdo). | Logo como asset (`ui-logo`), "Iniciar o jogo" no centro e "Sobre o jogo" no canto inferior direito, como no roteiro 2.0. Foco inicial já no botão principal. | Rótulos e posições seguem o roteiro; o logo entra sozinho quando o arquivo existir. | ok | [01](comparativo/01-inicio-lado-a-lado.png) |
| **Abertura · Sobre o jogo** | Painel por cima de tudo, montado com HTML solto. | Painel na camada 4, com véu, textos vindos de `js/data/` e foco devolvido ao botão "Sobre o jogo" ao fechar. | Texto separado do código; foco previsível. | ok | [02](comparativo/02-sobre-lado-a-lado.png) |
| **Abertura · Boas-vindas** | Caixa de diálogo maior que o palco (cortada à direita) e com altura variável. | Caixa fixa (1238×186) com avatar; "Pular abertura" funciona mesmo com a fala aberta. | Caixa fixa e inteira dentro do palco. | ok | [03](comparativo/03-boas-vindas-lado-a-lado.png) |
| **Menu · Seleção de caso** | Cards e fala ao mesmo tempo; dava para clicar atrás da fala. | Card do Sr. João com estado "Disponível", cards bloqueados com cadeado e estado "Bloqueado" em texto; "Iniciar atendimento" aparece acima da área da caixa. | Fluxo travado até a fala terminar; o estado não depende só da cor. | parcial (o roteiro pede o botão "Selecionar paciente" dentro do card; pergunta 12) | [04](comparativo/04-selecao-lado-a-lado.png) |
| **Menu · Leito do Sr. João** | 4 falas; caixa cortada. | 4 falas; caixa fixa; botão Voltar. | Layout da caixa. | ok | [05](comparativo/05-leito-lado-a-lado.png) |
| **Menu · Investigação clínica** | 3 pistas, contador na parte de baixo (sob a caixa). | 3 pistas; contador no alto (`role=status`); pista vista fica tracejada e verde, e o leitor de tela ouve "(visto)". | O contador não fica mais escondido pela caixa. | ok | [06](comparativo/06-investigacao-lado-a-lado.png) |
| **Menu · Priorização** | Botões deslocados e cortados na borda esquerda; a última linha ficava sob a caixa. | 4 botões em 2 linhas (y 200 e 360) e "Escolher prioridade" em y 530, tudo acima da caixa; bloco feito fica desativado com ✓. | Nada fica sob a caixa; posições estáveis. | ok | [07](comparativo/07-priorizacao-lado-a-lado.png) |
| **Bloco 1 · Cena 1 · Introdução** | 2 falas; caixa cortada. | 2 falas; caixa fixa; botão Pausar. | Layout da caixa. | ok | [08](comparativo/08-b1-intro-lado-a-lado.png) |
| **Bloco 1 · Cena 1 · Escala de Braden** | Gaveta da ficha do topo ao rodapé (sob a caixa); "Informações" no canto inferior esquerdo, sob o avatar. | Gaveta de 480 px que termina acima da caixa, com rótulo e campo lado a lado; "Informações" no canto superior direito; contagem "x/6 preenchidos" anunciada. | Ficha e caixa nunca se sobrepõem. | ok | [09](comparativo/09-b1-braden-lado-a-lado.png) |
| **Bloco 1 · Cena 1.1 · Gabarito** | Véu e painel desalinhados; **a fala da Camila ficava atrás do véu** (z-index 40 × 30). | Painel acima da caixa (y 40–480), sem véu, com ✓/✗ em texto além da cor; a fala fica por cima e legível. A penalidade é aplicada só uma vez. | A devolutiva fica legível junto com o gabarito. | ok | [10](comparativo/10-b1-gabarito-lado-a-lado.png) |
| **Bloco 1 · Cena 2 · Inspeção** | 5 pontos; o subtítulo mudava pela contagem, e não pelo ponto clicado. | 5 pontos com nomes acessíveis ("Ponto A · ombro esquerdo"…); a ferramenta "Dígito-pressão" aparece no dock depois do ponto C. | Subtítulo inconsistente removido. | ok | [11](comparativo/11-b1-inspecao-lado-a-lado.png) |
| **Bloco 1 · Cena 2 · Dígito-pressão** | Segurar por 5 s com mouse ou espaço; anel sem número. | Segurar por 5 s com mouse, toque, **espaço ou Enter**; anel + contador "2,4 s / 5 s" + `progressbar` para leitor de tela; resultado pela ordem (branqueia × LP estágio 1). | Mais formas de acionar e feedback do tempo em texto. | parcial (exige segurar; pergunta 14) | [12](comparativo/12-b1-digito-lado-a-lado.png) |
| **Bloco 1 · Cena 2 · Pele negra** | Painel com véu. | Painel com véu, ilustração como asset do manifesto e "Ciente / Entendido" com foco automático; volta à priorização com o Bloco 1 marcado como feito. | Foco e asset padronizados. | ok | [13](comparativo/13-b1-pele-negra-lado-a-lado.png) |
| **Texto longo na caixa** | A caixa crescia com o texto e passava do palco. | A caixa continua com 1238×186; o texto é dividido em páginas ("1/2", "Continuar"). | Requisito principal de layout. | ok | [14](comparativo/14-texto-longo-lado-a-lado.png) |
| **Blocos 2–4 e relatório** | Completos. | Fora do escopo: aviso do protótipo, e o bloco é marcado como feito. A versão completa continua em `/legado/`. | — | pendente | — |

---

## 2. Comparativo de layout

| Aspecto | main | branch |
|---|---|---|
| **Tamanho da caixa de diálogo** | `width:1238px` + recuo interno de 230 + 90 px, sem `box-sizing`, ou seja **1558 px de largura real** (maior que o palco de 1440, cortada à direita). Altura **variável** (`min-height:96px`, cresce com o texto). | **1238×186 px fixos** (`box-sizing:border-box`), definidos em `css/tokens.css` (`--dlg-largura`, `--dlg-altura`). |
| **Posição da caixa** | `bottom:32px`: o topo sobe quando o texto cresce. | `left:101px; top:600px`: nunca se move. |
| **Texto longo** | Aumenta a caixa. | Paginado em 4 linhas por página, com "Continuar" e contador. |
| **Avatar** | `z-index:31`, posicionado à parte. | Faz parte do componente diálogo (camada 4), em posição fixa (30, 510). |
| **Camadas** | Tudo dentro de um único `#stage`, com `z-index` solto por componente (15, 16, 20, 21, 22, 24, 25, 30, 31, 40). | 4 camadas fixas no palco + 1 fora dele: cenário (1) → objetos (2) → HUD (3) → diálogo e escolhas (4) → menu do protótipo (5). |
| **Escala** | Só pela **largura** (`scale = largura/1440`). Em janelas baixas o palco passa da altura e a página rola. | Pela **menor** entre largura e altura (`min(w/1440, h/810)`), centralizado com tarjas. A página nunca rola. |
| **Ao redimensionar** | O palco escala, mas a caixa (maior que o palco) continua cortada; em janela baixa aparece rolagem. | Testado em 375×812, 800×600, 1440×900 e 1600×500: proporção 16:9 mantida, sem rolagem, nada se move dentro do palco. |
| **Interação durante a fala** | Dava para clicar nos elementos atrás da fala. | O resto da tela fica `inert` até "Continuar" (exceção: "Pular abertura"). |

---

## 3. Comparativo de arquitetura

**Antes (main)**

```
pele-em-acao/
├── index.html        → página com barra, palco e nota
├── css/style.css     → todos os estilos (cores soltas em :root)
├── js/game.js        → tudo: estado, regras, textos, posições e HTML (390 linhas)
└── assets/README.md  → lista de slots
```

**Depois (branch)**

```
pele-em-acao/
├── index.html                   → só a moldura: palco 16:9, 5 camadas e a ordem dos scripts
├── css/
│   ├── tokens.css               → único lugar de cores, fontes, espaçamentos e medidas da caixa
│   ├── layout.css               → o palco e as camadas (a ZStack)
│   └── components.css           → caixa de diálogo, botões, HUD, painéis e menu do protótipo
├── js/
│   ├── data/                    → textos do roteiro (falas, opções, gabarito), sem código de tela
│   │   ├── roteiro-abertura-menu.js
│   │   └── roteiro-bloco1.js
│   ├── model/                   → estado do jogo e regras (pontos, selos, Braden, dígito-pressão), sem HTML
│   │   ├── estado.js
│   │   └── regras-bloco1.js
│   ├── viewmodel/               → monta a descrição de cada cena (o que vai em cada camada)
│   │   ├── jogo.js              → navegação entre cenas, falas e pausa
│   │   ├── cenarios.js          → fundos reaproveitados (quarto, leito, sacro)
│   │   ├── cenas-abertura-menu.js
│   │   └── cenas-bloco1.js
│   ├── view/                    → desenha no HTML e escuta cliques e teclas
│   │   ├── palco.js             → escala do palco
│   │   ├── assets-view.js       → imagem final ou placeholder
│   │   ├── dialogo-view.js      → caixa de diálogo e paginação
│   │   ├── tela-view.js         → desenha as camadas a partir da descrição
│   │   └── menu-prototipo.js    → menu de teste (borda esquerda, barra inferior, tecla M)
│   └── main.js                  → liga tudo e escolhe a cena inicial
├── assets/
│   ├── manifest.js              → lista única de assets: ID, caminho, alt, tela, placeholder
│   ├── modelo-nomeacao-assets.md → regra de nomes dos arquivos
│   └── img/{cenarios,personagens,objetos,ui,ilustracoes}/ → onde as artes finais entram
├── docs/                        → lógica e fluxo, comparativo, diário, roteiro de teste, capturas
└── legado/                      → a versão anterior inteira (Blocos 1–4), rodando em /legado/
```

---

## 4. Assets do manifesto

Todos são **placeholders** por enquanto: nenhuma arte final com estes IDs existe no repositório.

| ID | Tela | Situação |
|---|---|---|
| `cen-quarto-abertura` | Abertura, Seleção de caso | placeholder |
| `cen-quarto-cima` | Leito, Investigação, Priorização, Bloco 1 (cenas 1, 1.1, 2) | placeholder |
| `cen-sacro-close` | Bloco 1 · Dígito-pressão, Pele negra | placeholder |
| `per-camila-avatar` | Todas as falas da Enfa. Camila | placeholder |
| `per-joao-avatar` | Falas do Sr. João | placeholder (ainda não aparece neste escopo) |
| `per-joao-dorsal` | Leito, Priorização, Bloco 1 | placeholder |
| `obj-regua-gases` | Leito, Bloco 1 | placeholder |
| `obj-lixo` | Leito, Bloco 1 | placeholder |
| `obj-mesa-cabeceira-e` | Leito, Bloco 1 | placeholder |
| `obj-mesa-cabeceira-d` | Leito, Bloco 1 | placeholder |
| `obj-bandeja-copo` | Leito, Bloco 1 | placeholder |
| `obj-mancha-sacro` | Bloco 1 · Dígito-pressão | placeholder |
| `obj-sacro-branqueia` | Bloco 1 · Dígito-pressão (resultado A) | placeholder |
| `obj-sacro-lp1` | Bloco 1 · Dígito-pressão (resultado B) | placeholder |
| `obj-mao-luva` | Bloco 1 · Dígito-pressão | placeholder |
| `ui-logo` | Abertura | placeholder (desenhado como texto "Pele em Ação") |
| `ui-miniatura-caso-joao` | Seleção de caso | placeholder |
| `ui-miniatura-caso-bloqueado` | Seleção de caso | placeholder |
| `ilu-pele-negra-comparativo` | Bloco 1 · Pele negra | placeholder |

Há rascunhos em `Assets/Prot. Med/` (ex.: `cenario-hospital.png`, `srjoao-leito.png`), fora do repositório. Eles não foram copiados (pergunta 16).

---

## 5. Checklist de acessibilidade

| Item | Resultado | Como foi verificado |
|---|---|---|
| Jogável só com teclado | ✅ | Fluxo completo da tela inicial ao fim do Bloco 1 com Tab/Enter/Espaço; foco automático vai para "Continuar", para a escolha certa depois de cada fala e para o botão principal dos painéis. |
| Foco visível | ✅ | Anel de 4 px `#0b57d0` em todos os controles (5,5:1 sobre o palco, 6,4:1 sobre o branco); no menu do protótipo, `#8ab4f8` sobre o fundo escuro. |
| Contraste de texto ≥ 4,5:1 | ✅ | Menor par usado: verde de acerto sobre branco, **5,26:1**. Texto secundário sobre placeholder: 5,80:1; texto sobre pílula: 11,6:1. (Na main, o texto cinza dos placeholders ficava em 3,57–3,78:1.) Botões desativados ficam a 50% de opacidade, o que é permitido para controles inativos. |
| Feedback com `aria-live` | ✅ | O texto da caixa de diálogo é `aria-live="polite"`; contador de pistas, "x/6 preenchidos" e resumo do gabarito são `role="status"`; a dígito-pressão tem um `progressbar`. |
| Cor não é o único sinal | ✅ | Tom da fala em texto ("⚠ Atenção", "⛔ Alerta crítico", "✓ Acerto"); gabarito com ✓/✗; card bloqueado com "Bloqueado"; pista vista com "(visto)" no nome acessível. |
| `prefers-reduced-motion` | ✅ | O pulso dos pontos vira um anel parado; as transições de botão e card vão para 0 ms (`--duracao`). |
| Sem limite de tempo obrigatório | ✅ (com ressalva) | Não há contagem regressiva nem prazo para decidir. A dígito-pressão pede **segurar 5 s** (é a técnica ensinada), sem prazo para começar e com quantas tentativas quiser (pergunta 14). |
| Texto alternativo de cada asset no manifesto | ✅ | Todos os 19 itens têm `alt`; assets informativos usam `role="img"` + `aria-label`, e os decorativos (avatar, miniatura, mão) usam `aria-hidden`. |
| Nomes acessíveis dos controles | ✅ | Ícones (❚❚, ↩, ‹ ›) têm `aria-label`; pontos de interação têm nome ("Bandeja", "Ponto C · sacro"). |
| Leitor de tela (teste real) | ⚠️ não testado | Verificado só pela estrutura (ARIA e ordem do DOM). Vale um teste com VoiceOver. |

---

## 6. Perguntas em aberto e decisões tomadas sozinho

A lista completa (21 itens, com escolha e motivo) está em [`docs/logica-e-fluxo.md` → Perguntas em aberto](logica-e-fluxo.md#4-perguntas-em-aberto). As que mais pedem sua decisão:

1. **Roteiro 2.0 × "Corrigido"**: 3 s ou 5 s na dígito-pressão; Guideline 2023 ou 2026; boas-vindas num bloco ou em 3 falas. Mantive o "Corrigido" (que é o que o código já usava).
2. **Avatar na camada 4** (junto da caixa), e não na camada 2, para ficar na frente da caixa.
3. **Caixa com 4 linhas** (186 px de altura), para quase nenhuma fala precisar de 2 páginas.
4. **"Selecionar paciente" dentro do card** (roteiro) × card + "Iniciar atendimento" (main, mantido).
5. **Blocos 2–4** mostram um aviso do protótipo e são marcados como feitos.
6. **Dígito-pressão** exige segurar: quer uma alternativa sem segurar?
