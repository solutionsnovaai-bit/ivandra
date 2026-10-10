/*
  Lista de serviços. Para incluir, tirar ou reescrever um serviço, mexa só aqui.
  "nome" aparece na lista; "frase" entra na mensagem do WhatsApp ("queria saber mais sobre …").
*/

export type Servico = { nome: string; frase: string; texto: string }

export const GRUPOS: readonly { id: string; titulo: string; itens: readonly Servico[] }[] = [
  {
    id: 'cabelo',
    titulo: 'Cabelo',
    itens: [
      { nome: 'Mechas e loiros', frase: 'as mechas e os loiros', texto: 'Do iluminado discreto ao loiro inteiro, com o tom escolhido junto com você.' },
      { nome: 'Coloração', frase: 'a coloração', texto: 'Cor nova, retoque de raiz ou cobertura dos brancos.' },
      { nome: 'Corte', frase: 'o corte', texto: 'Do acerto das pontas à mudança de visual, conversado antes de a tesoura entrar.' },
      { nome: 'Escova e ondas', frase: 'a escova e as ondas', texto: 'Lisa, modelada ou com ondas, para o dia a dia ou para uma ocasião especial.' },
      { nome: 'Hidratação', frase: 'a hidratação', texto: 'Cuidado para devolver maciez e brilho aos fios.' },
    ],
  },
  {
    id: 'unhas',
    titulo: 'Unhas',
    itens: [
      { nome: 'Manicure', frase: 'a manicure', texto: 'Unhas cuidadas e esmaltadas com capricho.' },
      { nome: 'Unhas decoradas', frase: 'as unhas decoradas', texto: 'Francesinha, desenhos e detalhes feitos à mão.' },
    ],
  },
]
