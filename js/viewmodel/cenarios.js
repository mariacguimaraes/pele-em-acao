/*
  js/viewmodel/cenarios.js — "fundos prontos" reaproveitados por várias cenas.
  Cada função devolve o que vai na camada 1 (cenário) e na camada 2 (objetos),
  com posições em px do frame 1440×810 do Figma.
*/
window.PA = window.PA || {};

PA.cenarios = {
  /* Ocupa o palco inteiro */
  cheio: id => ({ asset: id, x: 0, y: 0, w: 1440, h: 810 }),

  quartoAbertura() {
    return { cenario: [PA.cenarios.cheio("cen-quarto-abertura")], objetos: [] };
  },

  /* Quarto do Sr. João visto de cima, com os móveis e o paciente */
  leito() {
    return {
      cenario: [PA.cenarios.cheio("cen-quarto-cima")],
      objetos: [
        { asset: "obj-regua-gases", x: 575, y: 60, w: 290, h: 46 },
        { asset: "obj-lixo", x: 320, y: 300, w: 56, h: 80 },
        { asset: "obj-mesa-cabeceira-e", x: 0, y: 430, w: 300, h: 180 },
        { asset: "obj-mesa-cabeceira-d", x: 1140, y: 430, w: 300, h: 180 },
        { asset: "obj-bandeja-copo", x: 1170, y: 330, w: 230, h: 70 },
        { asset: "per-joao-dorsal", x: 560, y: 120, w: 320, h: 690 }
      ]
    };
  },

  /* Close da região sacral (dígito-pressão) */
  sacro() {
    return {
      cenario: [PA.cenarios.cheio("cen-sacro-close")],
      objetos: [{ asset: "obj-mancha-sacro", x: 620, y: 230, w: 200, h: 200 }]
    };
  }
};
