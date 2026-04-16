import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import './App.css'
import { useHomeGsap } from './hooks/useHomeGsap'
import { LEGACY_DISBURSEMENTS_WRITING_SLUG } from './lib/legacyDisbursementsWritingSlug'
const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((m) => ({ default: m.AboutPage }))
)
const FeaturePage = lazy(() =>
  import('./pages/FeaturePage').then((m) => ({ default: m.FeaturePage }))
)
const WritingPage = lazy(() =>
  import('./pages/WritingPage').then((m) => ({ default: m.WritingPage }))
)
const WritingIndexPage = lazy(() =>
  import('./pages/WritingPage').then((m) => ({ default: m.WritingIndexPage }))
)

function isExternalHref(href: string): boolean {
  return href.startsWith('http://') || href.startsWith('https://')
}

/** Writing slugs that use the editorial article layout. Keep in sync with `WritingPage`. */
const WRITING_EDITORIAL_SLUGS = new Set([
  'enterprise-disbursements-money-movement',
  LEGACY_DISBURSEMENTS_WRITING_SLUG,
  'tracing-the-roots-of-graffiti-in-the-philippines',
  'the-intertextuality-of-manila-slums-pieta',
])

/** Feature slugs that use the editorial article layout. Keep in sync with `FeaturePage` `FEATURES` keys. */
const FEATURE_EDITORIAL_SLUGS = new Set(['ux-plus-2025', 'tedx-digital-services-cambridge-ltd'])

/** Aligns sticky nav with article column before lazy content mounts (avoids `:has()` flash). */
function innerMainArticleLayout(pathname: string): 'inner-page' | 'editorial' {
  if (pathname === '/about') {
    return 'editorial'
  }
  const writingMatch = /^\/writing\/([^/]+)\/?$/.exec(pathname)
  if (writingMatch) {
    return WRITING_EDITORIAL_SLUGS.has(writingMatch[1]) ? 'editorial' : 'inner-page'
  }
  const featureMatch = /^\/feature\/([^/]+)\/?$/.exec(pathname)
  if (featureMatch) {
    return FEATURE_EDITORIAL_SLUGS.has(featureMatch[1]) ? 'editorial' : 'inner-page'
  }
  return 'inner-page'
}

const WRITING_CASE_STUDY_SLUGS = new Set([
  'tracing-the-roots-of-graffiti-in-the-philippines',
  'the-intertextuality-of-manila-slums-pieta',
  'the-intertextuality-of-manila-slums',
  'enterprise-disbursements-money-movement',
  LEGACY_DISBURSEMENTS_WRITING_SLUG,
  'hello-world',
])

function isWritingCaseStudyPath(pathname: string): boolean {
  const match = /^\/writing\/([^/]+)\/?$/.exec(pathname)
  return match ? WRITING_CASE_STUDY_SLUGS.has(match[1]) : false
}

function isWritingLikePath(pathname: string): boolean {
  if (/^\/writing\/?$/.test(pathname)) return false

  if (isWritingCaseStudyPath(pathname)) return true

  // Some entries are tagged as "Writing" on the homepage but live under `/feature/`.
  if (pathname === '/feature/tedx-digital-services-cambridge-ltd') return true

  return false
}

type WorkItem = {
  id: string
  tag: string
  label?: string
  title: string
  description: string
  href: string
  thumbnailSrc?: string
  /** Muted looping tile video (served from `public/`). Takes precedence over `thumbnailSrc` when both are set. */
  thumbnailVideoSrc?: string
  /** Optional poster image shown before a video tile is activated. */
  thumbnailPosterSrc?: string
  placeholder?: boolean
  showMedia?: boolean
  twoUp?: boolean
  actions?: readonly {
    label: string
    href: string
    variant?: 'primary' | 'secondary'
  }[]
}

