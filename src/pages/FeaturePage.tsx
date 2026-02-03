import { InnerPage } from '../components/InnerPage'
import type { InnerPageBlock } from '../components/InnerPage'

const FEATURES: Record<
  string,
  { title: string; date: string; blocks: InnerPageBlock[] }
> = {
  'ux-plus-2025': {
    title: 'UX+ 2025',
    date: '',
    blocks: [
      {
        type: 'point',
        text: 'In 2025, I spoke at the largest UX conference in Asia about learnings from my experience in co-creating with AI, along with my co-speakers are from Google, Canva, and other leading companies in the field.',
      },
      {
        type: 'carousel',
        slides: [
          { src: '/ux-plus-2025-1.png', alt: 'UX+ 2025 conference theme: Vibes and Value, SMX Convention Center Manila, Sep 14, 2025' },
          { src: '/ux-plus-2025-2.png', alt: 'Wrap-up slide: Adapt using First Principles, Co-create with AI guided by human judgment, AI safety is a shared duty' },
          { src: '/ux-plus-2025-3.png', alt: 'AI Sandbox concept: Play, Design, Build' },
          { src: '/ux-plus-2025-4.png', alt: '3 big lessons from co-creating with AI: Sharpen AI fluency, principles, Human-centered Design as differentiator' },
          { src: '/ux-plus-2025-5.png', alt: 'First Principles Thinking diagram: Problem, Relationships and dynamics, Future state' },
        ],
      },
    ],
  },
  'tedx-digital-services-cambridge-ltd': {
    title: 'TEDxDigitalServicesCambridgeLtd',
    date: '',
    blocks: [
      {
        type: 'point',
        text: 'In 2021, I spoke at my past company, Cambridge Uni Press and Assessment, on the topic of UX and Agile.',
        link: {
          href: 'https://medium.com/design-bootcamp/5-ways-to-maximize-ux-in-an-agile-setting-46b7b8ac3bee',
          label: 'Read the key points of my talk.',
        },
      },
      {
        type: 'image',
        src: '/tedx-award.png',
        alt: 'TEDx DigitalServicesCambridgeLimited award for Maximising UX in Agile, January 22, 2021, Makati City',
      },
    ],
  },
}

function getFeatureSlug(): string {
  if (typeof globalThis.window === 'undefined') return ''
  const match = globalThis.window.location.pathname.match(/^\/feature\/(.+)$/)
  return match ? match[1] : ''
}

export function FeaturePage() {
  const slug = getFeatureSlug()
  const feature = FEATURES[slug]

  if (!feature) {
    return (
      <InnerPage
        title="Not found"
        date=""
        blocks={[
          {
            type: 'point',
            text: 'This feature does not exist.',
          },
        ]}
      />
    )
  }

  return (
    <InnerPage
      title={feature.title}
      date={feature.date}
      backHref="/"
      blocks={feature.blocks}
    />
  )
}
