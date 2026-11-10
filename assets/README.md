# assets/

Esta pasta recebe as **ilustrações finais** do jogo.

No protótipo atual, cada ilustração é representada por uma caixa cinza tracejada (um "slot"). No código, cada slot é um elemento com a classe `.a` e o atributo `data-asset`, cujo valor é **o nome da camada correspondente no Figma**. Exemplo:

```html
<div class="a" data-asset="Leito" style="left:…;top:…;width:…;height:…">Leito</div>
```

As posições e tamanhos estão em px do frame de 1440×810 do Figma.

## Slots existentes

- Avatar Enfa. Camila
- Avatar Sr. João
- Bandeja + copo
- Bandeja vista de cima · prato em 4 quadrantes
- Close · região sacral (dígito-pressão)
- Fralda limpa aplicada
- Fundo · quarto hospitalar (abertura)
- Gameplay · Sr. João de lado, foco glúteo/sacro
- Gameplay · quarto vista de cima
- Leito
- Lixo
- Mancha avermelhada · sacro
- Mesa de cabeceira D
- Mesa de cabeceira E
- Régua de gases
- Silhueta · ajudante
- Vista lateral · leito com cabeceira articulada

## Ao exportar

- Exporte cada camada com o mesmo nome usado no `data-asset` (de preferência em minúsculas e sem acentos no nome do arquivo, ex.: `leito.webp`).
- Prefira SVG para ilustrações vetoriais e WebP/PNG para imagens raster.
- Exporte no tamanho do slot (ou 2× para telas de alta densidade).