const works: WorkItem[] = [
  {
    id: 'enterprise-disbursements',
    tag: 'Case study',
    label: 'Financial Management',
    title: 'Enterprise disbursements',
    description: 'Case study with texture: strategic bets, failed explorations, and honest async status inside banking APIs and risk policy\u2014plus a live prototype.',
    href: '/writing/enterprise-disbursements-money-movement',
    actions: [
      { label: 'Read case study', href: '/writing/enterprise-disbursements-money-movement', variant: 'primary' },
    ],
    thumbnailVideoSrc: '/showreel-web-gallery-remix.mp4',
    thumbnailPosterSrc: '/disbursement-case-before.svg',
  },
  {
    id: 'shipmates',
    tag: 'Case study',
    label: 'Logistics and Supply Chain',
    title: 'Shipmates',
    description: 'Logistics platform for Philippine e-commerce.',
    href: '#',
    thumbnailSrc: '/disbursement-case-before.svg',
    placeholder: true,
  },
  {
    id: 'cambridge',
    tag: 'Case study',
    label: 'Education Technology',
    title: 'Cambridge',
    description: 'Enterprise digital services.',
    href: '#',
    thumbnailSrc: '/disbursement-case-after.svg',
    placeholder: true,
  },
  {
    id: 'case-study-04',
    tag: 'Case study',
    label: 'Technology Service',
    title: 'Case Study 04',
    description: 'Coming soon.',
    href: '#',
    thumbnailSrc: '/disbursement-case-before.svg',
    placeholder: true,
    twoUp: true,
  },
  {
    id: 'case-study-05',
    tag: 'Case study',
    label: 'Technology Service',
    title: 'Case Study 05',
    description: 'Coming soon.',
    href: '#',
    thumbnailSrc: '/disbursement-case-after.svg',
    placeholder: true,
    twoUp: true,
  },
]

const sideProjects: WorkItem[] = [
  {
    id: 'scratchly',
    tag: 'Side project',
    title: 'Scratchly',
    description: 'Scratch-off game builder.',
    href: 'https://scratchly.xyz/',
  },
  {
    id: 'designr',
    tag: 'Side project',
    title: '/designr',
    description: 'Design rule generator for Claude Code.',
    href: 'https://cedlll.github.io/designr/',
  },
  {
    id: 'tsek-space',
    tag: 'Side project',
    title: 'Tsek Space',
    description: 'Community fact-checking tool.',
    href: 'https://tsek-space-jxfpbny1s-cedricl-projects.vercel.app/',
  },
]

const writingItems: WorkItem[] = [
  {
    id: 'graffiti',
    tag: 'Writing',
    title: 'Tracing the Roots of Graffiti in the Philippines',
    description: 'On Flipone and the origins of Filipino graffiti culture (2018).',
    href: '/writing/tracing-the-roots-of-graffiti-in-the-philippines',
  },
  {
    id: 'manila-pieta',
    tag: 'Writing',
    title: "Manila Slum\u2019s Piet\u00E0",
    description: 'Media texts and the Philippine drug war (2018).',
    href: '/writing/the-intertextuality-of-manila-slums-pieta',
  },
  {
    id: 'tedx-rohq',
    tag: 'Writing',
    title: 'TEDxDigitalServicesCambridgeROHQ',
    description: 'Event curation and cross-cultural storytelling.',
    href: '/feature/tedx-digital-services-cambridge-ltd',
  },
]

const testimonialItems: WorkItem[] = [
  {
    id: 'testimonial-1',
    tag: 'Testimonial',
    title: 'Head of Product, Fintech',
    description:
      '"Cedric is one of the rare designers who can move from systems thinking to execution without losing speed or craft."',
    href: '#',
    placeholder: true,
    showMedia: false,
  },
  {
    id: 'testimonial-2',
    tag: 'Testimonial',
    title: 'Startup Founder',
    description:
      '"He helped us turn a complex workflow into something customers understood instantly, and adoption improved right away."',
    href: '#',
    placeholder: true,
    showMedia: false,
  },
  {
    id: 'testimonial-3',
    tag: 'Testimonial',
    title: 'Design Manager',
    description:
      '"Cedric leads with clarity, mentors generously, and consistently raises the quality bar for the whole team."',
    href: '#',
    placeholder: true,
    showMedia: false,
  },
]

const selectedWorkTop = works.filter(
  (w) => w.tag === 'Case study' && !w.twoUp && !w.placeholder
)
const selectedWorkBottom = works.filter(
  (w) => w.tag === 'Case study' && w.twoUp && !w.placeholder
)

