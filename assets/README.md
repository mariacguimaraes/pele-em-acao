# assets/

Esta pasta recebe as **ilustrações finais** do jogo.

- **`manifest.js`** é a lista única de todas as imagens: ID, caminho do arquivo, texto alternativo, em que tela aparece e como desenhar o placeholder.
- **`img/`** é onde os arquivos finais entram, separados por tipo (`cenarios/`, `personagens/`, `objetos/`, `ui/`, `ilustracoes/`).
- **`modelo-nomeacao-assets.md`** traz a regra de nomes.

Enquanto o arquivo final não existe, o jogo mostra um **placeholder**: um retângulo, círculo ou silhueta tracejada com o ID escrito. Quando você salva o arquivo com o caminho que está no manifesto, a troca é automática na próxima vez que a página abrir. Não é preciso mexer no código.

Os placeholders podem ser escondidos pelo **menu do protótipo** (tecla M → "Mostrar placeholders") para ver só a interface.

> A versão antiga (com os slots `data-asset`) continua em `legado/`.
