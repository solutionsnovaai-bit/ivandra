import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

const revealEase = [.22, 1, .36, 1] as const
const exitEase = [.76, 0, .24, 1] as const
const replayKey = 'mp-intro-assinatura'
const endOfDrawing = 2.43
const exitDuration = .84

// These paths are brushes for the mask. The visible artwork is always the official logo.
const strokes = [
  { d: 'M276 100 C265 51 227 17 181 18 C134 17 94 52 82 94', width: 21, delay: .08, duration: .74, clip: 'url(#mp-intro-top-arc)' },
  { d: 'M81 108 C74 146 93 188 129 208 C174 237 229 224 263 180', width: 20, delay: .38, duration: .8, clip: 'url(#mp-intro-bottom-arc)' },
  { d: 'M21 118 C8 114 19 98 42 97 C68 96 86 109 131 96 C140 88 124 118 118 138 C130 117 151 77 167 77 C179 78 159 112 153 135 C162 117 177 96 185 100 C192 104 169 145 178 141 C191 135 207 108 213 93', width: 14, delay: .58, duration: .95 },
  { d: 'M214 92 C209 101 198 132 176 185', width: 14, delay: 1.12, duration: .37 },
  { d: 'M203 114 C214 96 227 85 236 92 C246 100 233 122 219 133 C205 144 199 132 215 123 C238 112 263 112 285 119 C306 125 322 125 324 113', width: 16, delay: 1.2, duration: .53 },
  { d: 'M264 180 Q249 161 264 132 Q284 156 264 180', width: 22, delay: 1.51, duration: .31 },
  { d: 'M264 180 Q239 171 242 139 M264 180 Q239 180 227 148 M264 180 Q238 190 216 164', width: 17, delay: 1.63, duration: .31 },
  { d: 'M264 180 Q289 169 288 139 M264 180 Q291 178 302 148 M264 180 Q290 189 310 164', width: 17, delay: 1.68, duration: .31 },
] satisfies ReadonlyArray<{ d: string; width: number; delay: number; duration: number; clip?: string }>

function hasSeenIntro() {
  try { return sessionStorage.getItem(replayKey) === '1' }
  catch { return false }
}

function rememberIntro() {
  try { sessionStorage.setItem(replayKey, '1') }
  catch { /* Session storage can be unavailable in private browsing. */ }
}

type Flight = { x: number; y: number; scale: number }

