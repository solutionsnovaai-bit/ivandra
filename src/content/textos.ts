/*
  Textos do site. Para mudar uma frase, mexa só aqui.
  Listas em "titulo" viram quebras de linha.
*/
import { SITE } from '../config/site'

export const NAV = [
  { href: '#servicos', rotulo: 'Serviços' },
  { href: '#cabelos', rotulo: 'Cabelos' },
  { href: '#quem-cuida', rotulo: 'Quem cuida' },
  { href: '#como-funciona', rotulo: 'Como funciona' },
  { href: '#onde-fica', rotulo: 'Onde fica' },
] as const

export const HERO = {
  titulo: ['Beleza com', 'propósito.'],
  texto: `Mechas, loiros, cor e corte no ${SITE.endereco.bairro}, com hora marcada.`,
  cta: 'Agendar horário',
  link: 'Ver os serviços',
} as const

export const FAIXA = ['Mechas', 'Loiros', 'Coloração', 'Corte', 'Escova', 'Ondas', 'Hidratação', 'Unhas'] as const

export const MANIFESTO = {
  /** As palavras acendem uma a uma conforme a rolagem. Trechos entre *asteriscos* ficam em itálico terracota. */
  texto:
    'Mechas, loiros e cor feitos com calma, do jeito que o seu cabelo pede. O atendimento é com hora marcada, *sem pressa e sem fila.* Você chega, conta o que quer ver no espelho, e sai daqui com ele.',
} as const

export const SERVICOS = {
  titulo: ['O que a gente', 'faz por aqui.'],
  texto: 'Toque em um serviço para saber mais e já perguntar no WhatsApp.',
  perguntar: 'Perguntar sobre',
} as const

export const GALERIA = {
  titulo: ['Cabelos que', 'saíram daqui.'],
  texto: 'Mechas, loiros e ondas feitos no espaço.',
  link: 'Ver mais no Instagram',
} as const

export const SOBRE = {
  titulo: ['Quem cuida', 'de você.'],
  paragrafos: [
    `${SITE.profissional} é quem recebe e atende você no espaço, no ${SITE.endereco.bairro}. Cada cor, cada mecha e cada corte começa com uma conversa sobre o que você quer ver no espelho.`,
  ],
  /** A frase dela, em destaque. */
  citacao: SITE.lema,
  pontos: ['Mechas e loiros', 'Atendimento com hora marcada', 'Cabelo e unhas'],
  fotoAlt: `${SITE.nome}, sentada numa poltrona clara, de blazer verde e roupa branca.`,
} as const

export const PASSOS = {
  titulo: ['Do primeiro oi', 'ao seu horário.'],
  itens: [
    { titulo: 'Você chama no WhatsApp', texto: 'Conta o que quer fazer e, se puder, manda uma foto do cabelo.' },
    { titulo: 'A gente combina o horário', texto: 'Com o tempo certo para o serviço que você escolheu.' },
    { titulo: 'Você vem e aproveita', texto: 'O horário é seu, sem fila e sem correria.' },
  ],
  cta: 'Agendar pelo WhatsApp',
} as const

export const ONDE = {
  titulo: ['Fica no', `${SITE.endereco.bairro}.`],
  texto: 'Chame no WhatsApp para combinar o seu horário antes de vir.',
  atendimentoTitulo: 'Atendimento',
  mapa: 'Abrir no mapa',
  whatsapp: 'Combinar um horário',
  mapaTitulo: `Mapa: ${SITE.nome}, ${SITE.endereco.rua}`,
} as const

export const CONVITE = {
  titulo: ['Vamos marcar', 'o seu horário?'],
  texto: 'Mande uma mensagem e a gente responde com os dias e horários disponíveis.',
  cta: 'Agendar pelo WhatsApp',
} as const

export const RODAPE = {
  faixa: 'Beleza com propósito',
} as const
