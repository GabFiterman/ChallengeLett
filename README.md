<h1 align="center" style="font-size: 2.5rem;">Documentação Challenge Lett</h1>

<p align="center">
    <img src="https://img.shields.io/github/license/PurpleWitcher/ChallengeLett?style=for-the-badge" alt="Badge License"/>
    <img src="https://img.shields.io/badge/language%20-JavaScript-orange?style=for-the-badge" alt="Badge Language"/>
    <img src="https://img.shields.io/badge/release%20date-March%202022-brightgreen?style=for-the-badge" alt="Badge Release"/>
</p>

<img width="1333" height="711" alt="imagem-sistema" src="https://github.com/user-attachments/assets/29acce76-dfd5-44b0-a000-6ce8b7990975" />

---

## Sobre o Projeto

Este projeto iniciou-se em março de 2022 como um desafio prático para o meu primeiro estágio em desenvolvimento de software. Hoje, ele faz parte do meu portfólio pessoal e foi amplamente aprimorado para apresentar técnicas de **JavaScript Vanilla de alta performance**, **UX moderna**, **resiliência de rede (caching e rate-limit feedback)** e **interfaces dinâmicas/responsivas**.

O objetivo original era criar uma página capaz de pesquisar usuários no GitHub e retornar seus repositórios, permitindo também filtrá-los. Na nova fase, o projeto foi expandido para suportar autocomplete robusto via teclado, visualização de perfis por correspondência de nomes e otimizações contra limitações da API oficial do GitHub.

---

## Tecnologias Utilizadas

O projeto foi construído utilizando práticas modernas e organizadas de desenvolvimento web nativo:

- **Estruturação:** HTML5 Semântico
- **Estilização:** CSS3 puro baseado na metodologia **B.E.M.** (*Block Element Modifier*) e layouts baseados em Flexbox/Grid
- **Lógica e Dinâmica:** Vanilla JavaScript (ES6+) assíncrono e orientado a eventos
- **UX & Prototipagem:** Figma e Adobe Photoshop
- **Ferramentas de Desenvolvimento:** Git, GitHub e VS Code

---

## 🚀 Como Executar o Projeto Localmente

1. Clone o repositório em sua máquina local:

```bash
git clone git@github.com:GabFiterman/ChallengeLett.git
```

1. Execute o projeto localmente:
   - Abra a pasta do projeto no VS Code e inicie com a extensão **Live Server**.
   - Ou simplesmente dê dois cliques no arquivo `index.html` para executá-lo diretamente no navegador.

---

## Funcionalidades e Melhorias de Engenharia

O projeto conta com recursos premium que garantem uma experiência de uso rápida e fluida:

### Busca Geral e Autocomplete Inteligente

- **Autocomplete de Usuários:** Sugestões dinâmicas de nomes aparecem enquanto você digita no campo de busca.
- **Navegação por Teclado:** Use as setas `Cima` e `Baixo` do teclado para percorrer a lista de sugestões, e confirme com `Enter` para ir diretamente ao perfil do usuário.
- **Pesquisa de Perfis:** Pressionar `Enter` na caixa de entrada sem sugestões ativas ou clicar em **Pesquisar** traz uma página de resultados com cards detalhados contendo o avatar, nome e estatísticas rápidas dos usuários encontrados (repositórios públicos, seguidores e seguidos).

### Visualização e Filtros de Repositórios

- **Layout de 2 Colunas Compacto:** Os repositórios do usuário selecionado são organizados em um grid moderno e responsivo de duas colunas, exibindo até 20 itens por página.
- **Filtro Avançado Dinâmico:** Um campo de filtragem posicionado acima dos cards atualiza a listagem de repositórios instantaneamente à medida que o usuário digita (utilizando técnica de *debounce*), sem recarregar a página.
- **UX Premium:** Efeito visual de hover nos cards de repositórios com deslocamento vertical (`translateY`) e escala suave, e micro-animações interativas nos dados de *stars*, *watchers* e *forks*.

### Otimização de Performance e Controle de Rate Limit

- **Session Storage Cache:** Desenvolvido um wrapper de requisições que mantém em cache local as chamadas à API do GitHub por 5 minutos, poupando drasticamente a cota de requisições públicas do usuário.
- **Tratamento de Rate Limit:** Se o seu IP atingir o limite da API pública do GitHub, o sistema captura o erro e renderiza um balão de diálogo estilizado ao lado de uma imagem central de aviso de cota excedida, informando o usuário de maneira limpa.

### Balão Interativo de Dicas

- Um balão flutuante estilizado flutua logo abaixo do emoji `💡` ao lado do título.
- O balão se abre automaticamente por 6 segundos no primeiro carregamento.
- Abre ao passar o mouse na lâmpada e fecha 300ms após a saída do cursor, a menos que seja fixado clicando na própria lâmpada. Um botão `x` permite fechamento manual a qualquer momento.

---

## Planejamento de Interface (Figma)

Os protótipos originais de interface podem ser acessados diretamente:

- [Figma Prototipagem - Desktop](https://www.figma.com/proto/SwpCV4nAH2i3Pn7iO0LEpA/LettChalange?node-id=6%3A236&scaling=scale-down-width&page-id=0%3A1&starting-point-node-id=6%3A236)
- [Figma Prototipagem - Mobile](https://www.figma.com/proto/SwpCV4nAH2i3Pn7iO0LEpA/LettChalange?node-id=6%3A1994&scaling=min-zoom&page-id=6%3A687)
