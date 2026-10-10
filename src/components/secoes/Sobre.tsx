import { useRef } from 'react'
import { m, useScroll, useSpring, useTransform } from 'motion/react'
import { SOBRE } from '../../content/textos'
import { RETRATO } from '../../config/imagens'
import { useMotionPreferences } from '../../hooks/useMotionPreferences'
import Revelar, { CORTINA, CORTINA_SOBE, Titulo } from '../ui/Revelar'

/**
 * Quem cuida: o retrato num arco, que se abre de baixo para cima, com um fio dourado
 * sendo desenhado em volta dele conforme a rolagem.
 */
export default function Sobre() {
  const { reduced } = useMotionPreferences()
  const ref = useRef<HTMLElement>(null)
  const foto = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: foto, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-5%', '5%'])
  const { scrollYProgress: secao } = useScroll({ target: ref, offset: ['start 75%', 'end 85%'] })
  const desenho = useSpring(secao, { stiffness: 70, damping: 26, restDelta: .001 })

  return <section ref={ref} id="quem-cuida" className="sobre secao" aria-labelledby="sobre-titulo">
    <div className="conteiner sobre-grade">
      <div className="sobre-retrato">
        <svg className="sobre-fio" viewBox="0 0 400 520" aria-hidden="true" focusable="false">
          <m.path d="M40 512V200a160 160 0 0 1 320 0v312" pathLength={1} style={reduced ? undefined : { pathLength: desenho }} />
          <m.circle cx="360" cy="512" r="5" style={reduced ? undefined : { opacity: useTransform(desenho, [.9, 1], [0, 1]) }} />
        </svg>
        {/* a figura (sem recorte) é quem avisa que entrou na tela; a cortina é o miolo */}
        <m.figure ref={foto} className="sobre-foto" initial={reduced ? false : 'fechada'} whileInView="aberta" viewport={{ once: true, amount: .25 }}>
          <m.div className="sobre-cortina" variants={CORTINA_SOBE} transition={{ duration: 1.6, ease: CORTINA }}>
            <picture>
              <source type="image/avif" srcSet={RETRATO.avif} sizes="(min-width: 1024px) 36vw, 78vw" />
              <m.img src={RETRATO.src} srcSet={RETRATO.webp} sizes="(min-width: 1024px) 36vw, 78vw" width={RETRATO.largura} height={RETRATO.altura}
                loading="lazy" decoding="async" alt={SOBRE.fotoAlt} style={reduced ? undefined : { y, scale: 1.12 }} />
            </picture>
          </m.div>
        </m.figure>
      </div>

      <div className="sobre-texto">
        <Titulo id="sobre-titulo" className="titulo" linhas={SOBRE.titulo} />
        <div className="sobre-paragrafos">
          {SOBRE.paragrafos.map((p, i) => <Revelar key={i} delay={i * .08}><p className="lead">{p}</p></Revelar>)}
          <Revelar delay={.12}><blockquote className="sobre-citacao">{SOBRE.citacao}</blockquote></Revelar>
        </div>
        <ul className="sobre-pontos">
          {SOBRE.pontos.map((p, i) => <Revelar as="li" key={p} delay={i * .08} y={14}>{p}</Revelar>)}
        </ul>
      </div>
    </div>
  </section>
}
