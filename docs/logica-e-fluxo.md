# Lógica e fluxo — Pele em Ação (web)

Escopo desta versão: **Abertura**, **Menu** e **Bloco 1**. Os Blocos 2–4 e o relatório final continuam na versão completa em `legado/` (aberta em `/legado/`).

Referência de roteiro: **"Protótipo Jogo Sério corrigido2.0"** (roteiro 2.0). As falas foram reaproveitadas do código da main, que segue o roteiro **"Corrigido"** (de julho, mais recente). As diferenças entre os dois estão listadas em "Perguntas em aberto".

---

## 1. Como a arquitetura funciona (MVVM, explicado como no Figma)

| Camada MVVM | Pasta | No Figma seria… | Faz o quê |
|---|---|---|---|
| **Dados** | `js/data/`, `assets/manifest.js` | o texto e as imagens que você cola no componente | Falas, opções, gabarito e lista de assets. Só conteúdo. |
| **Model** | `js/model/` | as *variáveis* do protótipo | Guarda o estado (pontos, ordem dos blocos, respostas) e aplica as regras. Não sabe que existe tela. |
| **ViewModel** | `js/viewmodel/` | escolher a *variante* de cada componente | Para cada cena, monta uma **descrição**: o que vai em cada camada, qual botão está selecionado, qual fala aparece. |
| **View** | `js/view/` | o *componente* desenhado | Recebe a descrição e desenha no HTML. Escuta cliques e teclas e avisa o ViewModel. |

O ciclo é sempre o mesmo:

```
clique/tecla (View) → ação do ViewModel → muda o Model → ViewModel monta a nova descrição → View redesenha
```

### A tela como ZStack

O palco tem sempre **1440×810** (o frame do Figma) e é escalado inteiro para caber na janela (`js/view/palco.js`). Dentro dele, 4 camadas empilhadas em posição absoluta; a 5ª fica fora do palco, por cima de tudo:

| Camada | Elemento | O que entra |
|---|---|---|
| 1 | `#camada-cenario` | cenário de fundo |
| 2 | `#camada-objetos` | personagens, objetos, pontos de interação, mão da dígito-pressão |
| 3 | `#camada-hud` | título, pausar/voltar, informações, contador, ficha, dock de ferramentas |
| 4 | `#camada-dialogo` | escolhas (botões e cards), painéis (Sobre, Pausa, Gabarito, Pele negra) e, por cima, a **caixa de diálogo** com o avatar |
| 5 | `#proto-menu`, `#proto-barra` | menu do protótipo (ferramenta de teste) |

Enquanto há fala na caixa, as camadas 1–3 (e as escolhas) ficam `inert`: não recebem clique nem foco, e o teclado vai direto para o **Continuar**.

### Caixa de diálogo

- Tamanho e posição **fixos**, definidos em `css/tokens.css`: `x 101 · y 600 · 1238×186 px`, 4 linhas de texto.
- Texto que não cabe é **paginado** (`js/view/dialogo-view.js → paginar()`): o botão **Continuar** mostra a próxima página e, na última, passa para a próxima fala. O contador `1/2` aparece no canto.
- Tons: `ok` (verde), `erro` (âmbar) e `crit` (vermelho). A cor é um contorno interno (não muda o tamanho), e há também um rótulo em texto ("⚠ Atenção").

---

## 2. Fluxo

```
Tela inicial ─┬─ Sobre o jogo (painel) ─┐
              └─ Iniciar o jogo         │
                    ↓                   │
           Boas-vindas (3 falas) ←──────┘   [Pular abertura]
                    ↓
           Seleção de caso → (Sr. João) → Iniciar atendimento
                    ↓
           Leito do Sr. João (4 falas)
                    ↓
           Investigação clínica (3 pistas opcionais) → Encerrar investigação
                    ↓
           Priorização (4 blocos) ──┬── Bloco 1 ──→ Cena 1 → 1.1 → 2 → Pele negra ──┐
                    ↑               └── Bloco 2/3/4 → aviso "fora do escopo" ────────┤
                    └────────────────────────────────────────────────────────────────┘
                  (com os 4 feitos → aviso → volta à Tela inicial)
```

Regra-chave do Bloco 1: se ele foi escolhido em **1º lugar**, a dígito-pressão mostra **hiperemia reativa** (a mancha branqueia) e o jogador ganha **+50** de prioridade. Se foi escolhido depois de outro bloco, a mancha **não branqueia**: LP estágio 1, evento crítico.

---

## 3. Tabela de rastreabilidade (cena do roteiro → arquivo/função)

Legenda: **R** = `js/data/…` (textos) · **VM** = `js/viewmodel/…` · **M** = `js/model/…`