function WorkRow({
  item,
  showMedia = true,
  showTextNudge = false,
  onPreviewOpen,
}: Readonly<{
  item: WorkItem
  showMedia?: boolean
  showTextNudge?: boolean
  onPreviewOpen?: (item: WorkItem) => void
}>) {
  const [isVideoActivated, setIsVideoActivated] = useState(false)
  const rowShowMedia = showMedia && item.showMedia !== false
  const textOnly = rowShowMedia === false
  const external = isExternalHref(item.href)
  const linkProps = external
    ? ({ target: '_blank', rel: 'noopener noreferrer' } as const)
    : {}
  const shouldOpenPreview = external && Boolean(onPreviewOpen)
  const hasActions = Boolean(item.actions?.length)
  const isStaticRow = item.placeholder || item.href === '#' || hasActions
  const hasVideo = Boolean(item.thumbnailVideoSrc)
  const showVideo = hasVideo && (isVideoActivated || isStaticRow)
  const posterSrc = item.thumbnailPosterSrc ?? item.thumbnailSrc

  const handleActivateVideo = () => {
    if (!hasVideo || isVideoActivated) return
    setIsVideoActivated(true)
  }

  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!shouldOpenPreview || !onPreviewOpen) return
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }
    event.preventDefault()
    onPreviewOpen(item)
  }

  const inner = (
    <>
      <div className="ed-work-text">
        {item.tag === 'Case study' && item.label ? (
          <span className="ed-work-label">{item.label}</span>
        ) : null}
        <h2 className="ed-work-title">{item.title}</h2>
        <p className="ed-work-desc">{item.description}</p>
        {item.actions?.length ? (
          <div className="ed-work-actions" aria-label={`${item.title} actions`}>
            {item.actions.map((action) => {
              const actionIsExternal = isExternalHref(action.href)
              return (
                <a
                  key={action.label}
                  href={action.href}
                  className={`ed-work-action ${action.variant === 'secondary' ? 'ed-work-action--secondary' : ''}`.trim()}
                  {...(actionIsExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {action.label}
                </a>
              )
            })}
          </div>
        ) : null}
      </div>
      {rowShowMedia ? (
        <div
          className={`ed-work-media${
            item.thumbnailSrc || item.thumbnailVideoSrc || item.thumbnailPosterSrc
              ? ' ed-work-media--thumb'
              : ''
          }${showVideo ? ' ed-work-media--video' : ''}`.trim()}
          aria-hidden
          style={
            posterSrc && !showVideo
              ? { backgroundImage: `url(${posterSrc})` }
              : undefined
          }
        >
          {item.thumbnailVideoSrc && showVideo ? (
            <video
              className="ed-work-media-video"
              src={item.thumbnailVideoSrc}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              poster={posterSrc}
            />
          ) : null}
        </div>
      ) : null}
    </>
  )

  if (isStaticRow) {
    return (
      <article
        className={`ed-work-row ${textOnly ? 'ed-work-row--text' : ''} ${item.twoUp ? 'ed-work-row--two-up' : ''} ${item.tag === 'Case study' ? 'home-case-study-row' : ''} ${item.placeholder ? 'ed-work-row--placeholder' : ''}`.trim()}
      >
        {inner}
      </article>
    )
  }

  return (
    <a
      href={item.href}
      className={`ed-work-row ${textOnly ? 'ed-work-row--text' : ''} ${item.twoUp ? 'ed-work-row--two-up' : ''} ${item.tag === 'Case study' ? 'home-case-study-row' : ''} ${showTextNudge ? 'ed-work-row--text-nudge' : ''} home-project-link`.trim()}
      onClick={handleLinkClick}
      onMouseEnter={handleActivateVideo}
      onFocus={handleActivateVideo}
      onTouchStart={handleActivateVideo}
      {...linkProps}
    >
      {inner}
    </a>
  )
}

function WorkSection({
  label,
  items,
  className,
  showMedia = true,
  showTextNudge = false,
  showLabel = true,
  onPreviewOpen,
}: Readonly<{
  label: string
  items: readonly WorkItem[]
  className?: string
  showMedia?: boolean
  showTextNudge?: boolean
  showLabel?: boolean
  onPreviewOpen?: (item: WorkItem) => void
}>) {
  return (
    <section className={`ed-section ${className ?? ''}`.trim()} aria-label={label}>
      {showLabel ? <h2 className="ed-section-label">{label}</h2> : null}
      <div className="ed-work-list">
        {items.map((item) => (
          <WorkRow
            key={item.id}
            item={item}
            showMedia={showMedia}
            showTextNudge={showTextNudge}
            onPreviewOpen={onPreviewOpen}
          />
        ))}
      </div>
    </section>
  )
}

const NAV_SOCIAL = {
  linkedin: 'https://www.linkedin.com/in/cedmanila/',
  github: 'https://github.com/cedlll',
} as const

function MainNavigation({ pathname }: Readonly<{ pathname: string }>) {
  const isHomeActive = pathname === '/'
  const isAboutActive = pathname === '/about'

  const linkClass = (isActive: boolean) => `ed-links-link${isActive ? ' is-active' : ''}`

  return (
    <nav className="ed-hero-links" aria-label="Navigation">
      <ul className="ed-links-list">
        <li className="ed-links-item">
          <a href="/" className={linkClass(isHomeActive)}>
            Home
          </a>
        </li>
        <li className="ed-links-item">
          <a href="/about" className={linkClass(isAboutActive)}>
            About
          </a>
        </li>
        <li className="ed-links-item">
          <a
            href={NAV_SOCIAL.linkedin}
            className="ed-links-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </li>
        <li className="ed-links-item">
          <a
            href={NAV_SOCIAL.github}
            className="ed-links-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </li>
      </ul>
    </nav>
  )
}

function HomeView({
  showScrollTop,
  handleScrollTop,
  pathname,
  previewItem,
  onOpenPreview,
  onClosePreview,
}: Readonly<{
  showScrollTop: boolean
  handleScrollTop: () => void
  pathname: string
  previewItem: WorkItem | null
  onOpenPreview: (item: WorkItem) => void
  onClosePreview: () => void
}>) {
  const homeRootRef = useRef<HTMLDivElement>(null)
  useHomeGsap(homeRootRef)

  return (
    <div className="page page--home">
      {showScrollTop && !previewItem && (
        <button
          type="button"
          className="scroll-top-button"
          onClick={handleScrollTop}
          aria-label="Scroll to top"
          title="Scroll to top"
        >
          &#8963;
        </button>
      )}
      <div ref={homeRootRef} className="page-inner page-inner--home">
        <main className="home-main">
          <MainNavigation pathname={pathname} />

          {/* Hero headline + description */}
          <section id="about" className="home-intro-editorial" aria-labelledby="hero-heading">
            <div className="home-hero-title-row">
              <h1 id="hero-heading" className="ed-hero-headline home-hero-headline">
                <span className="ed-hero-headline-line">
                  <span className="ed-hero-headline-name" />
                  <span className="ed-hero-headline-line-suffix" />
                </span>
                <span className="ed-hero-headline-rotator-wrap" aria-hidden="true">
                  <span className="ed-hero-headline-serif ed-hero-headline-rotator" />
                  <span className="ed-hero-headline-cursor" />
                </span>
              </h1>
            </div>

            <div className="home-hero-about">
              <p className="home-hero-about-col">
                I care about systems thinking, legible complexity, and craft: making dense domains (payments,
                logistics, policy) feel understandable without dumbing them down.
              </p>
            </div>
          </section>

          {/* ── Selected works ── */}
          <div id="selected-work" className="ed-works home-projects">
            <WorkSection label="Selected works" items={selectedWorkTop} showLabel={false} />
            {selectedWorkBottom.length > 0 ? (
              <WorkSection
                label="More case studies"
                items={selectedWorkBottom}
                className="ed-section--selected-work-tail"
              />
            ) : null}
            <WorkSection
              label="Testimonials"
              items={testimonialItems}
              className="ed-section--testimonials"
              showMedia={false}
            />
            <WorkSection
              label="Side projects"
              items={sideProjects}
              className="ed-section--side-projects"
              showTextNudge
              onPreviewOpen={onOpenPreview}
            />
            <WorkSection
              label="Writing"
              items={writingItems}
              className="ed-section--writing-speaking"
              showTextNudge
            />
          </div>

          <footer className="site-footer">
            <p className="site-footer-copy">
              Clarence Cedric Lee &copy; {new Date().getFullYear()}
            </p>
          </footer>
        </main>
      </div>
      {previewItem ? (
        <dialog className="link-preview-overlay" open aria-label="Link preview modal">
          <div className="link-preview-modal">
            <div className="link-preview-modal-header">
              <p className="link-preview-modal-title">{previewItem.title}</p>
              <div className="link-preview-modal-actions">
                <a
                  href={previewItem.href}
                  className="link-preview-modal-text-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit site
                </a>
                <button
                  type="button"
                  className="link-preview-modal-button link-preview-modal-button--primary"
                  onClick={onClosePreview}
                  aria-label="Close preview"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="link-preview-modal-body">
              <iframe
                className="link-preview-iframe"
                src={previewItem.href}
                title={`Preview of ${previewItem.title}`}
                loading="lazy"
              />
            </div>
          </div>
        </dialog>
      ) : null}
    </div>
  )
}

function App() {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [previewItem, setPreviewItem] = useState<WorkItem | null>(null)
  const pathname = globalThis.window?.location.pathname ?? '/'
  const isWritingIndexPath = /^\/writing\/?$/.test(pathname)
  const isWritingArticlePath = /^\/writing\/[^/]+\/?$/.test(pathname) && !isWritingIndexPath
  const isWritingSection = isWritingIndexPath || isWritingArticlePath
  const isFeaturePage = pathname.startsWith('/feature/')
  const isAboutPage = pathname === '/about'
  const isInnerPage = isWritingSection || isFeaturePage || isAboutPage

  useEffect(() => {
    if (globalThis.window === undefined) return

    let rafId: number | null = null
    let lastProgress = -1
    let lastShowTop = false

    const flushScroll = () => {
      rafId = null
      const { scrollY, innerHeight } = globalThis.window
      const documentHeight = globalThis.window.document.documentElement.scrollHeight
      const scrollableDistance = documentHeight - innerHeight
      const progress = scrollableDistance > 0
        ? Math.min(Math.max(scrollY / scrollableDistance, 0), 1)
        : 0
      const hasStartedScrolling = scrollY > 0
      const nextProgress = isInnerPage && !isAboutPage ? progress : 0

      if (nextProgress !== lastProgress) {
        lastProgress = nextProgress
        setScrollProgress(nextProgress)
      }
      if (hasStartedScrolling !== lastShowTop) {
        lastShowTop = hasStartedScrolling
        setShowScrollTop(hasStartedScrolling)
      }
    }

    const handleScroll = () => {
      if (rafId !== null) return
      rafId = globalThis.window.requestAnimationFrame(flushScroll)
    }

    flushScroll()
    globalThis.window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      globalThis.window.removeEventListener('scroll', handleScroll)
      if (rafId !== null) globalThis.window.cancelAnimationFrame(rafId)
    }
  }, [isInnerPage, isAboutPage, pathname])

  const handleScrollTop = () => {
    if (globalThis.window === undefined) return
    globalThis.window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePreviewOpen = (item: WorkItem) => {
    setPreviewItem(item)
  }

  const handlePreviewClose = () => {
    setPreviewItem(null)
  }

  if (isInnerPage) {
    let innerPageBody: ReactNode
    if (isAboutPage) {
      innerPageBody = <AboutPage />
    } else if (isFeaturePage) {
      innerPageBody = <FeaturePage />
    } else if (isWritingIndexPath) {
      innerPageBody = <WritingIndexPage />
    } else {
      innerPageBody = <WritingPage />
    }

    return (
      <div className="page page--inner">
        {!isAboutPage && (
          <div
            className="scroll-progress"
            style={{ transform: `scaleX(${scrollProgress})` }}
            aria-hidden="true"
          />
        )}
        {showScrollTop && (
          <button
            type="button"
            className="scroll-top-button"
            onClick={handleScrollTop}
            aria-label="Scroll to top"
            title="Scroll to top"
          >
            &#8963;
          </button>
        )}
        {/* Always `.page-inner` (1200px): toggling `.page-inner--home` (1120px) per route shifted the whole column. */}
        <div className="page-inner">
          <main
            className="home-main"
            data-inner-main-layout={innerMainArticleLayout(pathname)}
          >
            {!isWritingLikePath(pathname) && <MainNavigation pathname={pathname} />}
            <Suspense
              fallback={
                <p className="route-loading-fallback" role="status">
                  Loading&hellip;
                </p>
              }
            >
              {innerPageBody}
            </Suspense>
          </main>
        </div>
      </div>
    )
  }

  return (
    <HomeView
      showScrollTop={showScrollTop}
      handleScrollTop={handleScrollTop}
      pathname={pathname}
      previewItem={previewItem}
      onOpenPreview={handlePreviewOpen}
      onClosePreview={handlePreviewClose}
    />
  )
}

export default App
