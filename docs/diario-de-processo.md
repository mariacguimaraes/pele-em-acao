# Diário de processo — Pele em Ação (web)

## 19/11/2026 — Reestruturação: Abertura, Menu e Bloco 1

**Branch:** `feat/reestrutura-abertura-menu-bloco1` (a partir da `main`) · **Status:** aguardando aprovação, sem merge.

### Objetivo
Corrigir o layout (caixa de diálogo fixa, tela em camadas que escala inteira) e reorganizar o código numa arquitetura MVVM que dê para estudar, sem mudar o roteiro.

### Decisões

| Decisão | Alternativas consideradas | Por que esta | Impacto no jogo |
|---|---|---|---|
| **Palco 1440×810 escalado inteiro** pela menor dimensão da janela | (a) layout fluido em % ou `vw`; (b) escalar só pela largura (como na main) | Mantém as coordenadas do Figma 1:1 e impede que algo se desalinhe; (b) fazia a página rolar em janelas baixas | Funciona igual em qualquer tamanho de tela, com tarjas quando a janela não é 16:9 |
| **5 camadas fixas** (cenário, objetos, HUD, diálogo/escolhas, protótipo) | `z-index` solto por componente (main) | Fica previsível, como uma ZStack: quem está em cima é sempre quem está na camada de cima | Nenhum elemento "some" atrás de outro por acaso (ex.: a fala atrás do véu no gabarito) |
| **Caixa de diálogo fixa (1238×186) com paginação** | (a) rolagem dentro da caixa; (b) diminuir a fonte para caber | A rolagem esconde texto; fonte variável prejudica a leitura | O jogador sempre lê no mesmo lugar; falas longas viram 2 páginas |
| **4 linhas por página** | 3 linhas (160 px) | Com 3, sobravam páginas de 2–3 palavras | Menos cliques em "Continuar" |
| **Avatar dentro do componente diálogo** (camada 4) | Avatar na camada 2 (personagens) | Precisa ficar na frente da caixa, como no Figma | Visual igual ao protótipo |
| **Tela inativa durante a fala** (`inert`) | Deixar clicar atrás, como na main | Evita pular falas sem querer e organiza o foco do teclado | Ritmo de leitura garantido; "Pular abertura" continua livre |
| **MVVM em JS puro com scripts clássicos** (`window.PA`) | Módulos ES (`import`) | Módulos não rodam abrindo o `index.html` direto (file://), e não há build | Abre com dois cliques ou com qualquer servidor simples |
| **Textos em `js/data/`, separados das telas** | Textos dentro das funções (main) | A Camila ou a designer pode corrigir uma fala sem ler o código de tela | Revisão de roteiro mais segura |
| **Manifesto único de assets com troca automática** | Slots `data-asset` soltos no HTML (main) | Uma lista única com ID, caminho, alt e placeholder; a imagem entra sozinha quando o arquivo existe | O fluxo designer → jogo vira "exportar com o nome certo" |
| **Versão anterior movida para `legado/`** | Apagar ou manter na raiz | Nada se perde, e os Blocos 2–4 continuam jogáveis em `/legado/` para comparação | A main continua intacta; a branch mostra as duas versões |
| **Falas do roteiro "Corrigido"** (o código já usava) | Reescrever com o roteiro 2.0 | O pedido era não inventar falas e reaproveitar o que funciona; as divergências ficam registradas | Conteúdo igual ao da main; a decisão final fica com a Camila |

### O que foi testado
- Fluxo completo da tela inicial ao fim do Bloco 1, pelos botões reais e pelo teclado.
- Pontuação: Braden com 1 erro → B1 = 75; Bloco 1 em 1º → +50; Bloco 1 em 2º → LP estágio 1 e evento crítico.
- Caixa com 186 px em todas as falas, inclusive as paginadas.
- Redimensionamento em 375×812, 800×600, 1440×900 e 1600×500, sem rolagem.
- `prefers-reduced-motion` emulado: o pulso para e as transições vão a 0 ms.
- Contraste calculado para todos os pares de cor usados (mínimo de 5,26:1).

### Achados na main (registrados para a comparação)
- A caixa de diálogo tem 1558 px de largura real (maior que o palco) por falta de `box-sizing`, e é cortada à direita.
- No gabarito, a fala da Camila fica atrás do véu (`z-index` 30 × 40).
- A escala é só pela largura: em janelas baixas a página rola.

### Pendências
Ver `docs/logica-e-fluxo.md` → Perguntas em aberto e Pendências.
