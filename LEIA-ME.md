# Bar du Léo — site estático (GitHub Pages)

Site de cardápio com carrinho e **finalização de pedidos pelo WhatsApp**. Sem servidor, sem banco de dados.

## Estrutura
```
index.html              página inicial (cardápio, história, como pedir, rodapé)
checkout.html           finalizar pedido (monta a mensagem e abre o WhatsApp)
politica.html           Política de Privacidade (LGPD)
404.html                página de erro do GitHub Pages
css/style.css           todo o visual
js/produtos.js          ← ARQUIVO PARA EDITAR: WhatsApp, horários, produtos, preços, descrições, fotos
js/loja.js              carrinho, horário de funcionamento, mensagem do WhatsApp
js/app.js               página inicial
js/checkout.js          página de finalização
imagens/                logo, fachada, história e fotos otimizadas (imagens/produtos/)
_originais/             suas imagens originais (e as fotos novas em fotos-novas/), intactas (pode apagar se quiser um repositório menor)
```

## Como editar
- **Preço, descrição, produto novo:** `js/produtos.js`.
- **Foto de um produto:** coloque o arquivo em `imagens/produtos/` e escreva o nome em `image` no produto. Sem foto, o card mostra a logo do bar.
- **Número do WhatsApp, pedido mínimo, horários:** início de `js/produtos.js` (os horários do rodapé em `index.html` também).
- **Bloquear pedidos com o bar fechado:** `bloquearForaDoHorario: true` em `js/produtos.js`.

## Publicar no GitHub Pages
1. Crie um repositório no GitHub e envie **o conteúdo desta pasta** (o `index.html` deve ficar na raiz do repositório).
2. No repositório: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: main / (root) → Save**.
3. Em 1–2 minutos o site abre em `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.
4. Teste um pedido pelo celular. Obs.: o nome dos arquivos de imagem diferencia maiúsculas de minúsculas no GitHub.

Para testar no computador, use o Live Server do VS Code (ou `python -m http.server`).

## Pontos para o responsável confirmar
- **Tira-gostos:** o cardápio original traz um único preço e cita "meia ou inteira". O site avisa o cliente para confirmar o tamanho no WhatsApp; confirme se o preço é de meia ou de inteira.
- **Descrições:** são textos comerciais baseados apenas nos nomes dos produtos; revise se algum detalhe não corresponde à receita.
- **Foto repetida:** Linguiça e Mandioca usam a mesma imagem. Troque quando tiver fotos próprias.
- **Cachaça Dom Bré:** a foto enviada mostra uma Cachaça 51; confirme se é a foto desejada.
- **Taxa de entrega** é combinada no WhatsApp (não há cálculo automático).
- **Política de Privacidade** é um texto-base fiel ao funcionamento do site; vale uma revisão jurídica antes do uso comercial.
