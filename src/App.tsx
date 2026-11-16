import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  ArrowRight, ArrowUpRight, ChevronRight,
  Flower2, Heart, Instagram, MapPin, Menu, MessageCircle, Sparkles, X,
} from 'lucide-react'
import { SITE, MENSAGENS } from './config/site'

const assets = {
  heroDesktop: '/michele/hero-desktop.webp',
  heroMobile: '/michele/hero-mobile.webp',
  monogram: '/michele/monograma.webp',
  fullLogo: '/michele/logo-loader.webp',
  ritual: '/michele/ritual.webp',
  portrait: '/michele/retrato-da-arte-mobile.webp',
}

const EASE = [0.22, 1, .36, 1] as const

const nav = [
  { label: 'Início', href: '#inicio' },
  { label: 'A filosofia', href: '#filosofia' },
  { label: 'Cuidados', href: '#cuidados' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Localização', href: '#localizacao' },
] as const

function wa(message: string = MENSAGENS.padrao) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`
}

function Reveal({ children, className = '', delay = 0 }: {children: ReactNode;className?: string;delay?: number}) {
  const reduce = useReducedMotion()
  return <motion.div className={className}
    initial={reduce ? false : { opacity: 0, y: 25 }}
    whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .17 }}
    transition={{ duration: .78, delay, ease: EASE }}>
    {children}
  </motion.div>
}

type LoaderPhase = 'drawing' | 'flight' | 'curtain'

/**
 * Abertura vetorial inspirada na arquitetura anterior da Ivandra:
 * círculo desenhado por stroke, traços caligráficos MP, lótus pétala a pétala,
 * assinatura em movimento e voo do monograma para a marca da navbar.
 * O progresso considera fontes e hero carregados, com escape de segurança.
 */
function Loader({ active, onFinished }: { active: boolean; onFinished: () => void }) {
  const reduced = useReducedMotion()
  const markRef = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<LoaderPhase>('drawing')
  const [percentage, setPercentage] = useState(0)
  const [flight, setFlight] = useState({ x: 0, y: 0, scale: 1 })

  useEffect(() => {
    if (!active || reduced) return
    let alive = true
    let frame = 0
    const timers: number[] = []
    const wait = (fn: () => void, ms: number) => {
      const timer = window.setTimeout(() => { if (alive) fn() }, ms)
      timers.push(timer)
    }
    let visited = false
    try { visited = sessionStorage.getItem('mp-intro-completa') === '1' } catch { /* navegacao privada */ }
    const minimum = visited ? 1500 : 3150
    const started = performance.now()
    let assetsReady = false

    const hero = new Image()
    hero.src = window.matchMedia('(max-width: 900px)').matches ? assets.heroMobile : assets.heroDesktop
    const imageReady = hero.decode().catch(() => undefined)
    // Evita uma tela permanente se um asset falhar ou a rede estiver instável.
    const timeout = new Promise<void>(resolve => wait(() => resolve(), 6500))
    void Promise.race([Promise.all([document.fonts.ready, imageReady]), timeout])
      .then(() => { if (alive) assetsReady = true })

    const draw = (now: number) => {
      if (!alive) return
      const elapsed = now - started
      const tentative = Math.min(100, elapsed / minimum * 100)
      setPercentage(Math.floor(assetsReady ? tentative : Math.min(tentative, 94)))
      if (elapsed < minimum || !assetsReady) {
        frame = requestAnimationFrame(draw)
        return
      }
      setPercentage(100)
      wait(() => {
        const mark = markRef.current?.getBoundingClientRect()
        const header = document.querySelector('.mp-brand img')?.getBoundingClientRect()
        if (mark && header) {
          setFlight({
            x: header.left + header.width / 2 - (mark.left + mark.width / 2),
            y: header.top + header.height / 2 - (mark.top + mark.height / 2),
            scale: Math.max(.12, Math.min(.35, header.width / mark.width)),
          })
        }
        setPhase('flight')
        wait(() => {
          setPhase('curtain')
          wait(() => {
            try { sessionStorage.setItem('mp-intro-completa', '1') } catch { /* navegacao privada */ }
            onFinished()
          }, 1280)
        }, visited ? 670 : 1000)
      }, 180)
    }
    frame = requestAnimationFrame(draw)
    return () => {
      alive = false
      cancelAnimationFrame(frame)
      timers.forEach(clearTimeout)
    }
  }, [active, reduced, onFinished])

  return <AnimatePresence>
    {active && <motion.div
      className={'mp-loader mp-loader-v2 mp-stage-' + phase}
      role="status" aria-live="polite" aria-label="Preparando o espaço da Dra. Michele Pira"
      initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .25 }}>
      <motion.div className="mp-loader-veil" aria-hidden="true" />
      <motion.div className="mp-loader-paper" aria-hidden="true" />
      <div className="mp-loader-sheen" aria-hidden="true" />
      <div className="mp-loader-content">
        <motion.div ref={markRef} className="mp-loader-symbol"
          initial={false}
          animate={phase === 'drawing' ? { x: 0, y: 0, scale: 1, opacity: 1 } :
            { x: flight.x, y: flight.y, scale: flight.scale, opacity: phase === 'curtain' ? 0 : 1 }}
          transition={phase === 'drawing' ? { duration: 0 } : { duration: .95, ease: [.76, 0, .24, 1] }}>
          <svg viewBox="0 0 560 390" className="mp-loader-drawing" focusable="false" aria-hidden="true">
            <defs>
              <linearGradient id="mp-intro-ink" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#163a60"/><stop offset=".6" stopColor="#0e3255"/><stop offset="1" stopColor="#31638a"/>
              </linearGradient>
              <linearGradient id="mp-intro-flower" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#f9d8d6"/><stop offset="1" stopColor="#ca7485"/>
              </linearGradient>
            </defs>
            {/* Aro desenhado, como no loader vetorial original. */}
            <motion.path d="M 377 98 C 362 41 315 25 265 34 C 199 45 159 104 168 172 C 177 245 223 274 282 279 C 331 283 368 268 390 224"
              fill="none" stroke="url(#mp-intro-ink)" strokeWidth="6.5" strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.32, ease: [.6,0,.25,1], delay: .12 }} />
            {/* Assinatura MP em dois traços caligráficos SVG reais. */}
            <motion.path d="M 65 167 C 108 141 143 160 176 159 C 202 159 226 126 238 108 C 249 90 257 102 247 126 L 215 211 C 204 240 214 246 230 221 C 256 180 281 133 294 141 C 308 151 276 204 286 212 C 296 225 333 147 354 149 C 379 150 342 223 357 230 C 374 242 409 183 489 170"
              fill="none" stroke="url(#mp-intro-ink)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.16, ease: [.22,1,.36,1], delay: .52 }} />
            <motion.path d="M 332 240 C 344 218 358 190 369 161 C 377 144 389 147 386 161"
              fill="none" stroke="url(#mp-intro-ink)" strokeWidth="5" strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: .82, delay: 1.05, ease: EASE }} />
            {/* Lótus nascendo pétala a pétala, não um GIF ou uma imagem estática. */}
            <g transform="translate(394 224)">
              {[
                'M 0 0 Q -19 -23 0 -56 Q 19 -23 0 0 Z',
                'M 0 0 Q -45 -18 -40 -47 Q -9 -42 0 0 Z',
                'M 0 0 Q 45 -18 40 -47 Q 9 -42 0 0 Z',
                'M 0 0 Q -44 0 -59 -28 Q -26 -26 0 0 Z',
                'M 0 0 Q 44 0 59 -28 Q 26 -26 0 0 Z',
              ].map((d, i) =>
                <motion.path key={i} d={d} fill="url(#mp-intro-flower)"
                  stroke="#b97b83" strokeWidth="1.7"
                  initial={{ opacity: 0, scale: .25, y: 14 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  style={{ transformOrigin: '0px 0px' }}
                  transition={{ duration: .63, delay: .96 + i * .15, ease: [.22,1,.36,1] }} />
              )}
              <motion.path d="M -59 -9 Q 0 14 59 -9" fill="none" stroke="#b68e68" strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 1.76, duration: .55 }} />
            </g>
            <motion.text x="280" y="325" textAnchor="middle" fill="#173a60"
              className="mp-loader-name"
              initial={{ opacity: 0, y: 15, letterSpacing: '0.48em' }}
              animate={{ opacity: 1, y: 0, letterSpacing: '0.23em' }}
              transition={{ duration: .9, delay: 1.45, ease: EASE }}>MICHELE PIRA</motion.text>
            <motion.text x="280" y="352" textAnchor="middle" fill="#9e7b68"
              className="mp-loader-subtitle" initial={{ opacity: 0, y: 9 }}
              animate={{ opacity: 1, y: 0 }} transition={{ duration: .78, delay: 1.94 }}>
              ESTÉTICA · SAÚDE INTEGRATIVA
            </motion.text>
          </svg>
        </motion.div>
        <motion.p className="mp-loader-caption" initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: phase === 'drawing' ? 1 : 0, y: phase === 'drawing' ? 0 : -15 }}
          transition={{ duration: .7, delay: .6 }}>Beleza que respeita a sua essência.</motion.p>
      </div>
      <div className="mp-loader-meter" aria-hidden="true">
        <span className="mp-loader-counter">{String(percentage).padStart(2, '0')}</span>
        <span className="mp-loader-track"><span style={{ transform: 'scaleX(' + percentage / 100 + ')' }} /></span>
        <span className="mp-loader-meter-label">PREPARANDO SEU MOMENTO</span>
      </div>
    </motion.div>}
  </AnimatePresence>
}


function Header() {
  const [open, setOpen] = useState(false)
  const [scroll, setScroll] = useState(false)
  useEffect(() => {
    const onScroll = () => setScroll(window.scrollY > 24)
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])
  return <header className={`mp-header ${scroll ? 'scrolled' : ''}`}>
    <div className="mp-container mp-header-inner">
      <a href="#inicio" className="mp-brand" aria-label="Dra. Michele Pira, voltar ao início" onClick={() => setOpen(false)}>
        <img src={assets.monogram} width="570" height="369" alt="" />
        <span><strong>MICHELE PIRA</strong><small>ESTÉTICA • SAÚDE INTEGRATIVA</small></span>
      </a>
      <nav className="mp-desktop-nav" aria-label="Navegação principal">
        {nav.map(x => <a key={x.href} href={x.href}>{x.label}</a>)}
      </nav>
      <a href={wa()} target="_blank" rel="noopener noreferrer" className="mp-header-cta">Agendar avaliação <ArrowUpRight size={17} /></a>
      <button type="button" className="mp-menu-button" aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={open} aria-controls="mp-menu" onClick={() => setOpen(v => !v)}>
        {open ? <X size={25} /> : <Menu size={25} />}
      </button>
    </div>
    <AnimatePresence>
      {open && <motion.nav className="mp-mobile-nav" id="mp-menu" aria-label="Menu móvel"
        initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
        transition={{ duration: .23 }}>
        {nav.map(x => <a key={x.href} href={x.href} onClick={() => setOpen(false)}>{x.label}<ChevronRight size={16}/></a>)}
        <a className="mp-menu-cta" href={wa()} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
          Agendar avaliação <ArrowUpRight size={17}/>
        </a>
      </motion.nav>}
    </AnimatePresence>
  </header>
}

function Hero() {
  return <section className="mp-hero" id="inicio" aria-labelledby="mp-hero-title">
    <picture className="mp-hero-image">
      <source media="(max-width: 900px)" srcSet={assets.heroMobile}/>
      <img src={assets.heroDesktop} width="1550" height="872" alt="Arte ilustrativa da Dra. Michele Pira com monograma MP e flor de lótus" fetchPriority="high" />
    </picture>
    <div className="mp-hero-copy">
      <span className="mp-eyebrow"><span className="mp-eyebrow-line" /> Estética que respeita sua essência</span>
      <h1 id="mp-hero-title">Sua beleza merece <em>ser vivida</em> com naturalidade.</h1>
      <p>Cuidado individualizado para valorizar quem você é, em cada fase da vida.</p>
      <div className="mp-hero-actions">
        <a href={wa()} target="_blank" rel="noopener noreferrer" className="mp-button mp-button-dark">Agendar minha avaliação <ArrowUpRight size={18}/></a>
        <a href="#filosofia" className="mp-text-link">Conheça nossa essência <ArrowRight size={17}/></a>
      </div>
      <div className="mp-hero-trust"><Flower2 size={18}/><span>Estética • Saúde Integrativa • Tatuapé</span></div>
    </div>
  </section>
}

const values = [
  { title: 'Saúde integrativa', icon: Flower2, text: 'Um olhar que acolhe você por inteiro.' },
  { title: 'Beleza natural', icon: Sparkles, text: 'Valorizar traços, identidade e autenticidade.' },
  { title: 'Autoestima renovada', icon: Heart, text: 'Cuidado com carinho, respeito e escuta.' },
]

const services = [
  { number: '01', title: 'Avaliação individualizada', caption: 'O início de tudo', text: 'Um momento para conversar sobre suas expectativas e entender quais cuidados podem fazer sentido para sua pele.' },
  { number: '02', title: 'Envelhecimento cutâneo', caption: 'Naturalidade em cada fase', text: 'Atenção às mudanças da pele ao longo do tempo, com foco em planejamento personalizado e resultados naturais.' },
  { number: '03', title: 'Mesoterapia', caption: 'Procedimentos estéticos', text: 'Saiba mais sobre a indicação e a disponibilidade deste procedimento durante uma avaliação profissional.' },
  { number: '04', title: 'Cuidados com manchas', caption: 'Atenção ao tom da pele', text: 'Converse sobre opções de cuidados voltados ao clareamento e à uniformidade da aparência da pele.' },
]

function Philosophy() {
  return <section className="mp-philosophy mp-section" id="filosofia">
    <div className="mp-container">
      <Reveal className="mp-section-heading mp-center">
        <span className="mp-kicker"><Flower2 size={18}/> O que nos move</span>
        <h2>Mais do que estética. <em>Um encontro com você.</em></h2>
        <p>O cuidado começa na escuta. Beleza e bem-estar caminham juntos quando respeitam sua história e suas escolhas.</p>
      </Reveal>
      <div className="mp-values-grid">
        {values.map((v, i) => <Reveal className="mp-value-card" key={v.title} delay={i * .08}>
          <span className="mp-value-icon"><v.icon size={28} strokeWidth={1.25}/></span>
          <h3>{v.title}</h3><p>{v.text}</p>
        </Reveal>)}
      </div>
    </div>
  </section>
}

function Services() {
  return <section className="mp-services mp-section" id="cuidados">
    <div className="mp-container">
      <div className="mp-services-heading">
        <Reveal className="mp-section-heading">
          <span className="mp-kicker">Cuidado em cada detalhe</span>
          <h2>Seu tempo. Sua pele. <em>Seu caminho.</em></h2>
        </Reveal>
        <Reveal><p>Conheça algumas das áreas de atenção e converse diretamente com a equipe sobre a avaliação e a disponibilidade dos procedimentos.</p></Reveal>
      </div>
      <div className="mp-services-grid">
        {services.map((s, i) => <Reveal className="mp-service-card" key={s.title} delay={(i % 2) * .08}>
          <span className="mp-service-number">{s.number} <span /></span>
          <span className="mp-service-caption">{s.caption}</span>
          <h3>{s.title}</h3><p>{s.text}</p>
          <a href={wa(`Olá! Vim pelo site da Dra. Michele Pira e gostaria de saber mais sobre ${s.title.toLowerCase()}.`)}
            target="_blank" rel="noopener noreferrer" aria-label={`Conversar sobre ${s.title} pelo WhatsApp`}>
            Conversar sobre este cuidado <ArrowUpRight size={17}/>
          </a>
        </Reveal>)}
      </div>
      <p className="mp-services-note">A indicação de qualquer procedimento depende de avaliação individualizada. As informações não substituem orientação profissional.</p>
    </div>
  </section>
}

function About() {
  return <section className="mp-about mp-section" id="sobre">
    <div className="mp-container mp-about-grid">
      <Reveal className="mp-about-image">
        <img src={assets.portrait} width="485" height="800" loading="lazy" decoding="async" alt="Retrato ilustrativo da Dra. Michele Pira, com blazer branco, extraído da mesma arte do hero mobile" />
        <div className="mp-image-badge"><Flower2 size={24} strokeWidth={1.4}/><span>Você é única.<br/>Seu cuidado também.</span></div>
      </Reveal>
      <Reveal className="mp-about-copy">
        <span className="mp-kicker">Conheça quem cuida</span>
        <h2>Dra. Michele Pira. <em>Experiência com sensibilidade.</em></h2>
        <p>Especialista em envelhecimento cutâneo, a Dra. Michele Pira apresenta seu trabalho a partir de uma visão que valoriza a naturalidade, a autoestima e o cuidado individualizado.</p>
        <p>Com 21 anos de experiência declarados em seu perfil profissional e atuação como docente, ela compartilha conhecimento e dedica atenção à história de cada pessoa.</p>
        <div className="mp-about-highlight"><span className="mp-big-number">21</span><span>anos de experiência<br/><small>informados no perfil profissional</small></span></div>
        <a href={wa()} className="mp-button mp-button-outline" target="_blank" rel="noopener noreferrer">Conversar com a equipe <ArrowUpRight size={17}/></a>
      </Reveal>
    </div>
  </section>
}

function Quote() {
  return <section className="mp-quote" aria-label="Uma mensagem para você">
    <div className="mp-container">
      <Reveal>
        <span className="mp-quote-flower"><Flower2 size={32} strokeWidth={1.15}/></span>
        <p>“Após os 40 anos, você não precisa recomeçar. Precisa apenas <em>escolher você.</em>”</p>
        <small>UMA MENSAGEM DA DRA. MICHELE PIRA</small>
      </Reveal>
    </div>
  </section>
}

function HowItWorks() {
  const steps = [
    { n:'01', h:'Conte o que você procura', p:'Entre em contato pelo WhatsApp e compartilhe suas dúvidas ou expectativas.' },
    { n:'02', h:'Agende sua avaliação', p:'Converse com a equipe sobre o melhor momento para seu atendimento.' },
    { n:'03', h:'Cuide de você', p:'Receba uma orientação individualizada sobre as possibilidades adequadas para você.' },
  ]
  return <section className="mp-process mp-section" id="atendimento">
    <div className="mp-container">
      <Reveal className="mp-section-heading mp-center"><span className="mp-kicker">Simples e acolhedor</span><h2>O primeiro passo é <em>se escolher.</em></h2></Reveal>
      <div className="mp-process-steps">
        {steps.map((s,i)=><Reveal className="mp-step" key={s.n} delay={i*.1}>
          <span>{s.n}</span><h3>{s.h}</h3><p>{s.p}</p>
        </Reveal>)}
      </div>
      <Reveal className="mp-process-action"><a href={wa()} target="_blank" rel="noopener noreferrer" className="mp-button mp-button-dark">Agendar pelo WhatsApp <ArrowUpRight size={17}/></a></Reveal>
    </div>
  </section>
}

function Location() {
  const address = `${SITE.endereco.rua}, sala 03, ${SITE.endereco.bairro}, ${SITE.endereco.cidade} - SP`
  const map = `https://www.google.com/maps?q=${encodeURIComponent(address)}&z=16&hl=pt-BR&output=embed`
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
  return <section className="mp-location mp-section" id="localizacao">
    <div className="mp-container mp-location-grid">
      <Reveal className="mp-location-text">
        <span className="mp-kicker"><MapPin size={17}/> Onde estamos</span>
        <h2>Seu momento de cuidado <em>no Tatuapé.</em></h2>
        <p>Um espaço para acolher você e suas escolhas. Fale com a equipe antes de visitar para confirmar disponibilidade e horário.</p>
        <address>Rua Azevedo Soares, 1500 • Sala 03<br/>Tatuapé, São Paulo – SP</address>
        <div className="mp-location-actions">
          <a href={mapLink} target="_blank" rel="noopener noreferrer" className="mp-button mp-button-dark"><MapPin size={17}/> Como chegar</a>
          <a href={wa()} target="_blank" rel="noopener noreferrer" className="mp-text-link">Agendar horário <ArrowUpRight size={17}/></a>
        </div>
      </Reveal>
      <Reveal className="mp-map-wrapper">
        <iframe src={map} title="Mapa da clínica Dra. Michele Pira no Tatuapé" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      </Reveal>
    </div>
  </section>
}

