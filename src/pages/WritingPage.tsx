import { lazy, Suspense, useLayoutEffect } from 'react'
import { InnerPage } from '../components/InnerPage'
import type { InnerPageBlock } from '../components/InnerPage'
import { EditorialWritingLayout } from '../components/EditorialWritingLayout'
import { LEGACY_DISBURSEMENTS_WRITING_SLUG } from '../lib/legacyDisbursementsWritingSlug'

const DisbursementsCaseStudy = lazy(() =>
  import('../components/DisbursementsCaseStudy').then((m) => ({ default: m.DisbursementsCaseStudy }))
)

/** Canonical slug for the disbursements case study; legacy URL is rewritten in the client. */
const DISBURSEMENTS_CASE_STUDY_SLUG = 'enterprise-disbursements-money-movement'

function normalizeWritingSlug(raw: string): string {
  return raw === LEGACY_DISBURSEMENTS_WRITING_SLUG ? DISBURSEMENTS_CASE_STUDY_SLUG : raw
}

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
    title: "The intertextuality of Manila slum's Piet\u00E0",
    date: '2018',
    blocks: [
      {
        type: 'point',
        text: `The creeping dictatorship of President Duterte is in full swing as it finally controlled all the branches of our government after recently ousting Chief Justice Sereno, the "enemy" deemed by the President because of her staunch criticism of the President's policies.\n\nCould media texts help us counter this paradigm shift?`,
      },
      {
        type: 'image',
        src: '/pieta.webp',
        alt: "Michelangelo's Piet\u00E0 sculpture, photo by Stanislav Traykov on Wikimedia Commons (CC BY 2.5)",
        caption: 'Stanislav Traykov, Wikimedia Commons. CC BY 2.5.',
      },
      {
        type: 'point',
        text: "Michelangelo's Piet\u00E0 depicts the body of Jesus Christ lying in the lap of Mother Mary after his Crucifixion. Contrary to popular belief, Michelangelo did not intend to signify death, but to espouse the \"religious vision of abandonment and a serene face of the Son.\"",
        link: {
          href: 'https://books.google.com.ph/books?id=dYTxCwAAQBAJ&pg=PT31&lpg=PT31&dq=%E2%80%9Creligious+vision+of+abandonment+and+a+serene+face+of+the+Son.%E2%80%9D+vatican&ots=Yj5lml-53F&sig=EGC17GZpxJuBmPQd_zhjeyo7BWY&hl=en&sa=X&ved=0ahUKEwi94ce6kv3bAhUId94KHYkpDDcQ6AEIRTAD#v=onepage&q=%E2%80%9Creligious%20vision%20of%20abandonment%20and%20a%20serene%20face%20of%20the%20Son.%E2%80%9D%20vatican&f=false',
          label: '[1]',
          superscript: true,
        },
      },
      {
        type: 'point',
        text: "Since Piet\u00E0's creation in 1499, the famous Renaissance sculpture, the only piece ever signed by Michelangelo, has inspired faith and emotion through its beautiful depiction of the Virgin Mary and Jesus Christ.",
      },
      {
        type: 'image',
        src: '/pdi.webp',
        alt: "Front page of the Philippine Daily Inquirer showing the Piet\u00E0-like photograph of Jennilyn Olayres holding Michael Siaron after his killing during the Philippine drug war. Photo by Raffy Lerma.",
        caption: "Raffy Lerma's Piet\u00E0-like photograph as the Philippine Daily Inquirer's front page on July 24, 2016.",
      },
      {
        type: 'point',
        text: "Michael Siaron, a pedicab driver, was suspected to be a drug pusher in Pasay City. He was shot and killed by riding-in-tandem gunmen in the street where his wife, Jennilyn Olayres, found him lifeless in his own pool of blood; next to it a cardboard sign with the words, \"I am a drug pusher, don't emulate\", written in all-black capital letters.",
      },
      {
        type: 'point',
        text: "Siaron's death is considered as \"cardboard justice\" in the Philippines wherein suspected criminals are hastily killed\u2014leaving a cardboard sign on their corpse, and labeling who they are and how they should not be emulated by the public.",
      },
      {
        type: 'point',
        text: "During his 9 PM to 5 AM shift, Raffy Lerma, a photographer for the Philippine Daily Inquirer, had photographed Siaron's death that night, and did not expect his photograph to be likened to Michelangelo's Piet\u00E0. The photograph easily went viral and even made it to the front page of the Philippine Daily Inquirer and was carried by international news outlets like The New York Times and The Times. The photograph quickly irked President Duterte and described the public outcry as \"melodramatic\" during his first State of the Nation Address (SONA) in 2016.",
      },
      {
        type: 'imageCompare',
        beforeSrc: '/pieta.webp',
        afterSrc: '/rlerma.webp',
        beforeAlt: "Michelangelo's Piet\u00E0 sculpture",
        afterAlt: "Raffy Lerma's Piet\u00E0-like photograph, Philippine Daily Inquirer front page, 2016",
        caption: "The glaring similarities of Raffy Lerma's photograph to Michelangelo's Piet\u00E0 has caught the public's attention.",
      },
      {
        type: 'point',
        text: "Nonetheless, Manila slums' Piet\u00E0 personified the cost of the drug war in the Philippines\u2014thus, raising the debate over the rise of extrajudicial killings and impunity while President Duterte's allies shrugged the issue by labeling it as a Yellow media-driven propaganda and deemed the killings as a \"necessary\" step to ensure safety and security.",
      },
      {
        type: 'image',
        src: '/reuters.webp',
        alt: "Protesters and residents holding lighted candles and placards at the wake of Kian Loyd delos Santos, a 17-year-old student killed in Duterte's drug war. Photo by Dondi Tawatao, 2017, Reuters.",
        caption: 'Protesters and residents hold lighted candles and placards at the wake of Kian Loyd delos Santos, a 17-year-old high school student, who was among the thousands killed by President Duterte\'s war on drugs. \u00A9 2017 Dondi Tawatao / Reuters',
        
      },
      {
        type: 'point',
        text: "For human rights advocates, time is of the essence so they must gather all the support they need to counter the popularity or momentum of the drug war and the continuing impunity in the country. Manila slums' Piet\u00E0 adds to their ammunition as it helped the international news outlets depict and narrate the bloody drug war to the rest of the world\u2014thus, prompting other nations to act and condemn President Duterte's controversial methods and paradigm shift.",
      },
      {
        type: 'point',
        text: "Manila slums' Piet\u00E0 is speaking to us by telling the hypocrisy of a Catholic-dominated country blindly supporting President Duterte's drug war where it goes against the Church's teaching of valuing human life by the \"Thou Shall Not Kill\" commandment.",
      },
      {
        type: 'quote',
        line1: 'Thou Shall Not Kill',
        line2: "— the Church's teaching of valuing human life",
      },
      {
        type: 'point',
        text: "Michelangelo's Piet\u00E0 enriches the discourse and message of Manila slums' own version of it by asking the re-evaluation of our moral values and who we really are as a nation. The moral decay of blatantly disregarding human life is damaging our institutions and foundations as a rights-respecting nation at an alarming rate. For instance, the attack and intimidation of institutions like the Commission on Human Rights (CHR) of the Philippines.",
      },
      {
        type: 'point',
        text: "Indeed, Manila slums' Piet\u00E0 helped raise the discourse and media texts like these should be explored even more to understand why most Filipinos voted for President Duterte's brand of \"change\" and dig deeper to the WHYs of the populist revolt against elite democracy.",
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
        src: '/cedric-photo-400.png',
        srcWebp: '/cedric-photo-400.webp',
        alt: 'Writing image',
        caption: '28 12 2025',
        width: 400,
        height: 400,
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
  [DISBURSEMENTS_CASE_STUDY_SLUG]: {
    title: 'Enterprise disbursements \u2014 Redesigning enterprise money movement',
    date: '2021\u20132023',
    blocks: [
      {
        type: 'point',
        label: 'TL;DR',
        text: "As Senior Product Designer at a Philippine payment gateway fintech (2021\u20132023), I redesigned the enterprise disbursement feature to address critical user pain points while navigating technical constraints from banking APIs and compliance requirements. Adoption had stalled at 9% with only 12 of 133 onboarded merchants transacting. I led end-to-end design for self-service payout scheduling, simplified disbursement flows, transparent status communication, bulk CSV uploads with pre-submit validation, saved recipients, and recovery-oriented error handling\u2014trading \u201Cinstant\u201D promises for transparency. The work transformed disbursements from a manual, ops-heavy process to a scalable self-service product and positioned the company to compete with Xendit and Paynamics in the enterprise disbursement market.",
      },
      {
        type: 'point',
        label: 'Context \u2014 A payment gateway & the disbursement opportunity',
        text: "The company was a fintech platform enabling Philippine businesses to accept online payments and move money. While payment acceptance was our core product, disbursements represented a critical gap for enterprise customers who needed to pay out funds to suppliers, employees, and partners.\n\nPhilippine enterprises were relying on manual bank transfers\u2014spreadsheets, multiple bank logins, and hours of reconciliation. Competitors like Xendit and Paynamics already offered disbursement products with external funding, real-time transfers, scheduled disbursements, and proof of deposit\u2014features we lacked. Our target segments included traditional enterprises, startups, and medium-to-large online sellers with high-volume payment needs, where 85% of disbursements were for operational expenses and supplier payments.",
      },
      {
        type: 'point',
        label: 'The strategic opportunity',
        text: "The company\u2019s growth strategy identified disbursements as critical for capturing high-value enterprise customers. The cash-out market was highly concentrated\u2014once we became a merchant\u2019s sole provider for disbursements, we could capture significantly higher TPV compared to fragmented payment acceptance.\n\nTwo core use cases anchored the roadmap. Internal payouts covered payroll and gig-economy payments\u2014companies like Mober and Entrego paying riders, plus SMBs needing payroll solutions. External marketplace splits enabled platforms like ShopSM, Edamama, and Stance to pay sub-merchants and suppliers. The strategic bet: by offering easier payroll for smaller merchants and tapping emerging marketplaces onboarding their own merchants, we could build durable competitive moats through high switching costs.\n\nStrategic blockers included Finance team manpower required for manual reconciliation (short-term) and the need for an Electronic Money Issuer (EMI) license for advanced features like real-time transfers and bank deposit confirmation via API (long-term).",
      },
      {
        type: 'point',
        label: 'The challenge \u2014 low adoption & feature gaps',
        text: "When I joined the project, the disbursement feature had launched but was severely underperforming. In the April\u2013June 2022 review period, only 12 of 133 onboarded merchants had transacted\u2014a 9.02% adoption rate\u2014with 32 total transactions and \u20B1163.9K in TPV (average ticket size of \u20B15,122).\n\nThrough user research and customer support analysis, we identified six critical friction points: merchants confused \u201Cpayout schedule\u201D (when the platform settled to them) with \u201Cdisbursement schedule\u201D (when they can push funds out); there was no self-service control over payout timing\u2014every change required contacting support; batch-based processing left users uncertain about when funds would arrive; there was no external funding capability; compliance-grade receipts were missing; and when disbursements failed, users had no clear path to diagnose or fix issues.\n\nOur competitor analysis confirmed we were missing table-stakes features. Xendit and Paynamics offered external funding, real-time transfers, scheduled disbursements, and user management\u2014all critical for enterprise adoption.",
      },
      {
        type: 'point',
        label: 'Technical constraints \u2014 designing within API limitations',
        text: "The biggest challenge wasn\u2019t just user needs\u2014it was what our banking APIs and infrastructure could actually support. Every design decision involved trade-offs between user expectations and technical reality.\n\nAsynchronous processing: Our banking partner\u2019s API couldn\u2019t provide real-time status updates. Once submitted, disbursements were \u201Cqueued\u201D and processed in batches every few hours. I designed a status system that set accurate expectations\u2014clear states (Processing, In Transit, Completed) with estimated completion times and email/SMS notifications at each stage.\n\nBatch processing limitations: The API could only process a certain number of disbursements per batch with rate limits. I implemented a bulk upload feature with clear CSV templates and pre-submission validation\u2014errors flagged before submission, not after batch processing started.\n\nLimited pre-submission validation: We couldn\u2019t validate recipient bank account details before submission, meaning disbursements could fail hours later. I introduced saved recipients with verification workflows\u2014accounts checked when saved, not when disbursed\u2014reducing post-submission failures.\n\nRisk & compliance requirements: Not all merchants could use faster payout schedules. I designed a gated system where Risk Ops configured merchant eligibility via Retool, and the dashboard dynamically showed only eligible payout options\u2014balancing security with user autonomy.",
      },
      {
        type: 'imageCompare',
        beforeSrc: '/disbursement-case-before.svg',
        afterSrc: '/disbursement-case-after.svg',
        beforeAlt:
          'Illustrative wireframe: vague pending state, conflated payout vs send-money language, and dependence on support',
        afterAlt:
          'Illustrative wireframe: separated settlement vs outbound language, named batch lifecycle with ETA, and visible cadence options when eligible',
        caption:
          'Before / after: from opaque pending states and support-heavy changes to explicit lifecycle language and self-service where policy allowed. Illustrative wireframes\u2014not production screenshots.',
      },
      {
        type: 'quote',
        line1: 'Transparency beats false promises.',
        line2: 'Shift errors left; make risk guardrails invisible to eligible merchants.',
      },
      {
        type: 'point',
        label: 'My role & approach',
        text: "As the lead Product Designer for Disbursements, I owned the end-to-end design process\u2014from research to final implementation. My work spanned user research (onboarding studies with 93 merchants), cross-functional collaboration with Risk Ops, Engineering, Finance, and PMM, interaction design for self-service scheduling, bulk upload flows, error states, and status communication, design system contributions (reusable status indicators, modals, error patterns), and developer handoff with detailed specs, edge case documentation, and interactive prototypes.\n\nMy design philosophy centered on transparency over false promises. Rather than hiding technical limitations, I designed for honesty. If we couldn\u2019t offer real-time transfers, I communicated that clearly. If batch processing took hours, I set expectations with timelines and notifications. This approach built trust and reduced support burden\u2014users knew what to expect, even if the answer wasn\u2019t instant.",
      },
      {
        type: 'point',
        label: 'Key design decisions',
        text: "1. Self-service payout schedule \u2014 Enabled merchants to change their payout frequency (monthly \u2192 bi-weekly \u2192 on-demand) without contacting support. Automated eligibility checks based on transaction history and KYC status reduced operational overhead. High-risk merchants stayed on monthly payouts until meeting thresholds; the UI surfaced only eligible options, preventing confusion.\n\n2. Transparent status communication \u2014 Designed a multi-state system (Processing, In Transit, Completed, Failed) with estimated timelines. Balanced detail with simplicity: too much technical info would confuse users, too little wouldn\u2019t give confidence. Settled on user-friendly states with proactive email/SMS notifications at each stage.\n\n3. Bulk upload with pre-validation \u2014 Created a CSV upload flow that validated file format, account numbers, and amounts before submission. Added upfront friction (strict templates) but prevented catastrophic batch failures. Clear error messages (\u201CRow 12: Invalid account number\u201D) let users fix issues before submitting.\n\n4. Saved recipients for recurring disbursements \u2014 85% of disbursements were recurring (same suppliers, same employees). Saved recipients required upfront verification but eliminated re-entry errors, sped up recurring flows, and created a validation layer compensating for API limitations.\n\n5. Error handling & recovery paths \u2014 Designed detailed error states with actionable recovery steps (\u201CDisbursement failed: Invalid account number. Edit and retry?\u201D). Mapped error codes to plain-language explanations with clear CTAs\u2014precise enough to guide users, not so technical as to overwhelm them.",
      },
      {
        type: 'point',
        label: 'Interactive prototype',
        text: 'Below is a placeholder for a React-based interactive walkthrough of the disbursement redesign\u2014covering the status model, self-service scheduling, CSV validation, and error recovery patterns.',
      },
      { type: 'disbursementsPrototype' },
      {
        type: 'point',
        label: 'Outcomes & business impact',
        text: "93 merchants onboarded within the first quarter post-redesign (up from 12 active users at 9% adoption). \u20B1163.9K in TPV processed across 32 transactions, with an average ticket size of \u20B15,122. Reduced support tickets for disbursement-related inquiries\u2014self-service payout scheduling eliminated the manual ops bottleneck. Positioned for competitive parity by addressing feature gaps that put us on par with Xendit and Paynamics.\n\nOperationally, Finance and Risk Ops teams no longer had to manually process payout schedule changes or troubleshoot failed disbursements. The self-service model scaled without headcount growth. The design patterns I created\u2014status communication, error handling, validation flows\u2014became reusable components across the company\u2019s product suite, accelerating future feature development.\n\nBy 2023, the product strategy shifted to focus on high-margin products like disbursements (vs. low-margin payment acceptance). My work laid the foundation for future monetization through Treasury APIs, premium on-demand transfers, and proof of deposit features\u2014positioning the company as a serious competitor in the enterprise disbursement market.",
      },
      {
        type: 'point',
        label: 'Lessons learned',
        text: "1. Transparency beats false promises \u2014 Users would rather know the truth about processing times than be promised instant results that don\u2019t materialize. Setting accurate expectations built trust and reduced support burden.\n\n2. Shift errors left \u2014 Pre-submission validation (file format checks, saved recipient verification) prevented catastrophic failures downstream. Better to add friction upfront than deal with errors after hours of batch processing.\n\n3. Self-service at scale requires guardrails \u2014 Risk requirements demanded merchant segmentation. The key was making guardrails invisible to eligible users while protecting the business from fraud.\n\n4. API limitations are design constraints, not excuses \u2014 Asynchronous processing, batch limits, and validation gaps weren\u2019t reasons to ship a bad product\u2014they were constraints that required creative design solutions. The best products work within reality, not against it.\n\n5. Cross-functional collaboration is non-negotiable \u2014 Every design decision involved trade-offs between user needs, technical feasibility, risk requirements, and business goals. Success required constant alignment with Engineering, Risk Ops, Finance, and PMM\u2014not shipping designs in isolation.",
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

/** Display order on `/writing`. Every slug must exist on `WRITINGS`. */
export const WRITING_INDEX_SLUGS: readonly (keyof typeof WRITINGS)[] = [
  DISBURSEMENTS_CASE_STUDY_SLUG,
  'tracing-the-roots-of-graffiti-in-the-philippines',
  'the-intertextuality-of-manila-slums-pieta',
  'the-intertextuality-of-manila-slums',
  'hello-world',
]

export function WritingIndexPage() {
  return (
    <article className="inner-page">
      <a href="/" className="inner-page-back">
        &larr; Back
      </a>
      <header className="inner-page-header">
        <h1 className="inner-page-title">Writing</h1>
        <p className="inner-page-date writing-index-lede">Essays and case studies</p>
      </header>
      <ul className="writing-index-list">
        {WRITING_INDEX_SLUGS.map((slug) => {
          const entry = WRITINGS[slug]
          if (!entry) return null
          return (
            <li key={slug} className="writing-index-item">
              <a className="writing-index-link" href={`/writing/${slug}`}>
                {entry.title}
              </a>
              {entry.date ? (
                <span className="writing-index-meta">{entry.date}</span>
              ) : null}
            </li>
          )
        })}
      </ul>
    </article>
  )
}

function getWritingSlug(): string {
  if (globalThis.window === undefined) return ''
  const match = /^\/writing\/([^/]+)\/?$/.exec(globalThis.window.location.pathname)
  return match ? match[1] : ''
}

/**
 * Writing page using the InnerPage template.
 * Renders content based on the URL slug.
 */
export function WritingPage() {
  const rawSlug = getWritingSlug()
  const slug = normalizeWritingSlug(rawSlug)

  useLayoutEffect(() => {
    if (globalThis.window === undefined) return
    if (rawSlug !== LEGACY_DISBURSEMENTS_WRITING_SLUG) return
    const { search, hash } = globalThis.window.location
    globalThis.window.history.replaceState(
      null,
      '',
      `/writing/${DISBURSEMENTS_CASE_STUDY_SLUG}${search}${hash}`,
    )
  }, [rawSlug])

  if (slug === DISBURSEMENTS_CASE_STUDY_SLUG) {
    return (
      <Suspense
        fallback={
          <p className="inner-page-block" role="status">
            Loading case study&hellip;
          </p>
        }
      >
        <DisbursementsCaseStudy />
      </Suspense>
    )
  }

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

  if (slug === 'tracing-the-roots-of-graffiti-in-the-philippines') {
    return (
      <EditorialWritingLayout
        title={writing.title}
        date={writing.date}
        backHref="/"
        blocks={writing.blocks}
      />
    )
  }

  if (slug === 'the-intertextuality-of-manila-slums-pieta') {
    return (
      <EditorialWritingLayout
        title={writing.title}
        date={writing.date}
        backHref="/"
        blocks={writing.blocks}
      />
    )
  }

  return <InnerPage title={writing.title} date={writing.date} backHref="/" blocks={writing.blocks} />
}
