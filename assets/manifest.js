/*
  assets/manifest.js — a lista única de todas as imagens do jogo.
  Cada item tem:
    id          → nome único (é por ele que o código chama o asset)
    arquivo     → onde o arquivo final deve ser salvo (dentro de assets/img/)
    alt         → texto alternativo (o que um leitor de tela fala)
    tela        → em que tela(s) aparece
    placeholder → como desenhar enquanto o arquivo não existe (forma + rótulo)
  Como trocar um placeholder pela arte final: salve o arquivo com o MESMO caminho de "arquivo".
  Na próxima vez que a página abrir, a imagem aparece sozinha. Não precisa mexer no código.
  Formas de placeholder: retangulo, circulo, pessoa, pele, texto, fundo.
  Regra de nomes: ver assets/modelo-nomeacao-assets.md.
*/
window.PA = window.PA || {};

PA.assets = {
  /* ---------- Cenários (camada 1) ---------- */
  "cen-quarto-abertura": {
    arquivo: "assets/img/cenarios/cen-quarto-abertura.png",
    alt: "Quarto hospitalar claro, em tons de azul-claro e branco.",
    tela: "Abertura, Seleção de caso",
    placeholder: { forma: "fundo", rotulo: "cen-quarto-abertura · Fundo do quarto hospitalar" }
  },
  "cen-quarto-cima": {
    arquivo: "assets/img/cenarios/cen-quarto-cima.png",
    alt: "Quarto do Sr. João visto de cima, com o leito no centro.",
    tela: "Leito, Priorização, Bloco 1",
    placeholder: { forma: "fundo", rotulo: "cen-quarto-cima · Quarto visto de cima" }
  },
  "cen-sacro-close": {
    arquivo: "assets/img/cenarios/cen-sacro-close.png",
    alt: "Close da região sacral do Sr. João.",
    tela: "Bloco 1 · Dígito-pressão",
    placeholder: { forma: "fundo", rotulo: "cen-sacro-close · Close da região sacral" }
  },

  /* ---------- Personagens (camadas 2 e 4) ---------- */
  "per-camila-avatar": {
    arquivo: "assets/img/personagens/per-camila-avatar.png",
    alt: "Enfermeira Camila, guia do plantão, sorrindo.",
    tela: "Todas as falas da Enfa. Camila",
    placeholder: { forma: "pessoa", rotulo: "per-camila-avatar · Enfa. Camila" }
  },
  "per-joao-avatar": {
    arquivo: "assets/img/personagens/per-joao-avatar.png",
    alt: "Sr. João, idoso de cabelos brancos.",
    tela: "Falas do Sr. João",
    placeholder: { forma: "pessoa", rotulo: "per-joao-avatar · Sr. João" }
  },
  "per-joao-dorsal": {
    arquivo: "assets/img/personagens/per-joao-dorsal.png",
    alt: "Sr. João deitado de costas no leito, emagrecido, com fralda à mostra.",
    tela: "Leito, Priorização, Bloco 1",
    placeholder: { forma: "pessoa", rotulo: "per-joao-dorsal · Sr. João em decúbito dorsal (fralda)" }
  },

  /* ---------- Objetos (camada 2) ---------- */
  "obj-regua-gases": {
    arquivo: "assets/img/objetos/obj-regua-gases.png",
    alt: "Régua de gases na parede, acima da cabeceira.",
    tela: "Leito, Bloco 1",
    placeholder: { forma: "retangulo", rotulo: "obj-regua-gases" }
  },
  "obj-lixo": {
    arquivo: "assets/img/objetos/obj-lixo.png",
    alt: "Lixeira.",
    tela: "Leito, Bloco 1",
    placeholder: { forma: "retangulo", rotulo: "obj-lixo" }
  },
  "obj-mesa-cabeceira-e": {
    arquivo: "assets/img/objetos/obj-mesa-cabeceira-e.png",
    alt: "Mesa de cabeceira à esquerda do leito.",
    tela: "Leito, Bloco 1",
    placeholder: { forma: "retangulo", rotulo: "obj-mesa-cabeceira-e" }
  },
  "obj-mesa-cabeceira-d": {
    arquivo: "assets/img/objetos/obj-mesa-cabeceira-d.png",
    alt: "Mesa de cabeceira à direita do leito.",
    tela: "Leito, Bloco 1",
    placeholder: { forma: "retangulo", rotulo: "obj-mesa-cabeceira-d" }
  },
  "obj-bandeja-copo": {
    arquivo: "assets/img/objetos/obj-bandeja-copo.png",
    alt: "Bandeja com a refeição quase intacta e um copo de água cheio.",
    tela: "Leito, Bloco 1",
    placeholder: { forma: "retangulo", rotulo: "obj-bandeja-copo" }
  },
  "obj-mancha-sacro": {
    arquivo: "assets/img/objetos/obj-mancha-sacro.png",
    alt: "Mancha avermelhada na região sacral.",
    tela: "Bloco 1 · Dígito-pressão",
    placeholder: { forma: "pele", rotulo: "obj-mancha-sacro · Mancha avermelhada" }
  },
  "obj-sacro-branqueia": {
    arquivo: "assets/img/objetos/obj-sacro-branqueia.png",
    alt: "A mancha fica pálida ao soltar: hiperemia reativa.",
    tela: "Bloco 1 · Dígito-pressão (resultado A)",
    placeholder: { forma: "circulo", rotulo: "obj-sacro-branqueia · Pele branqueia (hiperemia reativa)" }
  },
  "obj-sacro-lp1": {
    arquivo: "assets/img/objetos/obj-sacro-lp1.png",
    alt: "A mancha continua vermelha ao soltar: lesão por pressão estágio 1.",
    tela: "Bloco 1 · Dígito-pressão (resultado B)",
    placeholder: { forma: "circulo", rotulo: "obj-sacro-lp1 · Pele NÃO branqueia (LP estágio 1)" }
  },
  "obj-mao-luva": {
    arquivo: "assets/img/objetos/obj-mao-luva.png",
    alt: "Mão com luva e dedo indicador estendido.",
    tela: "Bloco 1 · Dígito-pressão",
    placeholder: { forma: "pessoa", rotulo: "obj-mao-luva · Mão com luva (segurar)" }
  },

  /* ---------- Interface e ilustrações ---------- */
  "ui-logo": {
    arquivo: "assets/img/ui/ui-logo.png",
    alt: "Pele em Ação",
    tela: "Abertura",
    placeholder: { forma: "texto", rotulo: "Pele em Ação" }
  },
  "ui-miniatura-caso-joao": {
    arquivo: "assets/img/ui/ui-miniatura-caso-joao.png",
    alt: "Miniatura: Sr. João deitado no leito, com expressão cansada.",
    tela: "Seleção de caso",
    placeholder: { forma: "retangulo", rotulo: "ui-miniatura-caso-joao" }
  },
  "ui-miniatura-caso-bloqueado": {
    arquivo: "assets/img/ui/ui-miniatura-caso-bloqueado.png",
    alt: "Caso bloqueado.",
    tela: "Seleção de caso",
    placeholder: { forma: "retangulo", rotulo: "ui-miniatura-caso-bloqueado" }
  },
  "ilu-pele-negra-comparativo": {
    arquivo: "assets/img/ilustracoes/ilu-pele-negra-comparativo.png",
    alt: "Comparação da lesão por pressão estágio 1 na pele clara e na pele escura.",
    tela: "Bloco 1 · Pele negra",
    placeholder: { forma: "retangulo", rotulo: "ilu-pele-negra-comparativo · LP estágio 1: pele clara × pele escura" }
  }
};
