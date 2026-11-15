/** Dados da Dra. Michele Pira. Confirme informações profissionais e procedimentos antes de anunciar. */
export const SITE = {
  nome: 'Dra. Michele Pira',
  assinatura: 'Estética • Saúde Integrativa',
  profissional: 'Dra. Michele Pira',
  lema: 'Sua beleza, sua essência. Em cada fase.',
  whatsapp: '5511991321082',
  whatsappExibicao: '(11) 99132-1082',
  instagram: 'dramichelepira',
  endereco: {
    rua: 'Rua Azevedo Soares, 1500',
    bairro: 'Tatuapé', cidade: 'São Paulo', uf: 'SP', cep: '03322-002',
  },
  atendimento: 'Atendimento mediante agendamento',
  // Prévia: mantenha noindex até confirmar o endereço público definitivo da Vercel.
  indexar: false,
} as const

export const ENDERECO_LINHA = `${SITE.endereco.rua}, sala 03, ${SITE.endereco.bairro}`
export const ENDERECO_CURTO = `${SITE.endereco.bairro}, ${SITE.endereco.cidade}`
export const ENDERECO_COMPLETO = `${SITE.endereco.rua}, sala 03, ${SITE.endereco.bairro}, ${SITE.endereco.cidade} - ${SITE.endereco.uf}, ${SITE.endereco.cep}`
export const INSTAGRAM_URL = `https://www.instagram.com/${SITE.instagram}/`

export const SEO = {
  titulo: 'Dra. Michele Pira | Estética e Saúde Integrativa no Tatuapé',
  descricao: 'Cuidados estéticos individualizados, envelhecimento cutâneo e beleza natural no Tatuapé, São Paulo. Entre em contato para agendar sua avaliação.',
  compartilharTitulo: 'Dra. Michele Pira — Estética & Saúde Integrativa',
  compartilharTexto: 'Sua beleza merece ser vivida com naturalidade. Agende sua avaliação no Tatuapé.',
  imagemAlt: 'Identidade visual da Dra. Michele Pira com monograma MP, lótus e retrato ilustrativo.',
  corTema: '#F9F0E9', corFundo: '#FBF7F3',
} as const

export const MENSAGENS = {
  padrao: 'Olá! Vim pelo site da Dra. Michele Pira e gostaria de agendar uma avaliação.',
  servico: (nome: string) => `Olá! Vim pelo site da Dra. Michele Pira e queria saber mais sobre ${nome}.`,
  caminho: 'Olá! Gostaria de confirmar o endereço e combinar um horário para minha avaliação.',
} as const