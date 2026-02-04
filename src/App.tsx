import { lazy, Suspense, useEffect, useState, type SVGProps } from 'react'
import './App.css'

const FeaturePage = lazy(() =>
  import('./pages/FeaturePage').then((m) => ({ default: m.FeaturePage }))
)
const ProjectPage = lazy(() =>
  import('./pages/ProjectPage').then((m) => ({ default: m.ProjectPage }))
)
const WritingPage = lazy(() =>
  import('./pages/WritingPage').then((m) => ({ default: m.WritingPage }))
)

const THEME_KEY = 'cclee-theme'
const VISIBLE_COUNT = 3

function SunIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  )
}

function MoonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function useTheme() {
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'dark'
    const stored = localStorage.getItem(THEME_KEY) as 'light' | 'dark' | null
    if (stored) return stored
    return window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  const toggle = () => setThemeState((t) => (t === 'dark' ? 'light' : 'dark'))

  return { theme, toggle }
}

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
  { title: '/designr is your UI engineer in IDE', href: 'https://cedlll.github.io/designr/' },
  { title: 'Tsek Space is your go-to facilitation tool', href: 'https://www.tsek.space/' },
  { title: 'Labor Complaint Philippines - easily file labor complaints', href: 'https://www.laborcomplaintph.app/' },
]

const writings = [
  { title: 'Field notes on building with AI', href: '/writing/field-notes-on-building-with-AI' },
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
  const { theme, toggle } = useTheme()
  const pathname =
    typeof globalThis.window !== 'undefined' ? globalThis.window.location.pathname : '/'
  const isProjectPage = pathname.startsWith('/project/')
  const isWritingPage = pathname.startsWith('/writing/')
  const isFeaturePage = pathname.startsWith('/feature/')
  const isInnerPage = isProjectPage || isWritingPage || isFeaturePage

  if (isInnerPage) {
    const InnerContent = isFeaturePage
      ? FeaturePage
      : isWritingPage
        ? WritingPage
        : ProjectPage
    return (
      <div className="page">
        <button
          type="button"
          className="theme-toggle"
          onClick={toggle}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {theme === 'dark' ? (
            <SunIcon aria-hidden />
          ) : (
            <MoonIcon aria-hidden />
          )}
        </button>
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
      <button
        type="button"
        className="theme-toggle"
        onClick={toggle}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
      >
        {theme === 'dark' ? (
          <SunIcon aria-hidden />
        ) : (
          <MoonIcon aria-hidden />
        )}
      </button>
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
                  Building things worth having.
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
                label={`${projects.length} side projects`}
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
              href="/galaga/"
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
