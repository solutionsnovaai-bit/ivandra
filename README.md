# Dra. Michele Pira · Estética & Saúde Integrativa

Site institucional de uma página, feito a partir da estrutura do antigo projeto `ivandra`.

## Identidade

- Monograma MP azul-marinho com flor de lótus rosa; tons de rosé, creme e champanhe.
- Hero desktop e mobile com identidade já embutida na imagem. No mobile a arte respeita sua proporção original, **sem object-fit: cover e sem zoom forçado**.
- Intro/loading animada com o logotipo e fallback para preferência de movimento reduzido.
- Não contém a antiga galeria de cabelos nem serviços de salão. As imagens e textos antigos foram retirados da experiência do site.

## Tecnologias e execução

React 19, TypeScript, Vite 6, Motion 12, Tailwind CSS 4.

```bash
npm ci
npm run check
npm run build
```

Vercel: build `npm run build`, saída `dist`. O `vite.config.ts` preenche SEO e redes sociais.

## Dados e responsabilidade

- Contatos e SEO em `src/config/site.ts`.
- Conteúdo, seções e tela de carregamento em `src/App.tsx`.
- Tema e responsivo em `src/styles/michele.css`.
- Artes finais em `public/michele/`.
- Endereço, serviços publicamente listados e experiência informada em perfil profissional estão sujeitos a confirmação pelo estabelecimento.
- As imagens de apresentação são **artes ilustrativas geradas para a identidade visual**; não foram publicadas como documentos clínicos ou fotografias de resultados.
- O site sai com `indexar: false` até a confirmação do domínio definitivo. Depois, mude para `true` e publique.