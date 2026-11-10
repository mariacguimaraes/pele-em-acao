# Pele em Ação

Jogo sério interativo para o ensino de prevenção de lesão por pressão na enfermagem.

## O que é

**Pele em Ação** é um jogo sério voltado a estudantes de enfermagem. O jogador acompanha a Enfa. Camila no cuidado ao Sr. João, um paciente acamado, e precisa decidir a ordem e a execução dos cuidados de prevenção de lesão por pressão, organizados em quatro blocos:

1. Conhecer o paciente e avaliar a pele
2. Mudar a posição e ajustar os apoios
3. Limpar e proteger a pele
4. Cuidar da alimentação e da hidratação

As escolhas geram pontuação (IAS), feedbacks e selos ao final da partida.

Este repositório contém o **protótipo navegável**: as ilustrações ainda são caixas cinza (slots) que serão trocadas pelas artes finais — veja [`assets/README.md`](assets/README.md).

## Origem acadêmica

O jogo foi desenvolvido no contexto da dissertação de Mestrado de **Camila Lemos Guimarães**, na Escola de Enfermagem Anna Nery da Universidade Federal do Rio de Janeiro (**EEAN/UFRJ**).

## Como rodar localmente

O projeto é HTML, CSS e JavaScript puros, sem etapa de build.

**Opção 1 — abrir direto:** dê dois cliques em `index.html` para abrir no navegador.

**Opção 2 — servidor simples** (recomendado, evita restrições do navegador com arquivos locais). Na pasta do projeto, rode um dos comandos:

```bash
python3 -m http.server 8000
```

```bash
npx serve .
```

Depois abra <http://localhost:8000> (ou o endereço que o `serve` mostrar).

## Estrutura de pastas

```
pele-em-acao/
├── index.html      # estrutura da página
├── css/
│   └── style.css   # estilos (palco 1440×810 escalado)
├── js/
│   └── game.js     # lógica, telas e textos do jogo
├── assets/         # ilustrações finais (ver assets/README.md)
└── README.md
```

## Fluxo de trabalho com branches

- **`main`** — versão estável. É ela que a cliente acessa (deploy de produção na Vercel). Não se faz commit direto na `main`.
- **`dev`** — branch de integração, criada a partir da `main`.
- **Cada melhoria em uma branch própria**, criada a partir da `main` (ou da `dev`):
  - `feat/<descricao>` para novidades (ex.: `feat/ilustracoes-bloco-1`)
  - `fix/<descricao>` para correções (ex.: `fix/texto-feedback-b3`)
- Ao terminar, a branch é enviada ao GitHub e aberta como **Pull Request para a `main`**.
- Toda branch enviada gera automaticamente um **link de preview** na Vercel, que pode ser mandado para a cliente revisar antes do merge.
- Aprovado o preview, o PR é mesclado na `main` e a Vercel atualiza a produção.

Exemplo:

```bash
git checkout main
git pull
git checkout -b feat/minha-melhoria
# ... alterações ...
git add .
git commit -m "Descreve a melhoria"
git push -u origin feat/minha-melhoria
```

Depois, abra o Pull Request no GitHub.
