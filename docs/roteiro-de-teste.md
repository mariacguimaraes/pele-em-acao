# Roteiro de teste: branch `feat/reestrutura-abertura-menu-bloco1`

Abra <http://localhost:8000/> (ou o preview da Vercel). Para comparar, abra a main em outra aba (<https://pele-em-acao.vercel.app/>, ou `/legado/` no mesmo endereço).

**Regra de ouro em todas as telas:** a caixa de diálogo branca **nunca muda de tamanho nem de lugar**. Se a fala for longa, aparece "1/2" no canto e o "Continuar" mostra o resto.

## 0. Menu do protótipo (faça primeiro)
1. Encoste o cursor na **borda esquerda** da janela → o painel escuro abre. Tire o cursor de cima do painel → ele fecha.
2. Clique em **"☰ Menu do protótipo (M)"** na barra inferior → abre, com o foco no primeiro item. **Esc** fecha.
3. Aperte **M** no teclado → abre. **M** de novo → fecha.
4. No painel: veja a lista de cenas por grupo, "Reiniciar o jogo", "Mostrar placeholders" e **"Estado atual (Model)"**, que deve mudar conforme você joga.
5. Desmarque **"Mostrar placeholders"** → os retângulos tracejados somem e a interface fica no mesmo lugar.

## 1. Abertura
1. **Tela inicial**: "Iniciar o jogo" já tem o anel de foco azul. "Sobre o jogo" fica no canto inferior direito.
2. Clique em **"Sobre o jogo"** → painel com 4 itens. "Fechar" → o foco volta para "Sobre o jogo".
3. **"Iniciar o jogo"** → 3 falas da Camila. Observe que a caixa **não muda** entre as falas.
4. Durante as falas, **"Pular abertura"** (canto superior direito) funciona.

## 2. Menu
1. **Seleção de caso**: a fala aparece primeiro, e os cards só ficam clicáveis depois de "Continuar". Passe o mouse no card do Sr. João (ele cresce). Os outros dois mostram cadeado e "Bloqueado".
2. Clique no card do Sr. João → aparece **"Iniciar atendimento"** (já com foco).
3. **Leito**: 4 falas; a 4ª termina com "o que faremos primeiro?".
4. **Investigação**: clique na bandeja, na fralda e na régua de gases. O contador no alto vai de 0/3 a 3/3 e o ponto clicado fica tracejado. "Encerrar investigação".
5. **Priorização**: nenhum botão fica embaixo da caixa. Escolha **"Mudar a posição…"** → "Escolher prioridade" → aparece um **aviso do protótipo** (esse bloco não foi migrado), e o botão do bloco volta desativado com ✓.

## 3. Bloco 1
> Para ver os **dois** resultados da dígito-pressão, jogue duas vezes: uma escolhendo o Bloco 1 **primeiro** e outra escolhendo-o **depois** de outro bloco (ou use a caixa "Bloco 1 escolhido como 1ª prioridade" no menu do protótipo).

1. **Introdução**: 2 falas; botão Pausar no canto superior esquerdo (teste Pausar → Continuar).
2. **Escala de Braden**: clique nos 6 pontos; cada pista aparece na mesma caixa. Abra a aba **"Ficha de avaliação"** à direita. Observe que a ficha **termina acima** da área da caixa. Preencha os 6 itens (erre 1 ou 2 de propósito) → "Enviar avaliação".
3. **Gabarito**: depois de 3 falas, o painel de comparação aparece **acima** da caixa, com ✓/✗ e "x acertos · y erros · −pts". A fala de cada erro continua legível. Na barra inferior, o IAS cai 25 por erro.
4. **Inspeção**: clique nos pontos A, B e C. Depois do C, aparece a ferramenta **"Dígito-pressão"** embaixo.
5. **Dígito-pressão**:
   - Segure **menos de 5 s** → alerta da Camila para tentar de novo.
   - Segure **5 s** (mouse, toque, **espaço** ou **Enter**) → o anel laranja enche e o contador "x s / 5 s" sobe.
   - Bloco 1 em 1º → "Excelente decisão clínica!" (verde). Bloco 1 depois → "a mancha não branqueou" (vermelho, LP estágio 1).
6. **Pele negra**: "Ver avaliação em pele negra" → painel → "Ciente / Entendido" → volta à priorização com o Bloco 1 ✓.

## 4. Redimensionar e teclado
1. Arraste a janela para ficar bem estreita, bem baixa e bem larga → o palco 16:9 encolhe ou cresce **inteiro**, com tarjas escuras, e a página nunca rola.
2. Recarregue e jogue **só com Tab, Enter e Espaço** até o fim do Bloco 1. O foco sempre deve estar visível (anel azul).
3. (Opcional) Ative "Reduzir movimento" no macOS (Ajustes → Acessibilidade → Tela) → os pontos param de pulsar.

## Atalhos
- `?cena=b1-braden` (ou qualquer ID: `inicio`, `sobre`, `abertura-falas`, `selecao`, `leito`, `investigacao`, `priorizacao`, `b1-intro`, `b1-gabarito`, `b1-inspecao`, `b1-digito`, `b1-pele-negra`) abre direto na cena.
- `?placeholders=0` desliga os placeholders · `?menu=1` abre o menu do protótipo.
