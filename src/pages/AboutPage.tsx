import './AboutPage.css'

export function AboutPage() {
  return (
    <article className="about-editorial">
      <header className="about-editorial-hero">
        <h1 className="about-editorial-title">About</h1>
      </header>

      <section className="about-editorial-row" aria-labelledby="about-overview-heading">
        <div className="about-editorial-heading-col">
          <h2 id="about-overview-heading" className="about-editorial-section-title">
            Overview
          </h2>
        </div>
        <div className="about-editorial-body">
          <p>
            Product designer who has led three design teams, mentored over a hundred designers, and worked with large
            enterprises and YC-backed startups. I care about legible systems, honest interfaces, and design leadership
            that raises the quality bar without slowing delivery.
          </p>
        </div>
        <figure className="about-editorial-media">
          <div className="about-editorial-media-placeholder" aria-hidden />
        </figure>
      </section>

      <section className="about-editorial-row" aria-labelledby="about-work-heading">
        <div className="about-editorial-heading-col">
          <h2 id="about-work-heading" className="about-editorial-section-title">
            Work
          </h2>
        </div>
        <div className="about-editorial-body">
          <p>
            Recent depth is in fintech and platform tools—making complex money movement understandable and operable at
            scale. A disbursements case study at a payment gateway fintech walks through research, IA, and UI for enterprise schedules,
            batch flows, and async status.
          </p>
          <p>
            <a className="about-editorial-link" href="/writing/enterprise-disbursements-money-movement">
              Read the case study
            </a>
          </p>
        </div>
        <figure className="about-editorial-media">
          <img src="/disbursement-case-after.svg" alt="Disbursements dashboard after redesign (illustrative)" loading="lazy" decoding="async" />
          <figcaption className="about-editorial-caption">Enterprise disbursements — money movement at a payment gateway.</figcaption>
        </figure>
      </section>

      <section className="about-editorial-pullquote" aria-label="Quoted principle">
        <p className="about-editorial-pullquote-source">Dieter Rams, 1976</p>
        <blockquote className="about-editorial-pullquote-quote" cite="https://en.wikipedia.org/wiki/Dieter_Rams">
          <p className="about-editorial-pullquote-text">
            Good design is as little design as possible. Less, but better — because it concentrates on the essential aspects,
            and the products are not burdened with non-essentials.
          </p>
        </blockquote>
      </section>

      <section className="about-editorial-row about-editorial-cta-row" aria-labelledby="about-explore-heading">
        <div className="about-editorial-heading-col">
          <h2 id="about-explore-heading" className="about-editorial-section-title">
            Explore
          </h2>
        </div>
        <div className="about-editorial-body">
          <p>Selected case studies, writing, and talks are on the home page and in Writing.</p>
          <p>
            <a className="about-editorial-link" href="/feature/ux-plus-2025">
              UX+ 2025
            </a>
            {' '}
            — co-creating with AI at Asia&rsquo;s largest UX conference.
          </p>
          <a className="about-editorial-link" href="/">
            Back to work
          </a>
        </div>
        <figure className="about-editorial-media">
          <div className="about-editorial-media-placeholder" aria-hidden />
        </figure>
      </section>
    </article>
  )
}
