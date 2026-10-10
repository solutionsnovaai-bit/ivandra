import { useLayoutEffect, useRef } from 'react'
import { CONSULTA_MOBILE } from '../../config/imagens'
import { ALVOS, MONO, NOME, OURO, QUADRO } from './marca'

export type ModoAbertura = 'completa' | 'rapida' | 'nenhuma'

export function modoAbertura(): ModoAbertura {
  const m = document.documentElement.dataset.abertura
  return m === 'rapida' || m === 'nenhuma' ? m : 'completa'
}

type Props = {
  /** O papel começou a subir: o topo do site entra. */
  onSaida: () => void
  /** O papel saiu e o desenho se dissolveu no relevo: a abertura sai de cena. */
  onFim: () => void
}

type Matriz = [number, number, number, number, number, number]
const matriz = (m: Matriz) => `matrix(${m.map(v => Number(v.toFixed(5))).join(', ')})`
const espera = (s: number) => new Promise<void>(r => window.setTimeout(r, s * 1000))

/*
  Abertura (1ª visita ~4,5 s; ao voltar ~2 s).
  1. Num papel claro, o logotipo se monta: o monograma, depois o raminho e o coração, depois o nome,
     enquanto o contador acompanha o carregamento de verdade (fontes e a arte do topo).
  2. Com tudo carregado, o logotipo voa, ainda sobre o papel, até o lugar exato do relevo na parede.
  3. O papel sobe como uma cortina (e um véu pêssego logo atrás): a parede aparece com o relevo já embaixo do desenho.
  O palco é um SVG do tamanho da tela (1 unidade = 1 px). Só se move transform e opacity.
*/
export default function Abertura({ onSaida, onFim }: Props) {
  const raiz = useRef<HTMLDivElement>(null)
  const voo = useRef<SVGGElement>(null)
  const palco = useRef<SVGSVGElement>(null)
  const numero = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const el = raiz.current, g = voo.current, svg = palco.current
    if (!el || !g || !svg) return
    const rapida = modoAbertura() === 'rapida'
    let vivo = true, voando = false, carregado = false, raf = 0

    const medir = () => {
      const vw = window.innerWidth, vh = window.innerHeight
      svg.setAttribute('viewBox', `0 0 ${vw} ${vh}`)
      const [qx, qy, qw, qh] = QUADRO
      const s = Math.min(vw * .84, vh * .6 * (qw / qh), 680) / qw
      const inicio: Matriz = [s, 0, 0, s, (vw - qw * s) / 2 - qx * s, (vh - qh * s) / 2 - vh * .035 - qy * s]
      const arte = document.querySelector<HTMLElement>('[data-arte]')?.getBoundingClientRect()
      let destino = inicio
      if (arte && arte.width > 0) {
        const alvo = window.matchMedia(CONSULTA_MOBILE).matches ? ALVOS.mobile : ALVOS.desktop
        const k = arte.width / alvo.w, [sx, sy, tx, ty] = alvo.m
        destino = [sx * k, 0, 0, sy * k, arte.left + tx * k, arte.top + ty * k]
      }
      if (!voando) g.style.transform = matriz(inicio)
      return { inicio, destino }
    }
    medir()
    window.addEventListener('resize', medir)

    /* carregamento de verdade: as fontes e a arte do topo */
    const img = document.querySelector<HTMLImageElement>('[data-arte] img')
    const arteCarregada = !img || img.complete ? Promise.resolve() : new Promise<void>(r => { img.addEventListener('load', () => r(), { once: true }); img.addEventListener('error', () => r(), { once: true }) })
    const pronto = Promise.race([Promise.all([document.fonts.ready, arteCarregada]), espera(6)]).then(() => { carregado = true })

    const duracao = rapida ? .9 : 2.7, t0 = performance.now()
    const conta = () => {
      const p = Math.min(1, (performance.now() - t0) / 1000 / duracao)
      if (numero.current) numero.current.textContent = String(Math.round(Math.min(p, carregado ? 1 : .92) * 100)).padStart(2, '0')
      if (vivo && !voando) raf = requestAnimationFrame(conta)
    }
    raf = requestAnimationFrame(conta)
    el.classList.add('is-bloqueando', 'is-montando')

    void (async () => {
      await Promise.all([espera(duracao), pronto])
      if (!vivo) return
      if (numero.current) numero.current.textContent = '100'
      await espera(.25)
      if (!vivo) return
      /* o logotipo voa primeiro, ainda sobre o papel; só então o papel sobe: nunca aparecem dois logotipos */
      const { inicio, destino } = medir()
      voando = true
      const ms = rapida ? 750 : 1100
      g.animate([{ transform: matriz(inicio) }, { transform: matriz(destino) }], { duration: ms, easing: 'cubic-bezier(.76, 0, .24, 1)', fill: 'forwards' })
      await espera(ms * .6 / 1000)
      if (!vivo) return
      el.classList.add('is-saindo')
      el.classList.remove('is-bloqueando')
      onSaida()
      await espera(1.55)
      if (!vivo) return
      try { sessionStorage.setItem('im-abertura', '1') } catch { /* navegação privada */ }
      onFim()
    })()

    return () => { vivo = false; cancelAnimationFrame(raf); window.removeEventListener('resize', medir) }
  }, [onSaida, onFim])

  return <div ref={raiz} className="abertura" aria-hidden="true">
    <div className="ab-veu" />
    <div className="ab-papel papel" />
    <svg ref={palco} className="ab-palco" focusable="false">
      <g ref={voo} className="ab-voo">
        <path className="ab-mono ab-terra" d={MONO} fillRule="evenodd" />
        <path className="ab-ouro" d={OURO} fillRule="evenodd" />
        <path className="ab-nome ab-terra" d={NOME} fillRule="evenodd" />
      </g>
    </svg>
    <p className="ab-contador"><span ref={numero} className="ab-numero num">00</span></p>
  </div>
}