| Roteiro 2.0 | ID da cena | Textos (R) | Tela (VM) | Regra (M) |
|---|---|---|---|---|
| Tela 1 · Tela inicial (botões) | `inicio` | `roteiro-abertura-menu.js → PA.roteiro.inicio` | `cenas-abertura-menu.js → registrar("inicio")` | — |
| Tela 1 · Pop-up "Sobre o jogo" | `sobre` | `PA.roteiro.sobre` | `registrar("sobre")` | — |
| Tela 1 · Balão de fala da Camila | `abertura-falas` | `PA.roteiro.abertura.falas` (3 falas) | `registrar("abertura-falas")` | — |
| Tela 2 · Seleção de caso | `selecao` | `PA.roteiro.selecao` | `registrar("selecao")` | `estado.caso` |
| Tela 3 · O leito do Sr. João (falas) | `leito` | `PA.roteiro.leito.falas` | `registrar("leito")` · `cenarios.js → leito()` | — |
| Tela 3 · Interação de avanço (pistas) | `investigacao` | `PA.roteiro.investigacao` | `registrar("investigacao")` | `estado.investigacao.vistos` |
| Tela 4 · Priorização | `priorizacao` | `PA.roteiro.priorizacao`, `PA.roteiro.blocos` | `registrar("priorizacao")` · `iniciarBloco()` | `estado.js → registrarPrioridade()`, `marcarFeito()`, `todosFeitos()` |
| Bloco 1 · Cena 1 · fala de abertura | `b1-intro` | `roteiro-bloco1.js → intro` | `cenas-bloco1.js → registrar("b1-intro")` | `regras-bloco1.js → reiniciarBloco()` |
| Bloco 1 · Cena 1 · 6 pontos + Ficha Braden | `b1-braden` | `pistas`, `braden`, `ficha` | `registrar("b1-braden")` | `estado.bloco1.braden`, `fichaCompleta()` |
| Bloco 1 · Cena 1.1 · Feedback, painel de comparação, penalidades, fechamento | `b1-gabarito` | `envio`, `gabarito`, `feedbackErro`, `feedbackAcerto`, `fechamento` | `registrar("b1-gabarito")` | `enviarBraden()` (−25 por erro, selo Olhar de Águia) |
| Bloco 1 · Cena 2 · Inspeção (pontos A, B, C) | `b1-inspecao` | `inspecao` | `registrar("b1-inspecao")` | `estado.bloco1.inspecaoVistos` |
| Bloco 1 · Cena 2 · Dígito-pressão + Prevenção × Dano + feedback A/B + humanização | `b1-digito` | `digito` | `registrar("b1-digito")` · `tela-view.js → desenharDigito()` | `avaliarDigito()` (tempo, selo Mão Leve, resultado pela ordem) |
| Pele negra (vem do roteiro "Corrigido"; não está no 2.0) | `b1-pele-negra` | `peleNegra` | `registrar("b1-pele-negra")` | `marcarFeito("b1")` |
| Pausa (todas as cenas do bloco) | — | `PA.roteiro.pausa` | `jogo.js → pausar()`, `painelPausa()` | `reiniciar()` |

Infraestrutura comum:

| Peça | Arquivo / função |
|---|---|
| Ir para cena, falas, pausa | `js/viewmodel/jogo.js → ir()`, `falar()`, `avancarFala()`, `descricao()` |
| Desenhar as camadas | `js/view/tela-view.js → desenhar()` |
| Caixa de diálogo e paginação | `js/view/dialogo-view.js → desenhar()`, `paginar()` |
| Escala do palco | `js/view/palco.js → ajustar()` |
| Asset ou placeholder | `js/view/assets-view.js → criar()` + `assets/manifest.js` |
| Menu do protótipo | `js/view/menu-prototipo.js → pular()`, `prepararPara()` |
| Abrir cena pelo endereço | `js/main.js` (`?cena=…`, `?placeholders=0`, `?menu=1`) |

---

## 4. Perguntas em aberto

Modo automático: em cada dúvida escolhi a opção mais razoável, segui em frente e registrei aqui. Tudo pode ser corrigido depois.