function FinalCta() {
  return <section className="mp-final-cta" id="agendar">
    <div className="mp-container">
      <Reveal>
        <Flower2 className="mp-final-icon" size={38} strokeWidth={1.15}/>
        <span>O cuidado começa com uma escolha</span>
        <h2>Que tal dedicar um <em>momento a você?</em></h2>
        <p>A equipe da Dra. Michele Pira está pronta para receber sua mensagem.</p>
        <a href={wa()} target="_blank" rel="noopener noreferrer" className="mp-button mp-button-light">Agendar minha avaliação <ArrowUpRight size={18}/></a>
      </Reveal>
    </div>
  </section>
}

function Footer() {
  const address = `${SITE.endereco.rua}, sala 03 · Tatuapé · São Paulo/SP`
  return <footer className="mp-footer">
    <div className="mp-container mp-footer-grid">
      <div className="mp-footer-brand">
        <img src={assets.monogram} alt="Monograma MP com lótus" width="570" height="369" loading="lazy" />
        <strong>DRA. MICHELE PIRA</strong><small>ESTÉTICA • SAÚDE INTEGRATIVA</small>
        <p>Naturalidade, cuidado e respeito à sua essência.</p>
      </div>
      <div className="mp-footer-col"><h3>Explore</h3>{nav.map(x=><a key={x.href} href={x.href}>{x.label}</a>)}</div>
      <div className="mp-footer-col"><h3>Contato</h3><address>{address}</address>
        <a href={wa()} target="_blank" rel="noopener noreferrer"><MessageCircle size={16}/> {SITE.whatsappExibicao}</a>
        <a href={`https://www.instagram.com/${SITE.instagram}/`} target="_blank" rel="noopener noreferrer"><Instagram size={16}/> @{SITE.instagram}</a>
      </div>
    </div>
    <div className="mp-container mp-footer-bottom"><span>© {new Date().getFullYear()} Dra. Michele Pira. Todos os direitos reservados.</span><span>Desenvolvido por Nova AI Solutions</span></div>
  </footer>
}

export default function App() {
  const [loading, setLoading] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const finishLoading = useCallback(() => setLoading(false), [])
  useEffect(() => {
    if (!loading) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [loading])
  return <>
    <Loader active={loading} onFinished={finishLoading}/>
    <Header/>
    <main>
      <Hero/><Philosophy/><Services/><About/><Quote/><HowItWorks/><Location/><FinalCta/>
    </main>
    <Footer/>
    <a href={wa()} target="_blank" rel="noopener noreferrer" className="mp-fab" aria-label="Agendar avaliação pelo WhatsApp"><MessageCircle size={24}/><span className="mp-fab-pulse"/></a>
  </>
}