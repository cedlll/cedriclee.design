import { InnerPage } from '../components/InnerPage'
import type { InnerPageBlock } from '../components/InnerPage'

const WRITINGS: Record<
  string,
  { title: string; date: string; blocks: InnerPageBlock[] }
> = {
  'the-intertextuality-of-manila-slums': {
    title: 'The intertextuality of Manila slums',
    date: 'February 2, 2025',
    blocks: [
      {
        type: 'point',
        label: 'Point',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      },
      {
        type: 'image',
        src: '/cedric-photo.png',
        alt: 'Writing image',
        caption: '28 12 2025',
      },
      {
        type: 'point',
        label: 'Point',
        text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      },
      {
        type: 'quote',
        line1: "Insert a quote here that's memorable",
        line2: 'And this is the second line.',
      },
      {
        type: 'point',
        label: 'Point',
        text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
      },
    ],
  },
  'hello-world': {
    title: 'Hello world',
    date: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    blocks: [
      {
        type: 'point',
        label: 'Point',
        text: 'Hello world. This is a new writing entry using the InnerPage template.',
      },
    ],
  },
}

function getWritingSlug(): string {
  if (typeof globalThis.window === 'undefined') return ''
  const match = globalThis.window.location.pathname.match(/^\/writing\/(.+)$/)
  return match ? match[1] : ''
}

/**
 * Writing page using the InnerPage template.
 * Renders content based on the URL slug.
 */
export function WritingPage() {
  const slug = getWritingSlug()
  const writing = WRITINGS[slug]

  if (!writing) {
    return (
      <InnerPage
        title="Not found"
        date=""
        blocks={[
          {
            type: 'point',
            text: 'This writing does not exist.',
          },
        ]}
      />
    )
  }

  return (
    <InnerPage
      title={writing.title}
      date={writing.date}
      backHref="/"
      blocks={writing.blocks}
    />
  )
}
