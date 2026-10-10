/*
  Dados do espaço. Tudo o que muda (telefone, endereço, Instagram) fica aqui.
*/

export const SITE = {
  nome: 'Ivandra Maggioni',
  assinatura: 'Espaço da Beleza',
  /** Quem atende. */
  profissional: 'Ivandra',
  /** O lema dela. */
  lema: 'Transformo beleza em propósito, vidas em histórias.',
  /** WhatsApp com 55 + DDD + número (só números). */
  whatsapp: '5511973010225',
  whatsappExibicao: '(11) 97301-0225',
  /** Perfil do Instagram (sem @). Deixe vazio para esconder o link. */
  instagram: 'ive_maggionni',
  endereco: {
    rua: 'Rua Igaroi, 115',
    bairro: 'Jardim Nordeste',
    cidade: 'São Paulo',
    uf: 'SP',
    /** Deixe vazio para não mostrar. */
    cep: '',
  },
  /** Como funciona o atendimento. */
  atendimento: 'Somente com hora marcada',
  /**
   * false: o site pede para o Google NÃO listar (bom enquanto é só uma prévia).
   * true: o site aparece nas buscas. Troque para true na hora de publicar de vez.
   */
  indexar: false,
} as const

export const ENDERECO_LINHA = `${SITE.endereco.rua}, ${SITE.endereco.bairro}`
export const ENDERECO_CURTO = `${SITE.endereco.bairro}, ${SITE.endereco.cidade}`
export const ENDERECO_COMPLETO = [`${SITE.endereco.rua}, ${SITE.endereco.bairro}, ${SITE.endereco.cidade} - ${SITE.endereco.uf}`, SITE.endereco.cep].filter(Boolean).join(', ')
export const INSTAGRAM_URL = SITE.instagram ? `https://www.instagram.com/${SITE.instagram}/` : ''

export const SEO = {
  titulo: 'Ivandra Maggioni | Espaço da Beleza no Jardim Nordeste, São Paulo',
  descricao:
    'Espaço da Beleza Ivandra Maggioni, no Jardim Nordeste: mechas, loiros, coloração, corte, escova e unhas. Atendimento com hora marcada. Agende pelo WhatsApp.',
  compartilharTitulo: 'Ivandra Maggioni · Espaço da Beleza',
  compartilharTexto: 'Mechas, loiros, cor e corte no Jardim Nordeste, com hora marcada.',
  imagemAlt: 'Logotipo de Ivandra Maggioni Espaço da Beleza: as iniciais I e M entrelaçadas, um raminho de folhas e o nome do espaço.',
  corTema: '#FCF6F0',
  corFundo: '#FCF6F0',
} as const

/** Mensagens prontas do WhatsApp, uma para cada botão do site. */
export const MENSAGENS = {
  padrao: 'Olá, Ivandra! Vim pelo seu site e queria agendar um horário.',
  servico: (nome: string) => `Olá, Ivandra! Vim pelo seu site e queria saber mais sobre ${nome}.`,
  caminho: 'Olá, Ivandra! Vim pelo seu site e queria combinar um horário para ir até aí.',
} as const
