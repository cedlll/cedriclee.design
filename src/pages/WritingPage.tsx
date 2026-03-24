import { InnerPage } from '../components/InnerPage'
import type { InnerPageBlock } from '../components/InnerPage'

const WRITINGS: Record<
  string,
  { title: string; date: string; blocks: InnerPageBlock[] }
> = {
  'tracing-the-roots-of-graffiti-in-the-philippines': {
    title: 'Tracing the roots of graffiti in the Philippines',
    date: '2018',
    blocks: [
      {
        type: 'point',
        text: 'With the graffiti movement in the Philippines on the rise in the past couple of years, adding vibrancy and diversity to our arts and culture, how much do we know about its beginnings in the Philippines? In this article, I focused on knowing one of the key movers in the history and progression of graffiti in the Philippines: Jayo "Flipone" Santiago.',
      },
      {
        type: 'image',
        src: '/1_IB8KGxckntZdWIM9nMDhkw.webp',
        alt: "Flipone's LP '14 piece",
        caption: "Flipone's LP '14 piece. Image from Jayo Santiago, Facebook.",
      },
      {
        type: 'point',
        text: 'Jayo Santiago, known in the graffiti scene as Flipone, is among the first or could be the first, to bring graffiti to the Philippines. He was heavily influenced by the growing hip-hop movement in New York City in the late 1970s to early 1980s characterized by its diversity, influence, and innovation. The hip-hop movement revolved around four key areas: MCing (now known as rapping), DJing (disk jockey), graffiti art, and b-boying (breakdancing).',
      },
      {
        type: 'image',
        src: '/1_ZIIVx3q21LtLRPxr66QdxQ.webp',
        alt: 'B-Girl Laneski break dancing in New York City, 1985',
        caption:
          'B-Girl Laneski break dancing in New York City, 1985. National Museum of American History, Smithsonian Institution.',
      },
      {
        type: 'point',
        text: "Flipone's main artistic influence rooted from the New York City graffiti movement also in the 1970s to 1980s. Back then, New York City was entirely different than the city today because it was covered in graffiti. This social and cultural phenomenon worthy of attention and study was beautifully captured by Charlie Ahearn's 1983 film Wild Style where it magnified the innocence of early hip-hop and its synergy with graffiti.",
      },
      {
        type: 'image',
        src: '/1_MNPMzCVGkwh5s7hybG6LRg.webp',
        alt: 'Freshly Painted Wild Style Wall in Riverside Park, Manhattan, NYC, 1983',
        caption:
          'Freshly Painted Wild Style Wall in Riverside Park, Manhattan, NYC, 1983. Steven Kasher Gallery',
      },
      {
        type: 'point',
        text: 'While exploring various hip-hop books and magazines, Flipone saw photographs of graffiti in different parts of New York City and suddenly thought of bringing the art form in the Philippines. He, later on, did his first graffiti piece in 1990 at a canal in Makati City near the office where his father used to work.',
      },
      {
        type: 'image',
        src: '/1_lNNgwoIkPiligftBXkxX3A.webp',
        alt: "Early works of Flipone in the early to mid-90's",
        caption: "Early works of Flipone in the early to mid-90's. Images from Jayo Santiago, Facebook.",
      },
      {
        type: 'point',
        label: 'Developing the Own Style',
        text: 'Inspired initially by Seen, Dondi, Phase 2, and Lee -- all well-known artists from the New York City graffiti scene, Flipone decided to develop a "Pinoy" style graffiti -- getting various influences from Filipino ethnic and indigenous cultures like the Baybayin alphabet, traditional Ifugao weaving patterns, and Kalinga tattoo patterns.',
      },
      {
        type: 'image',
        src: '/1_pFC3TMoTJFcGSf5Zf6OduQ.webp',
        alt: 'SBA crew in 2003',
        caption: 'SBA crew in 2003. Images from Jayo Santiago, Facebook.',
      },
      {
        type: 'point',
        text: 'Armed with skills and experience, Flipone, together with Flow-1, also a Filipino graffiti artist, formed the Filipino graffiti crew called Syndikato Batang Aerosol (originally called Subway Army) in 1993 and invited other artists to join the growing graffiti movement in the Philippines. Eventually, the graffiti crew changed its name to Samahang Batang Aerosol (SBA) in 1998 and still continued to make waves especially in the hip-hop scene where their art found its home.',
      },
      {
        type: 'point',
        label: 'Connecting to Worldwide Graffiti',
        text: 'Flipone used Facebook to post his work and connect with people of the same interests. Social media helped his works reach a wider and diverse audience as it made the connection with other artists and organizations easier.',
      },
      {
        type: 'image',
        src: '/1_m34rOsGNOSkcCUyrEdJa8Q.webp',
        alt: 'Flipone in Hong Kong (2001)',
        caption: 'Flipone in Hong Kong (2001). Images from Jayo Santiago, Facebook.',
      },
      {
        type: 'point',
        text: 'Before social media emerged, Flipone used the Internet that was starting to develop back in the 1990s as a medium in getting recognized for their art -- with the aim of putting the Philippines on the worldwide graffiti map. He posts photographs of their works in Art Crimes, a premier graffiti website, where SBA\'s website is also linked to expanding their online presence.',
      },
      {
        type: 'point',
        label: "Graffiti's Challenges in the Philippines",
        text: 'Flipone describes graffiti as "a letter based art form painted in walls or on trains" and "an art form that developed in the streets and it belongs to the streets." He views galleries and museums as of a higher status where graffiti seems to be out of place there.',
      },
      {
        type: 'image',
        src: '/1_PxUJgUxW1XOrVpd2uCg_AA.webp',
        alt: 'Banksy street art reference image',
        caption:
          '"Arguably the most controversial street artist in the world, Banksy has developed an entire art subculture devoted to his works. Banksy\'s art can impact any location at any given moment." -- tharum.com',
      },
      {
        type: 'point',
        text: 'In the October 2016 issue of Rogue, University of the Philippines Los Banos sociology professor Raphael Villasenor considers graffiti as an act of deviancy since "it\'s done in a place where it is not meant to be done" while former National Commission for Culture and the Arts (NCCA) Chairman Felipe de Leon Jr. believes street art give new meaning to blank walls because "it\'s a way of enhancing human quality; you humanize the place."',
      },
      {
        type: 'point',
        text: 'Asked about what is it like being a graffiti artist in the Philippines, Flipone shared, "You get the best of both worlds. There will be people who will appreciate you and look up to you and there are those who will hate you."',
      },
      {
        type: 'image',
        src: '/1_x5dcb2dhfGXtzHJJN-xJjQ.webp',
        alt: 'Updated signature piece celebrating 120 years of Philippine Independence',
        caption:
          '"Celebrating 120 years of Philippine Independence with an updated and upgraded version of my signature piece! I am PILIPINO!" -- Jayo Santiago, Facebook.',
      },
      {
        type: 'point',
        text: 'Flipone believes one of the biggest challenges of graffiti in the Philippines is developing the next generation of graffiti artists given that the scene is continuously getting bigger. He also points to social status as one of the problems with many of the current generation of graffiti artists since they come from either the working or lower middle class. "They can only afford to buy a limited amount of spray paint and the cheapest ones are not even of good quality," he said.',
      },
      {
        type: 'point',
        text: 'Why is graffiti worthy of our attention? How is graffiti used in different contexts and why graffiti is the chosen medium? How far have we reached in understanding graffiti? The struggle to expand our knowledge of graffiti continues as our society still limit it to vandalism and gang-related. As Lovata and Olton (2015) explain, "Graffiti offer profound social, political, psychological, and cultural insights. It facilitates a discourse that refuses to adhere to any normative protocol. The discourse is inherently democratic because all persons possess the capability to initiate and/or participate in an uninhibited manner.',
      },
    ],
  },
  'the-intertextuality-of-manila-slums-pieta': {
    title: "The intertextuality of Manila slum's Pietà",
    date: '2018',
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
        text: "Indeed, Manila slums' Pietà helped raise the discourse and media texts like these should be explored even more to understand why most Filipinos voted for President Duterte's brand of \"change\" and dig deeper to the WHYs of the populist revolt against elite democracy.",
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
