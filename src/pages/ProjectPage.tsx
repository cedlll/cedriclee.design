import { InnerPage } from '../components/InnerPage'

/**
 * Example usage of the InnerPage template.
 * Reuse this pattern for project, writing, or feature pages.
 */
export function ProjectPage() {
  return (
    <InnerPage
      title="The intertextuality of Manila slums"
      date="February 2, 2025"
      backHref="/"
      blocks={[
        {
          type: 'point',
          label: 'Point',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        },
        {
          type: 'image',
          src: '/cedric-photo.png',
          alt: 'Project image',
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
      ]}
    />
  )
}
