import { lazy, Suspense, useEffect, useState } from 'react'
import './App.css'

const FeaturePage = lazy(() =>
  import('./pages/FeaturePage').then((m) => ({ default: m.FeaturePage }))
)
const WritingPage = lazy(() =>
  import('./pages/WritingPage').then((m) => ({ default: m.WritingPage }))
)
const CustomCursor = lazy(() => import('./components/CustomCursor'))

const VISIBLE_COUNT = 3

const TYPING_INTERVAL_MS = 100
const TYPING_PAUSE_BEFORE_LOOP_MS = 10000

function TypingText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    if (displayed.length >= text.length) {
      const t = setTimeout(() => setDisplayed(''), TYPING_PAUSE_BEFORE_LOOP_MS)
      return () => clearTimeout(t)
    }
    const t = setTimeout(
      () => setDisplayed(text.slice(0, displayed.length + 1)),
      TYPING_INTERVAL_MS
    )
    return () => clearTimeout(t)
  }, [text, displayed])

  return (
    <>
      {displayed}
      <span className="typing-cursor" aria-hidden />
    </>
  )
}

const projects = [
  { title: 'scratchly - scratchpad in your browser', href: 'https://scratchly.xyz/' },
  { title: '/designr — UI engineer in your IDE', href: 'https://cedlll.github.io/designr/' },
  { title: 'Tsek Space is your go-to facilitation tool', href: 'https://tsek-space-jxfpbny1s-cedricl-projects.vercel.app/' },
  { title: 'Hassle-free labor complaint filing', href: 'https://www.laborcomplaintph.app/' },
]

const writings = [
  { title: 'Tracing the roots of graffiti in the Philippines', href: '/writing/tracing-the-roots-of-graffiti-in-the-philippines' },
  { title: "The intertextuality of Manila slum's Pietà", href: '/writing/the-intertextuality-of-manila-slums-pieta' },
]

const features = [
  { title: 'UX+ 2025', href: '/feature/ux-plus-2025' },
  { title: 'TEDxDigitalServicesCambridgeLtd', href: '/feature/tedx-digital-services-cambridge-ltd' },
]

type SectionProps = {
  label: string
  items: { title: string; href: string }[]
  expandable?: boolean
}

function isExternalHref(href: string): boolean {
  return href.startsWith('http://') || href.startsWith('https://')
}

function Section({ label, items, expandable = true }: SectionProps) {
  const [expanded, setExpanded] = useState(false)
  const hasMore = expandable && items.length > VISIBLE_COUNT
  const visibleItems =
    !expandable || expanded ? items : items.slice(0, VISIBLE_COUNT)

  return (
    <div className="section">
      <h2 className="section-label">{label}</h2>
      <div className="section-list">
        {visibleItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            {...(isExternalHref(item.href) && {
              target: '_blank',
              rel: 'noopener noreferrer',
            })}
          >
            {item.title}
          </a>
        ))}
        {hasMore && (
          <button
            type="button"
            className="section-more"
            onClick={() => setExpanded((e) => !e)}
            aria-expanded={expanded}
          >
            {expanded ? 'Less ↑' : 'More ↓'}
          </button>
        )}
      </div>
    </div>
  )
}

function App() {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const pathname =
    typeof globalThis.window !== 'undefined' ? globalThis.window.location.pathname : '/'
  const isWritingPage = pathname.startsWith('/writing/')
  const isFeaturePage = pathname.startsWith('/feature/')
  const isInnerPage = isWritingPage || isFeaturePage

  useEffect(() => {
    if (typeof globalThis.window === 'undefined') return
    if (!isInnerPage) {
      setShowScrollTop(false)
      return
    }

    const handleScroll = () => {
      if (!isInnerPage) {
        setShowScrollTop(false)
        return
      }

      const scrollBottom =
        globalThis.window.scrollY + globalThis.window.innerHeight
      const pageHeight = document.documentElement.scrollHeight
      const isNearBottom = pageHeight - scrollBottom <= 160
      const hasScrolled = globalThis.window.scrollY > 200
      setShowScrollTop(isNearBottom && hasScrolled)
    }

    handleScroll()
    globalThis.window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      globalThis.window.removeEventListener('scroll', handleScroll)
    }
  }, [isInnerPage, pathname])

  const handleScrollTop = () => {
    globalThis.window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cursor = (
    <Suspense fallback={null}>
      <CustomCursor
        dotSize={6}
        dotColor="#ffffff"
        animationDuration={200}
        blendMode="difference"
        opacity={1}
        hideOnMobile
      />
    </Suspense>
  )

  if (isInnerPage) {
    const InnerContent = isFeaturePage ? FeaturePage : WritingPage
    return (
      <div className="page">
        {cursor}
        {showScrollTop && (
          <button
            type="button"
            className="scroll-top-button"
            onClick={handleScrollTop}
            aria-label="Scroll to top"
            title="Scroll to top"
          >
            ↑
          </button>
        )}
        <div className="page-inner">
          <Suspense fallback={null}>
            <InnerContent />
          </Suspense>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      {cursor}
      {showScrollTop && (
        <button
          type="button"
          className="scroll-top-button"
          onClick={handleScrollTop}
          aria-label="Scroll to top"
          title="Scroll to top"
        >
          ↑
        </button>
      )}
      <div className="page-inner">
        <main className="profile-layout">
          <section className="profile-panel">
            <header className="profile-header">
              <div className="profile-header-text">
                <div className="profile-name-with-preview">
                  <h1 className="profile-title profile-title-with-preview">
                    <span className="profile-title-inner">
                      <TypingText text="Clarence Cedric Lee" />
                    </span>
                  </h1>
                  <span className="profile-photo-preview" aria-hidden>
                    <img
                      src="/cedric-photo-400.png"
                      alt=""
                      width={200}
                      height={200}
                      fetchPriority="high"
                      decoding="async"
                    />
                  </span>
                </div>
                <p className="profile-subtitle">
                  Building things worth having
                </p>
              </div>

              <nav className="profile-links" aria-label="Profile links">
                <a href="https://www.linkedin.com/in/cedmanila/" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
                <a href="https://github.com/cedlll" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
                <a href="https://v0.app/@cedricl" target="_blank" rel="noopener noreferrer">
                  v0
                </a>
              </nav>
            </header>

            <section className="sections" aria-label="Work overview">
              <Section
                label={`${projects.length} fun projects`}
                items={projects}
                expandable={false}
              />
              <Section
                label={`${writings.length} writings`}
                items={writings}
              />
              <Section
                label={`${features.length} features`}
                items={features}
              />
            </section>

            <a
              href="/galaga/index.html"
              className="galaga-button"
              aria-label="Play Galaga"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M12 0 L20 8 L16 12 L20 16 L12 24 L4 16 L8 12 L4 8 Z"
                  fill="currentColor"
                />
              </svg>
            </a>
          </section>
        </main>
      </div>
    </div>
  )
}

export default App