export function BrandIntro({ active, onFinished, artwork, heroDesktop, heroMobile }: {
  active: boolean
  onFinished: () => void
  artwork: string
  heroDesktop: string
  heroMobile: string
}) {
  const reduced = useReducedMotion()
  const mark = useRef<SVGSVGElement>(null)
  const [tempo] = useState(() => hasSeenIntro() ? .68 : 1)
  const [flight, setFlight] = useState<Flight | null>(null)
  const opening = flight !== null

  useEffect(() => {
    if (!active) return
    if (reduced) {
      onFinished()
      return
    }

    let disposed = false
    const timers: number[] = []
    const wait = (ms: number) => new Promise<void>(resolve => {
      timers.push(window.setTimeout(resolve, ms))
    })

    function skip(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        rememberIntro()
        onFinished()
      }
    }
    window.addEventListener('keydown', skip)

    async function start() {
      const hero = new Image()
      hero.src = window.matchMedia('(max-width: 900px)').matches ? heroMobile : heroDesktop
      await Promise.all([
        wait(endOfDrawing * tempo * 1000),
        Promise.race([
          Promise.all([document.fonts.ready, hero.decode().catch(() => undefined)]),
          wait(4600),
        ]),
      ])
      if (disposed) return

      const art = mark.current?.getBoundingClientRect()
      const destination = document.querySelector('.mp-brand-flight-target')?.getBoundingClientRect()
      if (art && art.width > 0 && destination && destination.width > 0) {
        setFlight({
          x: destination.left + destination.width / 2 - (art.left + art.width / 2),
          y: destination.top + destination.height / 2 - (art.top + art.height / 2),
          scale: destination.width / (art.width * .94),
        })
      } else {
        setFlight({ x: 0, y: -18, scale: .96 })
      }
      await wait(exitDuration * 1000)
      if (disposed) return
      rememberIntro()
      onFinished()
    }

    void start()
    return () => {
      disposed = true
      window.removeEventListener('keydown', skip)
      timers.forEach(clearTimeout)
    }
  }, [active, heroDesktop, heroMobile, onFinished, reduced, tempo])

  return <AnimatePresence>
    {active && !reduced && <motion.div className="mp-intro"
      initial={false} exit={{ opacity: 0 }} transition={{ duration: .2 }}>
      <p className="sr-only" role="status">Abrindo o site da Dra. Michele Pira</p>
      <motion.div className="mp-intro-veil" aria-hidden="true"
        initial={false} animate={{ y: opening ? '-105%' : '0%' }}
        transition={{ duration: .72, delay: .12, ease: exitEase }} />
      <motion.div className="mp-intro-paper" aria-hidden="true"
        initial={false} animate={{ y: opening ? '-105%' : '0%' }}
        transition={{ duration: .7, delay: .06, ease: exitEase }}>
        <motion.div className="mp-intro-light"
          initial={{ opacity: .3, scale: .94 }} animate={{ opacity: 1, scale: 1.07 }}
          transition={{ duration: 1.65 * tempo, ease: revealEase }} />
      </motion.div>
      <div className="mp-intro-content" aria-hidden="true">
        <motion.div className="mp-intro-flight" initial={false}
          animate={flight ? { ...flight, opacity: [1, 1, 0] } : { x: 0, y: 0, scale: 1, opacity: 1 }}
          transition={{ duration: .78, ease: exitEase, opacity: { duration: .78, times: [0, .76, 1] } }}>
          <svg ref={mark} className="mp-intro-logo" viewBox="0 0 332 240" focusable="false">
            <defs>
              <clipPath id="mp-intro-top-arc"><path d="M0 0 H332 V103 H238 V96 H0 Z" /></clipPath>
              <clipPath id="mp-intro-bottom-arc"><path d="M0 106 H117 V166 L157 202 L201 210 L252 184 L269 180 V240 H0 Z" /></clipPath>
              <mask id="mp-intro-brush" maskUnits="userSpaceOnUse" x="0" y="0" width="332" height="240">
                {strokes.map(({ d, width, delay, duration, clip }) => <motion.path key={d} d={d}
                  fill="none" clipPath={clip} stroke="white" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    pathLength: { delay: delay * tempo, duration: duration * tempo, ease: 'easeInOut' },
                    opacity: { delay: delay * tempo, duration: .09 * tempo },
                  }} />)}
                <motion.rect width="332" height="240" fill="white" initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }} transition={{ delay: 1.9 * tempo, duration: .19 * tempo }} />
              </mask>
              <filter id="mp-intro-ink-alpha" filterUnits="userSpaceOnUse" x="0" y="0" width="332" height="240" colorInterpolationFilters="sRGB">
                <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  -.33 -.46 -.21 0 1" />
              </filter>
              <mask id="mp-intro-ink" maskUnits="userSpaceOnUse" x="0" y="0" width="332" height="240" style={{ maskType: 'alpha' }}>
                <image href={artwork} width="960" height="240" filter="url(#mp-intro-ink-alpha)" />
              </mask>
              <linearGradient id="mp-intro-shine" x2="1" y2=".35">
                <stop stopColor="#72baff" stopOpacity="0" />
                <stop offset=".42" stopColor="#8fc7ff" stopOpacity=".25" />
                <stop offset=".55" stopColor="#fff1da" stopOpacity=".81" />
                <stop offset="1" stopColor="#62aafb" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g mask="url(#mp-intro-brush)">
              <image href={artwork} width="960" height="240" />
              <g mask="url(#mp-intro-ink)">
                <motion.rect width="96" height="240" fill="url(#mp-intro-shine)"
                  initial={{ x: -110 }} animate={{ x: 340 }}
                  transition={{ delay: 1.76 * tempo, duration: .65 * tempo, ease: 'easeOut' }} />
              </g>
            </g>
          </svg>
        </motion.div>
        <motion.svg className="mp-intro-signature" viewBox="334 63 616 118" focusable="false"
          initial={{ opacity: 0, y: 8, clipPath: 'inset(0 48% 0 48%)' }}
          animate={opening ? { opacity: 0, y: -10 } : { opacity: 1, y: 0, clipPath: 'inset(0 0% 0 0%)' }}
          transition={{ duration: opening ? .23 : .62 * tempo, delay: opening ? 0 : 1.47 * tempo, ease: revealEase }}>
          <image href={artwork} width="960" height="240" />
        </motion.svg>
      </div>
      {!opening && <button type="button" className="mp-intro-skip" onClick={() => {
        rememberIntro()
        onFinished()
      }}>Pular abertura</button>}
    </motion.div>}
  </AnimatePresence>
}
