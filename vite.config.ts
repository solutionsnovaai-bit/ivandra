import { defineConfig, loadEnv } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { ENDERECO_COMPLETO, SEO, SITE } from './src/config/site'

function siteOrigin(mode: string) {
  const env = loadEnv(mode, '.', 'VITE_')
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  const raw = env.VITE_SITE_URL || (vercel ? `https://${vercel}` : 'http://localhost:4173')
  const url = new URL(raw)
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('VITE_SITE_URL deve usar HTTP ou HTTPS.')
  return url.origin
}
const html = (t: string) => t.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
function dadosDoSite(origin: string): Plugin {
  const trocas: Record<string,string> = {
    __SITE_ORIGIN__:origin, __NOME__:html(SITE.nome),
    __TITULO__:html(SEO.titulo), __DESCRICAO__:html(SEO.descricao),
    __COMPARTILHAR_TITULO__:html(SEO.compartilharTitulo), __COMPARTILHAR_TEXTO__:html(SEO.compartilharTexto),
    __IMAGEM_ALT__:html(SEO.imagemAlt), __COR_TEMA__:SEO.corTema,
    __COR_FUNDO__:SEO.corFundo, __ROBOS__:SITE.indexar ? 'index, follow':'noindex, nofollow',
    __SEM_JS__:html(`${SITE.nome}, ${SITE.assinatura}. ${ENDERECO_COMPLETO}. WhatsApp ${SITE.whatsappExibicao}.`),
  }
  const manifesto=JSON.stringify({name:SITE.nome,short_name:'Michele Pira',lang:'pt-BR',icons:[
    {src:'/icon-192.png',sizes:'192x192',type:'image/png'},
    {src:'/icon-512.png',sizes:'512x512',type:'image/png'}],
    theme_color:SEO.corTema,background_color:SEO.corFundo,display:'standalone'},null,2)
  return {name:'dados-do-site',
    transformIndexHtml:h=>Object.entries(trocas).reduce((a,[k,v])=>a.replaceAll(k,v),h),
    configureServer(server){server.middlewares.use('/site.webmanifest',(_req,res)=>{res.setHeader('Content-Type','application/manifest+json');res.end(manifesto)})},
    generateBundle(){
      this.emitFile({type:'asset',fileName:'site.webmanifest',source:manifesto})
      this.emitFile({type:'asset',fileName:'robots.txt',source:SITE.indexar?`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`:'User-agent: *\nDisallow: /\n'})
      this.emitFile({type:'asset',fileName:'sitemap.xml',source:`<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}/</loc></url></urlset>`})
    }
  }
}
export default defineConfig(({mode})=>({plugins:[react(),tailwindcss(),dadosDoSite(siteOrigin(mode))],
 define:{__SITE_ORIGIN__:JSON.stringify(siteOrigin(mode))},server:{host:'0.0.0.0',port:4173,strictPort:true},
 preview:{host:'0.0.0.0',port:4173},build:{target:'es2022',sourcemap:false,cssCodeSplit:false}}))