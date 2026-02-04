import { InnerPage } from '../components/InnerPage'
import type { InnerPageBlock } from '../components/InnerPage'

const WRITINGS: Record<
  string,
  { title: string; date: string; blocks: InnerPageBlock[] }
> = {
  'field-notes-on-building-with-AI': {
    title: 'Field notes on building with AI',
    date: 'TBD',
    blocks: [
      {
        type: 'point',
        text: 'WIP',
      },
    ],
  },
  'tracing-the-roots-of-graffiti-in-the-philippines': {
    title: 'Tracing the roots of graffiti in the Philippines',
    date: 'TBD',
    blocks: [
      {
        type: 'point',
        text: 'Read the full piece on Medium.',
        link: {
          href: 'https://cedric-lee.medium.com/tracing-the-roots-of-graffiti-in-the-philippines-a2417dd0b1a6',
          label: 'cedric-lee.medium.com',
        },
      },
    ],
  },
  'the-intertextuality-of-manila-slums-pieta': {
    title: "The intertextuality of Manila slum's Pietà",
    date: 'June 30, 2018',
    blocks: [
      {
        type: 'point',
        text: `The creeping dictatorship of President Duterte is in full swing as it finally controlled all the branches of our government after recently ousting Chief Justice Sereno, the "enemy" deemed by the President because of her staunch criticism of the President's policies.\n\nCould media texts help us counter this paradigm shift?`,
      },
      {
        type: 'image',
        src: '/pieta.webp',
        alt: "Michelangelo's Pietà sculpture, photo by Stanislav Traykov on Wikimedia Commons (CC BY 2.5)",
        caption: 'Stanislav Traykov, Wikimedia Commons. CC BY 2.5.',
      },
      {
        type: 'point',
        text: "Michelangelo's Pietà depicts the body of Jesus Christ lying in the lap of Mother Mary after his Crucifixion. Contrary to popular belief, Michelangelo did not intend to signify death, but to espouse the \"religious vision of abandonment and a serene face of the Son.\"",
        link: {
          href: 'https://books.google.com.ph/books?id=dYTxCwAAQBAJ&pg=PT31&lpg=PT31&dq=%E2%80%9Creligious+vision+of+abandonment+and+a+serene+face+of+the+Son.%E2%80%9D+vatican&ots=Yj5lml-53F&sig=EGC17GZpxJuBmPQd_zhjeyo7BWY&hl=en&sa=X&ved=0ahUKEwi94ce6kv3bAhUId94KHYkpDDcQ6AEIRTAD#v=onepage&q=%E2%80%9Creligious%20vision%20of%20abandonment%20and%20a%20serene%20face%20of%20the%20Son.%E2%80%9D%20vatican&f=false',
          label: '[1]',
          superscript: true,
        },
      },
      {
        type: 'point',
        text: "Since Pietà's creation in 1499, the famous Renaissance sculpture, the only piece ever signed by Michelangelo, has inspired faith and emotion through its beautiful depiction of the Virgin Mary and Jesus Christ.",
      },
      {
        type: 'image',
        src: '/pdi.webp',
        alt: 'Front page of the Philippine Daily Inquirer showing the Pietà-like photograph of Jennilyn Olayres holding Michael Siaron after his killing during the Philippine drug war. Photo by Raffy Lerma.',
        caption: "Raffy Lerma’s Pietà-like photograph as the Philippine Daily Inquirer’s front page on July 24, 2016.",
      },
      {
        type: 'point',
        text: "Michael Siaron, a pedicab driver, was suspected to be a drug pusher in Pasay City. He was shot and killed by riding-in-tandem gunmen in the street where his wife, Jennilyn Olayres, found him lifeless in his own pool of blood; next to it a cardboard sign with the words, \"I am a drug pusher, don't emulate\", written in all-black capital letters.",
      },
      {
        type: 'point',
        text: "Siaron's death is considered as \"cardboard justice\" in the Philippines wherein suspected criminals are hastily killed—leaving a cardboard sign on their corpse, and labeling who they are and how they should not be emulated by the public.",
      },
      {
        type: 'point',
        text: "During his 9 PM to 5 AM shift, Raffy Lerma, a photographer for the Philippine Daily Inquirer, had photographed Siaron's death that night, and did not expect his photograph to be likened to Michelangelo's Pietà. The photograph easily went viral and even made it to the front page of the Philippine Daily Inquirer and was carried by international news outlets like The New York Times and The Times. The photograph quickly irked President Duterte and described the public outcry as \"melodramatic\" during his first State of the Nation Address (SONA) in 2016.",
      },
      {
        type: 'imageCompare',
        beforeSrc: '/pieta.webp',
        afterSrc: '/rlerma.webp',
        beforeAlt: "Michelangelo's Pietà sculpture",
        afterAlt: "Raffy Lerma's Pietà-like photograph, Philippine Daily Inquirer front page, 2016",
        caption: "The glaring similarities of Raffy Lerma’s photograph to Michelangelo’s Pietà has caught the public’s attention.",
      },
      {
        type: 'point',
        text: "Nonetheless, Manila slums' Pietà personified the cost of the drug war in the Philippines—thus, raising the debate over the rise of extrajudicial killings and impunity while President Duterte's allies shrugged the issue by labeling it as a Yellow media-driven propaganda and deemed the killings as a \"necessary\" step to ensure safety and security.",
      },
      {
        type: 'image',
        src: '/reuters.webp',
        alt: 'Protesters and residents holding lighted candles and placards at the wake of Kian Loyd delos Santos, a 17-year-old student killed in Duterte’s drug war. Photo by Dondi Tawatao, 2017, Reuters.',
        caption: 'Protesters and residents hold lighted candles and placards at the wake of Kian Loyd delos Santos, a 17-year-old high school student, who was among the thousands killed by President Duterte’s war on drugs. © 2017 Dondi Tawatao / Reuters',
        
      },
      {
        type: 'point',
        text: "For human rights advocates, time is of the essence so they must gather all the support they need to counter the popularity or momentum of the drug war and the continuing impunity in the country. Manila slums' Pietà adds to their ammunition as it helped the international news outlets depict and narrate the bloody drug war to the rest of the world—thus, prompting other nations to act and condemn President Duterte's controversial methods and paradigm shift.",
      },
      {
        type: 'point',
        text: "Manila slums' Pietà is speaking to us by telling the hypocrisy of a Catholic-dominated country blindly supporting President Duterte's drug war where it goes against the Church's teaching of valuing human life by the \"Thou Shall Not Kill\" commandment.",
      },
      {
        type: 'quote',
        line1: 'Thou Shall Not Kill',
        line2: "— the Church's teaching of valuing human life",
      },
      {
        type: 'point',
        text: "Michelangelo's Pietà enriches the discourse and message of Manila slums' own version of it by asking the re-evaluation of our moral values and who we really are as a nation. The moral decay of blatantly disregarding human life is damaging our institutions and foundations as a rights-respecting nation at an alarming rate. For instance, the attack and intimidation of institutions like the Commission on Human Rights (CHR) of the Philippines.",
      },
      {
        type: 'point',
        text: "Indeed, Manila slums' Pietà helped raise the discourse and media texts like these should be explored even more to understand why most Filipinos voted for President Duterte's brand of \"change\" and dig deeper to the WHYs of the populist revolt against elite democracy.\n\n — Cedric",
      },
    ],
  },
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
