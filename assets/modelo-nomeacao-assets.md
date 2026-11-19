# Modelo de nomeação de assets

> Criado nesta branch porque o arquivo ainda não existia. É uma **proposta** (ver "Perguntas em aberto" em `docs/logica-e-fluxo.md`).

## Regra

```
<tipo>-<assunto>[-<variação>].<extensão>
```

- tudo em **minúsculas**, sem acento, palavras separadas por **hífen**;
- o nome do arquivo (sem a extensão) é o **ID** usado em `assets/manifest.js`;
- a camada do Figma deve ter o mesmo nome do ID, para a exportação já sair certa.

| Prefixo | Tipo | Pasta | Exemplo |
|---|---|---|---|
| `cen-` | cenário (camada 1, ocupa o palco todo) | `assets/img/cenarios/` | `cen-quarto-cima.png` |
| `per-` | personagem | `assets/img/personagens/` | `per-camila-avatar.png` |
| `obj-` | objeto do cenário | `assets/img/objetos/` | `obj-bandeja-copo.png` |
| `ui-` | peça de interface (logo, miniatura) | `assets/img/ui/` | `ui-logo.png` |
| `ilu-` | ilustração de painel informativo | `assets/img/ilustracoes/` | `ilu-pele-negra-comparativo.png` |

## Exportação

- Formato padrão: **PNG** (é o que o manifesto espera hoje). Para usar SVG ou WebP, mude a extensão do item no `manifest.js`.
- Tamanho: o do retângulo no frame 1440×810 do Figma, ou 2× para telas de alta densidade.
- Cenários: 1440×810 (ou 2880×1620).

## Como entra no jogo

1. Exporte com o nome certo e salve na pasta do tipo.
2. Recarregue a página. O placeholder some e a imagem aparece no lugar, no mesmo tamanho e na mesma posição.
3. Se o asset for novo (não está no manifesto), adicione um item em `assets/manifest.js` com `arquivo`, `alt`, `tela` e `placeholder`.
