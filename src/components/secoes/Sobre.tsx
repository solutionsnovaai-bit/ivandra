import { m } from 'motion/react'
import { SOBRE } from '../../content/textos'
import { RETRATO } from '../../config/imagens'
import { useMotionPreferences } from '../../hooks/useMotionPreferences'
import Revelar, { CORTINA, CORTINA_SOBE, Titulo } from '../ui/Revelar'

/**
 * Quem cuida: a apresentação dela, inteira e sem recorte, que se abre de baixo para cima.
 */
export default function Sobre() {
  const { reduced } = useMotionPreferences()

  return <section id="quem-cuida" className="sobre secao" aria-labelledby="sobre-titulo">
    <div className="conteiner sobre-grade">
      <div className="sobre-retrato">
        {/* a figura (sem recorte) é quem avisa que entrou na tela; a cortina é o miolo */}
        <m.figure className="sobre-foto" initial={reduced ? false : 'fechada'} whileInView="aberta" viewport={{ once: true, amount: .25 }}>
          <m.div className="sobre-cortina" variants={CORTINA_SOBE} transition={{ duration: 1.6, ease: CORTINA }}>
            <picture>
              <source type="image/avif" srcSet={RETRATO.avif} sizes="(min-width: 1024px) 36vw, 78vw" />
              <img src={RETRATO.src} srcSet={RETRATO.webp} sizes="(min-width: 1024px) 36vw, 78vw" width={RETRATO.largura} height={RETRATO.altura}
                loading="lazy" decoding="async" alt={SOBRE.fotoAlt} />
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
