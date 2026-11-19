# Reestrutura Abertura, Menu e Bloco 1 (layout em camadas + MVVM)

## Resumo
Reorganiza o app web numa arquitetura MVVM em HTML/CSS/JS puros (sem framework e sem build) e corrige o layout das telas de **Abertura**, **Menu** (seleção de caso, leito, investigação, priorização) e **Bloco 1**. As falas são as mesmas da versão atual.

## O que muda
- **Palco 16:9 (1440×810) que escala inteiro** pela menor dimensão da janela, sem rolagem e sem nada se mexer ao redimensionar.
- **Tela em 5 camadas** (ZStack): cenário → personagens/objetos → HUD → diálogo e escolhas → menu do protótipo.
- **Caixa de diálogo com tamanho e posição fixos** (1238×186 em x 101, y 600). Texto longo é paginado com "Continuar". Corrige a caixa que crescia e passava do palco.
- **Gabarito do Bloco 1**: a fala da Camila deixa de ficar atrás do véu.
- **Manifesto único de assets** (`assets/manifest.js`) com placeholder automático: basta salvar o arquivo com o ID certo.
- **Menu do protótipo**: borda esquerda, barra inferior ou tecla M. Pula para qualquer cena, reinicia, mostra o estado do Model e liga/desliga os placeholders.
- **Acessibilidade**: jogável só com teclado, foco visível, contraste ≥ 5,2:1, `aria-live` nas falas, `prefers-reduced-motion`.
- Textos separados em `js/data/`; regras em `js/model/`; telas em `js/viewmodel/`; desenho em `js/view/`.

## Fora do escopo
- Blocos 2–4 e relatório final: escolher um deles mostra um aviso do protótipo. A versão completa continua em `legado/` (rota `/legado/`).

## Como testar
Siga `docs/roteiro-de-teste.md`. O comparativo completo, com capturas lado a lado, está em `docs/comparativo-main-vs-branch.md`.

## Perguntas em aberto
21 decisões registradas em `docs/logica-e-fluxo.md`. As principais: roteiro 2.0 × "Corrigido" (3 s × 5 s na dígito-pressão), "Selecionar paciente" dentro do card e uma alternativa sem segurar para a dígito-pressão.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
