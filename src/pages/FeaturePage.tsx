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
        text: 'I spoke at the largest UX conference in Asia about my experience in co-creating with AI, alongside speakers from Google, Canva, and other leading companies in the field.',
      },
      {
        type: 'carousel',
        slides: [
          { src: '/ux-plus-2025-2.png', alt: 'Wrap-up slide: Adapt using First Principles, Co-create with AI guided by human judgment, AI safety is a shared duty' },
          { src: '/ux-plus-2025-3.png', alt: 'AI Sandbox concept: Play, Design, Build' },
          { src: '/ux-plus-2025-4.png', alt: '3 big lessons from co-creating with AI: Sharpen AI fluency, principles, Human-centered Design as differentiator' },
          { src: '/ux-plus-2025-5.png', alt: 'First Principles Thinking diagram: Problem, Relationships and dynamics, Future state' },
        ],
      },
      {
        type: 'point',
        label: 'Video highlights',
        text: '',
      },
      {
        type: 'embed',
        src: 'https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Froundhouseph%2Fvideos%2F2613557655658419%2F&show_text=false&width=560&t=0',
        width: 560,
        height: 314,
        title: 'Facebook video: UX+ 2025',
      },
    ],
  },
  'tedx-digital-services-cambridge-ltd': {
    title: 'TEDxDigitalServicesCambridgeLtd',
    date: '',
    blocks: [
      {
        type: 'point',
        text: 'In 2021, I gave a TEDx talk at Cambridge University Press and Assessment exploring the intersection of UX and Agile, where I highlighted:',
      },
      {
        type: 'point',
        label: 'How can we maximize UX in an agile setting?',
        text: `I hear the word 'agile' being hastily thrown out here and there as if it is a magic wand that can magically solve our users' problems and make us a successful organization at the end of the day.

Similar thing with UX or design being used to make things "pretty." When UX designers are seen as magical creatures that can magically make designs look "pretty."

The relationship between the Agile and UX is complicated especially in its application, plus there are not enough conversations about the relationship between the two and how they can successfully work together.`,
      },
      {
        type: 'point',
        label: '"Factory" Mentality',
        text: `As I have observed the practice of Agile, there is that tendency to use it not for learning, not for agility, but just for efficient delivery of code. It is against Agile when we prioritize delivery without investing in real learning. Delivering more codes does not equate to having more value.

Users will not care how many features we release. They will care if these features will make their lives easier. We are in the business of improving lives, and not about contributing to clutter or waste.

Thus, we must avoid the "factory" mentality as if we need to type code and produce design minute-by-minute as if we are machines devoid of creativity and empathy.

On creativity, I remember the famous TED talk by the late Sir Ken Robinson on how schools kill creativity. He argues that in schools, children are not prepared to be wrong, and the corporate mentality continues to stigmatize mistakes—that we are only developing people out of their creative capacities.

We can not innovate if we are not prepared to be wrong. If being wrong is part of learning, then removing learning from our "Agile" removes our ability to innovate.

We may be completing those X amounts of tickets per sprint but where is the value?

Are we helping users to protect their data? Are we making products and services accessible to persons with disabilities? Are we excluding people in our solutions? Are we aware of our biases that can be embedded in our work that can enhance things like inequality?

I wonder if these ethical and moral questions are being tackled in 2-week sprints — or we just preoccupied like in a factory on how we could meet deadlines? Or are we just doing busywork? Or are we just comfortable living in our bubble and privilege?`,
      },
      {
        type: 'point',
        label: 'So, does Agile harm UX?',
        text: `Agile harms UX if we are not going to change the "by the book Agile." It will not fit well with UX and other disciplines especially when Agile principles are translated into practices by developers for developers alone. This is why UX is having a hard time embedding itself in Agile.

If we want to embrace cross-functional teams, our "Agile" should be diverse and inclusive enough to get people with a diverse set of skills to work together for a common goal.

Consider these 5 ways to maximize UX in an Agile setting:`,
      },
      {
        type: 'point',
        label: '1. Revisit metrics of success',
        text: `Start by avoiding vanity metrics. Those that only make us feel better but that does not add real value to the organization and our users. Align your metrics to your goals as a team and organization. Pay attention from input to impact, not output alone. If you are "customer-first," then the metrics and overall measurement should show that.`,
      },
      {
        type: 'point',
        label: '2. Decided based on facts',
        text: `Nothing beats being data-driven or evidence-based. Allow UX designers to do their UX activities to uncover how they could best create delightful experiences. Allow things like user research to better understand your users so you can create informed decisions.`,
      },
      {
        type: 'point',
        label: '3. Best ideas win',
        text: `It is not about your title or the HIPPOs in the room. Foster a safe environment that produces the best ideas, and not about who is the loudest. Normalize doing things like discovery sprints, Design Sprints, Dual-track Agile, and other things you can experiment on, to uncover the best ideas.`,
      },
      {
        type: 'point',
        label: '4. Show your work',
        text: `Whether it is on a piece of paper, in a large room, or even at your desk. Get early feedback consistently so you know where you are right and wrong. Transparency builds trust while looking at a common goal to finish, together. Do not work in isolation.`,
      },
      {
        type: 'point',
        label: '5. Make learning a priority',
        text: `Have that beginner and growth mindset. And when you learn, make sure you share it with others, so everybody learns more. Everybody wins. UX and Agile are not about silo but about deep collaboration so that we can also foster meaningful relationships. Remember that successful teams are the ones who work together.`,
      },
      {
        type: 'point',
        text: `— Cedric`,
      },
    ],
  },
}

function getFeatureSlug(): string {
  if (globalThis.window === undefined) return ''
  const match = /^\/feature\/(.+)$/.exec(globalThis.window.location.pathname)
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
