import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from 'lucide-react'
import { motion, useInView, useReducedMotion } from 'motion/react'

export type ResultCard = {
  title: string
  description: string
  image: string
  alt: string
  source: 'Fotografia do catálogo' | 'Arte editorial'
  size: number
}

const interval = 4000

export function ResultsCarousel({ cards, evaluationUrl }: {
  cards: readonly ResultCard[]
  evaluationUrl: string
}) {
  const track = useRef<HTMLUListElement>(null)
  const direction = useRef(1)
  const inView = useInView(track, { amount: .25 })
  const reduced = useReducedMotion()
  const [current, setCurrent] = useState(0)
  const [last, setLast] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [hover, setHover] = useState(false)
  const [focus, setFocus] = useState(false)
  const running = playing && !hover && !focus && !reduced && inView && last > 0

  const update = useCallback(() => {
    const list = track.current
    if (!list) return
    const children = Array.from(list.children) as HTMLElement[]
    const limit = list.scrollWidth - list.clientWidth
    const left = list.scrollLeft
    let closest = 0
    let distance = Infinity
    let end = 0
    children.forEach((child, index) => {
      const position = child.offsetLeft
      if (position <= limit + 2) end = index
      const gap = Math.abs(position - left)
      if (gap < distance) {
        closest = index
        distance = gap
      }
    })
    setLast(end)
    setCurrent(Math.min(closest, end))
  }, [])

  useEffect(() => {
    const list = track.current
    if (!list) return
    const observer = new ResizeObserver(update)
    observer.observe(list)
    update()
    return () => observer.disconnect()
  }, [update])

  const show = useCallback((index: number) => {
    const list = track.current
    const card = list?.children[index] as HTMLElement | undefined
    if (card) list?.scrollTo({ left: card.offsetLeft, behavior: reduced ? 'instant' : 'smooth' })
  }, [reduced])

  useEffect(() => {
    if (!running) return
    const advance = () => {
      if (document.hidden) return
      if (current === 0) direction.current = 1
      if (current === last) direction.current = -1
      show(current + direction.current)
    }
    const timer = window.setInterval(advance, interval)
    return () => window.clearInterval(timer)
  }, [current, last, running, show])

  function navigate(delta: number) {
    setPlaying(false)
    show(Math.max(0, Math.min(last, current + delta)))
  }

  return <section className="mp-results mp-section" id="resultados" aria-labelledby="mp-results-title">
    <div className="mp-container">
      <div className="mp-results-header">
        <div className="mp-section-heading">
          <h2 id="mp-results-title">Resultados <em>e cuidados</em></h2>
          <p>Explore o catálogo e conheça o espaço. Na avaliação, você pode conversar sobre o que deseja cuidar e esclarecer suas dúvidas.</p>
        </div>
        <div className="mp-results-controls"
          onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
          <button type="button" onClick={() => navigate(-1)} disabled={current === 0}
            aria-controls="mp-results-track" aria-label="Ver card anterior"><ArrowLeft size={20} aria-hidden="true" /></button>
          <button type="button" onClick={() => navigate(1)} disabled={current >= last}
            aria-controls="mp-results-track" aria-label="Ver próximo card"><ArrowRight size={20} aria-hidden="true" /></button>
          {!reduced && <button type="button" onClick={() => { setPlaying(!playing); setHover(false) }}
            aria-controls="mp-results-track" aria-label={playing ? 'Pausar carrossel' : 'Reproduzir carrossel'}>
            {playing ? <Pause size={17} aria-hidden="true" /> : <Play size={17} aria-hidden="true" />}
          </button>}
        </div>
      </div>
      <ul ref={track} id="mp-results-track" className="mp-results-track" tabIndex={0}
        aria-label="Galeria de procedimentos e do espaço"
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        onPointerDown={() => setPlaying(false)} onWheel={() => setPlaying(false)}
        onScroll={update}
        onKeyDown={event => {
          if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
          event.preventDefault()
          navigate(event.key === 'ArrowLeft' ? -1 : 1)
        }}>
        {cards.map((card, index) => <motion.li className="mp-result-card" key={card.image}
          initial={false} animate={{ borderColor: current === index ? '#b79261' : '#12375d21' }}
          transition={{ duration: reduced ? 0 : .3 }}>
          <figure className="mp-result-figure">
            <img src={card.image} width={card.size} height={card.size} alt={card.alt}
              loading="lazy" decoding="async" draggable={false} />
          </figure>
          <div className="mp-result-copy">
            <span>{card.source}</span>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </div>
        </motion.li>)}
      </ul>
      <div className="mp-results-progress">
        <span aria-label={`Primeiro card visível: ${current + 1} de ${cards.length}`}>
          {String(current + 1).padStart(2, '0')} / {String(cards.length).padStart(2, '0')}
        </span>
        <div className="mp-results-progress-line" aria-hidden="true">
          <motion.span key={current + ':' + running} initial={false}
            animate={{ scaleX: running ? [0, 1] : last ? current / last : 0 }}
            transition={{ duration: running ? interval / 1000 : 0, ease: 'linear' }} />
        </div>
      </div>
      <div className="mp-results-footer">
        <p>Os registros do catálogo mostram casos individuais. A indicação é definida em avaliação, e os resultados variam.</p>
        <a className="mp-button mp-button-dark" href={evaluationUrl} target="_blank" rel="noopener noreferrer">
          Agendar avaliação pelo WhatsApp <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      </div>
    </div>
  </section>
}