| # | Dúvida | Escolha feita | Motivo |
|---|---|---|---|
| 1 | O roteiro 2.0 (maio) e o "Corrigido" (julho, que o código segue) divergem: dígito-pressão **3 s × 5 s**, Guideline **2023 × 2026**, nome **"Pele em Jogo"/"XXXX" × "Pele em Ação"**, boas-vindas num bloco único × 3 falas. | Mantive as falas e os valores do código (Corrigido). O tempo virou uma constante: `estado.js → CONFIG.segundosDigito = 5`. | O pedido foi reaproveitar o que funciona e não inventar falas; o "Corrigido" é o mais recente. Para usar 3 s, basta trocar um número. |
| 2 | O que é "Abertura" e o que é "Menu"? | **Abertura** = tela inicial + Sobre + boas-vindas. **Menu** = seleção de caso + leito + investigação + priorização (o roteiro chama a Tela 4 de "Menu de Priorização"). | Fecha o caminho do início até o Bloco 1 sem buracos. |
| 3 | Rótulos dos botões da tela inicial. | Do roteiro 2.0: **"Iniciar o jogo"** e **"Sobre o jogo"** (a main usava "Começar"/"Sobre"). "Sobre o jogo" foi para o **canto inferior direito**, como pede o roteiro ("canto inferior"). | O roteiro 2.0 é a referência principal, e rótulo de botão não é fala. |
| 4 | O roteiro coloca o balão de boas-vindas na própria Tela 1. | Mantive o fluxo da main: tela inicial → "Iniciar o jogo" → 3 falas (com "Pular abertura"). | O fluxo atual já funciona; mudar seria uma decisão de roteiro. |
| 5 | Blocos 2–4 e o relatório estão fora do escopo. | Escolher um deles mostra um **aviso do protótipo** (não é fala do jogo), marca o bloco como feito e volta à priorização. Com os 4 feitos, um aviso leva de volta à tela inicial. | Assim dá para testar a regra de ordem (Bloco 1 em 2º → LP estágio 1) sem fingir que os blocos existem. |
| 6 | O avatar da Camila é "personagem" (camada 2) ou "diálogo" (camada 4)? | Faz parte do **componente diálogo**, na camada 4. | Ele precisa ficar **na frente** da caixa (como na main e no Figma). Na camada 2, a caixa o cobriria. |
| 7 | Tamanho da caixa. | `1238×186 px` em `x 101 · y 600`, com 4 linhas de 22 px. | Com 3 linhas, as falas longas sobravam numa 2ª página com 2–3 palavras. Com 4, quase todas cabem numa página só. |
| 8 | A main deixava clicar atrás da fala. | Com fala aberta, o resto da tela fica **inativo** até "Continuar". Exceção: "Pular abertura". | Evita trocar de cena no meio de uma fala e deixa a navegação por teclado previsível. |
| 9 | O botão "Informações" ficava no canto inferior esquerdo, sob o avatar. | Mudei para o **canto superior direito** (`1330, 160`). | No canto inferior esquerdo ele ficava atrás do avatar e da caixa. |
| 10 | A Ficha de Braden ia até o rodapé e ficava sob a caixa. | Gaveta com **480 px de altura** (termina em y 580), com rótulo e campo lado a lado. | Nunca disputa espaço com a caixa de diálogo. |
| 11 | Os botões da priorização desciam até y 661, sob a caixa. | Subi para y 200/360, com "Escolher prioridade" em y 530. | Mesmo motivo. |
| 12 | O roteiro pede o botão **"Selecionar paciente"** dentro de cada card. | Mantive o fluxo da main: clicar no card seleciona e aparece **"Iniciar atendimento"**. | Reaproveitar o que funciona; fica anotado para decidir. |
| 13 | O botão da ficha: **"Enviar avaliação"** (main) × **"Finalizar Avaliação"** (roteiro 2.0). | Mantive "Enviar avaliação". | Igual à main; trocar é uma linha em `roteiro-bloco1.js`. |
| 14 | A dígito-pressão exige **segurar** por 5 s. Isso conflita com "sem limite de tempo obrigatório"? | Não há contagem regressiva nem tempo limite para agir. Segurar 5 s é a própria técnica ensinada. Funciona com mouse, toque, **barra de espaço** ou **Enter**. | O tempo de pressão é conteúdo pedagógico. **Pergunta para a Camila:** quer uma alternativa sem segurar (ex.: um clique que inicia a contagem)? |
| 15 | Não existe `modelo-nomeacao-assets.md`. | Criei uma proposta: `assets/modelo-nomeacao-assets.md` (prefixos `cen-`, `per-`, `obj-`, `ui-`, `ilu-`). | Necessário para a troca automática de placeholder. |
| 16 | Há imagens de protótipo em `Assets/Prot. Med/` e `Assets/prototipo-higiene/` (fora do repositório). | **Não** copiei para o repositório. | São rascunhos, não artes finais. Entram quando você exportar com os IDs do manifesto. |
| 17 | Áudio (trilha lo-fi, sons de hospital, gemido). | Não implementado (a main também não tinha). | Fora do foco (layout e arquitetura). Pendência. |
| 18 | As devolutivas de **Atividade** e **Mobilidade** não estão no roteiro (têm `*`). | Mantidas como na main, com o `*`. | Já eram propostas aprovadas para fechar lacunas. |
| 19 | "Cronômetro oculto" (Tela 3) e "Cronômetro de vulnerabilidade tecidual" (Cena 1.1) do roteiro 2.0. | Não implementados (a main também não tinha). | Dependem de regras dos Blocos 2–4. Pendência. |
| 20 | Subtítulo do título na inspeção (a main mostrava "Ombros"/"Calcanhares" conforme a contagem, de forma inconsistente). | Removido; o título fica só "Teste de dígito-pressão". | O comportamento antigo não seguia o ponto clicado. |
| 21 | Preview da Vercel protegido por login (Vercel Authentication). | Mantido como está. | Mudar a proteção é uma configuração de conta: é decisão sua. |

---

## 5. Pendências

- Roteiro 2.0 × "Corrigido": confirmar com a Camila (pergunta 1).
- Migrar os Blocos 2–4 e o relatório para a nova arquitetura (hoje estão em `legado/`).
- Artes finais: exportar com os IDs de `assets/manifest.js`.
- Áudio e cronômetros do roteiro 2.0.
