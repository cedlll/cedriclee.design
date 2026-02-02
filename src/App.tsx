import { useEffect, useState } from 'react'
import { ProjectPage } from './pages/ProjectPage'
import { WritingPage } from './pages/WritingPage'
import './App.css'

const THEME_KEY = 'cclee-theme'
const VISIBLE_COUNT = 3

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

  const setTheme = (next: 'light' | 'dark') => setThemeState(next)
  const toggle = () => setThemeState((t) => (t === 'dark' ? 'light' : 'dark'))

  return { theme, setTheme, toggle }
}

const TYPING_INTERVAL_MS = 100

function TypingText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    if (displayed.length >= text.length) return
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
  { title: 'The intertextuality of Manila slums', href: '/writing/the-intertextuality-of-manila-slums' },
  { title: 'Urban mapping in Southeast Asia', href: '#' },
  { title: 'Design systems at scale', href: '#' },
  { title: 'AI-assisted prototyping tools', href: '#' },
  { title: 'Accessibility in civic tech', href: '#' },
  { title: 'Participatory design workshops', href: '#' },
]

const writings = [
  { title: 'The intertextuality of Manila slums', href: '/writing/the-intertextuality-of-manila-slums' },
  { title: 'Hello world', href: '/writing/hello-world' },
  { title: 'On design and engineering', href: '#' },
  { title: 'Building for uncertainty', href: '#' },
  { title: 'Notes on AI and creativity', href: '#' },
  { title: 'Reflections on v0', href: '#' },
]

const features = [
  { title: 'UX+ 2025', href: '#' },
  { title: 'TEDxDigitalServicesCambridgeLtd', href: '#' },
]

type SectionProps = {
  label: string
  items: { title: string; href: string }[]
  expandable?: boolean
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
        {visibleItems.map((item, i) => (
          <a key={i} href={item.href}>
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
  const isInnerPage = isProjectPage || isWritingPage

  if (isInnerPage) {
    const InnerContent = isWritingPage ? WritingPage : ProjectPage
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
            <span aria-hidden>☀</span>
          ) : (
            <span aria-hidden>☽</span>
          )}
        </button>
        <div className="page-inner">
          <InnerContent />
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
          <span aria-hidden>☀</span>
        ) : (
          <span aria-hidden>☽</span>
        )}
      </button>
      <div className="page-inner">
        <main className="profile-layout" data-name="main" data-node-id="51:2">
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
                  A product designer who&apos;s into engineering and AI.
                </p>
              </div>

              <nav className="profile-links" aria-label="Profile links">
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
                <a href="https://v0.dev" target="_blank" rel="noopener noreferrer">
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
              target="_blank"
              rel="noopener noreferrer"
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
