import { MONO, NOME, OURO, QUADRO, QUADRO_MONO } from '../abertura/marca'

/** O monograma IM, sozinho, na cor do texto em volta. */
export function Monograma({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox={QUADRO_MONO.join(' ')} fill="currentColor" aria-hidden="true" focusable="false">
    <path d={MONO} fillRule="evenodd" />
  </svg>
}

/** O logotipo inteiro. As cores vêm de variáveis CSS (--lg-terra e --lg-ouro), definidas na classe .logotipo. */
export default function Logotipo({ className = '' }: { className?: string }) {
  return <svg className={`logotipo ${className}`} viewBox={QUADRO.join(' ')} aria-hidden="true" focusable="false">
    <g fill="var(--lg-terra)" fillRule="evenodd"><path d={MONO} /><path d={NOME} /></g>
    <path d={OURO} fill="var(--lg-ouro)" fillRule="evenodd" />
  </svg>
}
