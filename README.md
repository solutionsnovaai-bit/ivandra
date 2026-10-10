# Ivandra Maggioni · Espaço da Beleza

Site de uma página (Rua Igaroi, 115, Jardim Nordeste, São Paulo).

React 19, TypeScript, Vite 6, Tailwind 4, Motion 12 e Lenis. Fontes e imagens servidas pelo próprio site.

```bash
npm ci
npm run dev      # http://localhost:4173
npm run build    # gera a pasta dist/
```

**Vercel:** framework Vite, build `npm run build`, saída `dist`. Não precisa de variável de ambiente.

**Aparecer no Google:** o site sai com `indexar: false` em `src/config/site.ts` (prévia). Troque para `true` ao publicar de vez.

| O quê | Arquivo |
| --- | --- |
| WhatsApp, Instagram, endereço, mensagens prontas | `src/config/site.ts` |
| Textos de todas as seções | `src/content/textos.ts` |
| Lista de serviços | `src/content/servicos.ts` |
| Cores e fontes | `src/styles/tema.css` |
| Imagens (topo, cabelos, retrato, logotipo em papel) | `public/` e `src/config/imagens.ts` |

Ordem do site: abertura → topo com o logotipo na parede → fita → o jeito de atender → serviços →
cabelos (carrossel que anda sozinho) → quem cuida → como funciona → onde fica → convite → rodapé.

As posições do logotipo dentro das artes do topo ficam em `ALVOS` (`src/components/abertura/marca.ts`);
se trocar as artes, esses números e as medidas do topo em `src/styles/secoes.css` precisam ser refeitos.
