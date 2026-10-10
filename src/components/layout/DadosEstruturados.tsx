import { SEO, SITE, INSTAGRAM_URL } from '../../config/site'
import { temWhatsApp } from '../../lib/whatsapp'

/** Dados para o Google entender o negócio (salão de beleza, com endereço e contato). */
export default function DadosEstruturados() {
  const e = SITE.endereco
  const dados: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    name: `${SITE.nome} ${SITE.assinatura}`,
    description: SEO.descricao,
    url: `${__SITE_ORIGIN__}/`,
    image: `${__SITE_ORIGIN__}/og.jpg`,
    logo: `${__SITE_ORIGIN__}/icon-512.png`,
    address: {
      '@type': 'PostalAddress', streetAddress: e.rua, addressLocality: e.cidade, addressRegion: e.uf, addressCountry: 'BR', ...(e.cep ? { postalCode: e.cep } : {}),
    },
  }
  if (temWhatsApp) dados.telephone = `+${SITE.whatsapp.replace(/\D/g, '')}`
  if (INSTAGRAM_URL) dados.sameAs = [INSTAGRAM_URL]
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(dados) }} />
}
