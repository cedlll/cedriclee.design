# Web Performance Checklist

A comprehensive checklist to ensure you're building fast, performant websites, organized by development phase.

---

# 🔨 DEVELOPMENT PHASE

## Code Architecture & Structure

### JavaScript & Code Organization
- [ ] Minimize use of heavy libraries
- [ ] Implement code splitting for JavaScript bundles
- [ ] Implement route-based code splitting (for SPAs)
- [ ] Remove unused CSS and JavaScript (tree-shaking)
- [ ] Avoid long tasks (>50ms on main thread)
- [ ] Use web workers for heavy computations
- [ ] Debounce/throttle scroll and resize handlers
- [ ] Use requestAnimationFrame for animations
- [ ] Break up long tasks
- [ ] Optimize event handlers

### HTML & DOM Structure
- [ ] Minimize DOM size and depth
- [ ] Use semantic HTML (faster to parse)
- [ ] Set explicit width/height on images and videos
- [ ] Reserve space for ads and embeds
- [ ] Avoid inserting content above existing content
- [ ] Place scripts at end of body (or use defer/async)

### CSS Best Practices
- [ ] Reduce CSS file size and complexity
- [ ] Eliminate unused critical CSS
- [ ] Avoid @import in CSS files
- [ ] Use CSS containment where applicable
- [ ] Optimize animations (use transform and opacity)
- [ ] Use will-change sparingly for animations
- [ ] Use transform for animations instead of layout properties

### Rendering Optimization
- [ ] Batch DOM reads and writes
- [ ] Avoid forced synchronous layouts
- [ ] Avoid layout thrashing
- [ ] Implement virtual scrolling for long lists
- [ ] Minimize render-blocking resources

### Memory Management
- [ ] Remove event listeners when no longer needed
- [ ] Clear intervals and timeouts
- [ ] Avoid memory leaks (closures, detached DOM)
- [ ] Implement proper cleanup in SPAs
- [ ] Monitor heap size growth
- [ ] Use WeakMap/WeakSet for cache-like structures
- [ ] Avoid creating unnecessary closures
- [ ] Clear large data structures when no longer needed

### Advanced JavaScript Patterns
- [ ] Use generator functions for progressive rendering
- [ ] Implement async iteration for large datasets
- [ ] Use requestIdleCallback for non-urgent tasks
- [ ] Implement progressive enhancement patterns
- [ ] Use IntersectionObserver for lazy loading
- [ ] Use MutationObserver efficiently (disconnect when done)
- [ ] Implement Web Workers for CPU-intensive tasks
- [ ] Use SharedArrayBuffer for multi-threaded performance (when appropriate)
- [ ] Implement service worker caching strategies
- [ ] Use IndexedDB for client-side storage of large data
- [ ] Avoid blocking the main thread with synchronous operations

### Loading Strategy
- [ ] Load critical CSS inline, defer non-critical CSS
- [ ] Use async or defer for non-critical JavaScript
- [ ] Lazy load images below the fold
- [ ] Preload critical resources (fonts, hero images)
- [ ] Prefetch resources for next navigation
- [ ] Preconnect to required third-party origins
- [ ] Use resource hints strategically

### Images & Media
- [ ] Optimize images (compress, use appropriate formats)
- [ ] Use modern image formats (WebP, AVIF) with fallbacks
- [ ] Serve responsive images (srcset, sizes attributes)
- [ ] Optimize and compress LCP element (image/text)
- [ ] Use preload for LCP image
- [ ] Implement art direction with `<picture>` element
- [ ] Use image CDNs with automatic optimization (Cloudinary, Imgix)
- [ ] Implement blur-up or LQIP (Low Quality Image Placeholder) techniques
- [ ] Optimize responsive background images with image-set()
- [ ] Use aspect-ratio CSS to prevent layout shifts
- [ ] Implement progressive JPEG for large images
- [ ] Consider WebP animation instead of GIF
- [ ] Use SVG for icons and simple graphics (optimize with SVGO)
- [ ] Implement image decoding attribute (async/sync/auto)

### Video Optimization
- [ ] Implement adaptive bitrate streaming (HLS/DASH)
- [ ] Compress videos appropriately (H.264/H.265/VP9/AV1)
- [ ] Use poster images for videos
- [ ] Lazy load videos below the fold
- [ ] Implement video preload strategies (none/metadata/auto)
- [ ] Provide multiple video formats for browser support
- [ ] Use video CDNs for large-scale delivery
- [ ] Implement video facades for embeds (YouTube, Vimeo)
- [ ] Mute and autoplay strategically (mobile considerations)

### Fonts
- [ ] Optimize web fonts (font-display: swap, subset fonts)
- [ ] Preload fonts to avoid FOIT/FOUT

### Third-Party Scripts
- [ ] Minimize third-party scripts
- [ ] Evaluate necessity of each third-party script
- [ ] Use facade patterns for heavy embeds (social media, maps)
- [ ] Defer analytics and non-critical third-party scripts
- [ ] Implement consent management efficiently
- [ ] Use script tags with async/defer appropriately
- [ ] Monitor third-party script performance impact
- [ ] Implement fallbacks for third-party failures
- [ ] Use Partytown for offloading to web workers (if applicable)

### Framework-Specific Optimizations

**React**
- [ ] Use React.memo for expensive components
- [ ] Implement useMemo for expensive calculations
- [ ] Implement useCallback for stable function references
- [ ] Use proper key props in lists
- [ ] Implement code splitting with React.lazy and Suspense
- [ ] Avoid inline function definitions in JSX
- [ ] Use production builds
- [ ] Implement virtualization for long lists (react-window)
- [ ] Profile with React DevTools Profiler
- [ ] Avoid unnecessary re-renders (check render count)

**Vue**
- [ ] Use v-once for static content
- [ ] Implement v-memo for conditional memoization
- [ ] Use functional components where appropriate
- [ ] Optimize computed properties vs methods
- [ ] Use shallowRef/shallowReactive for large data
- [ ] Implement async components
- [ ] Avoid reactivity on large datasets unnecessarily
- [ ] Use keep-alive for component caching

**Angular**
- [ ] Use OnPush change detection strategy
- [ ] Implement trackBy functions in *ngFor
- [ ] Unsubscribe from observables properly
- [ ] Use pure pipes
- [ ] Lazy load modules
- [ ] Avoid function calls in templates
- [ ] Use ChangeDetectorRef.detach() for manual control
- [ ] Implement virtual scrolling (CDK)

**General Framework**
- [ ] Hydration optimization (avoid hydration mismatches)
- [ ] Implement partial hydration strategies
- [ ] Use server components where applicable
- [ ] Optimize state management patterns

### API & Data
- [ ] Use GraphQL or optimized REST endpoints
- [ ] Paginate large data sets
- [ ] Implement request deduplication
- [ ] Cache API responses where appropriate
- [ ] Implement cursor-based pagination for large datasets
- [ ] Use field selection/projection to return only needed data
- [ ] Implement ETag headers for conditional requests
- [ ] Use HTTP/2 Server Push strategically
- [ ] Implement request batching where applicable
- [ ] Use WebSockets for real-time data (avoid polling)
- [ ] Implement optimistic UI updates
- [ ] Use data prefetching based on user behavior
- [ ] Compress API payloads (JSON compression)

### Backend & Database Performance
- [ ] Optimize database queries (avoid N+1 problems)
- [ ] Implement proper database indexing
- [ ] Use database query caching
- [ ] Implement connection pooling
- [ ] Optimize ORM queries (avoid eager loading everything)
- [ ] Use read replicas for scaling reads
- [ ] Implement database query logging and monitoring
- [ ] Use materialized views for complex queries
- [ ] Batch database operations where possible
- [ ] Implement rate limiting to prevent abuse
- [ ] Use background jobs for heavy processing
- [ ] Optimize session storage (Redis, Memcached)

## Development Tools & Testing

### Local Testing
- [ ] Monitor memory usage in DevTools
- [ ] Monitor and optimize bundle size
- [ ] Analyze bundle size regularly
- [ ] Use Lighthouse for audits
- [ ] Test with WebPageTest
- [ ] Set performance budgets

### Mobile & Device Testing
- [ ] Test on real mobile devices
- [ ] Optimize for 3G/4G networks
- [ ] Reduce initial payload for mobile
- [ ] Use responsive images
- [ ] Implement touch-friendly interactions
- [ ] Test on low-end devices
- [ ] Avoid mobile-specific performance pitfalls

### Accessibility Testing
- [ ] Ensure keyboard navigation doesn't lag
- [ ] Test with screen readers
- [ ] Maintain performance with accessibility features enabled

### Build Configuration
- [ ] Configure production builds properly
- [ ] Enable source maps for production debugging
- [ ] Remove console.log and debugging code
- [ ] Use environment variables appropriately

### Build Tool Optimizations

**Webpack**
- [ ] Configure proper chunk splitting strategy
- [ ] Use SplitChunksPlugin for vendor separation
- [ ] Implement DllPlugin for rarely changing dependencies
- [ ] Configure terser for optimal minification
- [ ] Use PurgeCSSPlugin to remove unused styles
- [ ] Enable scope hoisting (ModuleConcatenationPlugin)
- [ ] Optimize bundle analysis with webpack-bundle-analyzer

**Vite**
- [ ] Configure rollup options for production
- [ ] Optimize chunk size warnings
- [ ] Use manual chunks for better splitting
- [ ] Enable CSS code splitting
- [ ] Configure build target appropriately

**General Build**
- [ ] Implement proper tree-shaking configuration
- [ ] Configure module resolution correctly
- [ ] Use production mode builds
- [ ] Implement differential serving (modern vs legacy bundles)
- [ ] Configure polyfill strategy (avoid unnecessary polyfills)
- [ ] Use ES modules where possible
- [ ] Implement module federation (for micro-frontends)

## Advanced Development Patterns

### Modern Web Platform APIs
- [ ] Use content-visibility CSS for off-screen content
- [ ] Implement Priority Hints (fetchpriority attribute)
- [ ] Use View Transitions API for smooth navigations
- [ ] Implement Navigation API for SPA routing
- [ ] Use Container Queries for responsive components
- [ ] Implement CSS @layer for cascade optimization
- [ ] Use :has() selector efficiently (where supported)
- [ ] Implement resource hints (dns-prefetch, preconnect, prefetch, prerender)
- [ ] Use Early Hints (HTTP 103) for critical resources

### Server-Side & Rendering Strategies
- [ ] Implement server-side rendering (SSR) or static generation (SSG)
- [ ] Implement incremental static regeneration (ISR)
- [ ] Use streaming SSR where applicable
- [ ] Implement critical CSS extraction
- [ ] Implement progressive enhancement
- [ ] Consider AMP for content-heavy pages (optional)
- [ ] Implement partial hydration (islands architecture)
- [ ] Use resumability patterns (Qwik-style)
- [ ] Implement selective hydration
- [ ] Use edge-side rendering (ESR) where appropriate

---

# 🚀 PRODUCTION/DEPLOYMENT PHASE

## Server & Infrastructure Configuration

### HTTP & Network
- [ ] Use HTTP/2 or HTTP/3
- [ ] Enable keep-alive connections
- [ ] Implement proper CORS headers
- [ ] Reduce DNS lookups
- [ ] Minimize redirects
- [ ] Optimize server response time (TTFB)

### Compression & Minification
- [ ] Enable gzip or Brotli compression on server
- [ ] Minify JavaScript and CSS files
- [ ] Use compression for API responses

### Caching Strategy
- [ ] Set appropriate cache headers (Cache-Control)
- [ ] Implement versioning/fingerprinting for static assets
- [ ] Implement efficient caching strategy
- [ ] Implement API response caching

### Advanced Caching Strategies
- [ ] Implement stale-while-revalidate pattern
- [ ] Use stale-if-error for resilience
- [ ] Implement cache warming for critical resources
- [ ] Use multi-tier caching (browser, CDN, server, database)
- [ ] Implement edge caching strategies
- [ ] Use service worker caching with strategies (network-first, cache-first, etc.)
- [ ] Implement background sync for offline actions
- [ ] Use HTTP/2 push cache appropriately
- [ ] Implement cache versioning and invalidation strategies
- [ ] Monitor cache hit rates

### CDN & Distribution
- [ ] Use CDN for static assets
- [ ] Use edge computing/serverless functions

### Service Workers
- [ ] Configure service worker for offline capability (if needed)

### Security & Performance Trade-offs
- [ ] Optimize Content Security Policy (CSP) headers
- [ ] Evaluate Subresource Integrity (SRI) overhead
- [ ] Use HTTPS everywhere (HTTP/2 requires it)
- [ ] Implement proper CORS headers efficiently
- [ ] Balance security headers with performance
- [ ] Use HSTS preloading carefully
- [ ] Optimize certificate chain length

### Geographic & Multi-Region Optimization
- [ ] Implement multi-region deployments
- [ ] Use anycast routing for global DNS
- [ ] Optimize for latency across regions
- [ ] Use regional CDN edges
- [ ] Implement geo-routing for API requests
- [ ] Consider data sovereignty requirements
- [ ] Optimize for users' primary geographic regions
- [ ] Use regional cache warming

## Production Monitoring

### Real User Monitoring
- [ ] Set up performance monitoring (RUM)
- [ ] Monitor Core Web Vitals in production
- [ ] Track performance metrics over time
- [ ] Implement custom performance marks and measures
- [ ] Monitor Long Task API for blocking tasks
- [ ] Track layout shift attribution
- [ ] Implement error tracking for performance issues
- [ ] Monitor resource timing API
- [ ] Track navigation timing
- [ ] Implement user-centric metrics (Time to Interactive, First Input Delay)
- [ ] Monitor JavaScript error rates and correlation with performance
- [ ] Track API response times in production
- [ ] Implement A/B testing for performance optimizations
- [ ] Monitor performance across different user segments
- [ ] Track performance on different devices and networks
- [ ] Monitor memory usage patterns
- [ ] Track time to first byte (TTFB) globally
- [ ] Implement performance regression detection
- [ ] Monitor third-party script impact
- [ ] Track conversion rates vs performance metrics

### Core Web Vitals Targets

**Largest Contentful Paint (LCP)** - Target: <2.5s
- Monitor in production
- Track trends over time

**Interaction to Next Paint (INP)** - Target: <200ms
- Monitor in production
- Track user interactions

**Cumulative Layout Shift (CLS)** - Target: <0.1
- Monitor in production
- Track visual stability

## Ongoing Maintenance

- [ ] Audit third-party scripts quarterly
- [ ] Update dependencies regularly
- [ ] Review and optimize largest pages
- [ ] Monitor performance regression
- [ ] Keep documentation updated
- [ ] Share performance wins with team
- [ ] Conduct regular performance audits
- [ ] Review and update performance budgets
- [ ] Analyze performance trends monthly
- [ ] Update build tool configurations
- [ ] Review caching strategies periodically
- [ ] Audit unused code and dependencies
- [ ] Monitor and optimize largest bundles
- [ ] Review critical rendering path regularly
- [ ] Update browser support and polyfills
- [ ] Conduct competitive performance benchmarking

---

# 🎯 DOMAIN-SPECIFIC OPTIMIZATIONS

## E-commerce Specific
- [ ] Optimize product image loading (prioritize above-fold products)
- [ ] Implement instant search with debouncing
- [ ] Optimize checkout flow performance
- [ ] Lazy load product recommendations
- [ ] Optimize cart operations (local storage + sync)
- [ ] Implement product list virtualization
- [ ] Optimize filtering and sorting operations
- [ ] Preload likely next pages in user journey
- [ ] Optimize payment provider script loading
- [ ] Implement progressive form validation

## Real-Time Applications (Chat, Collaboration)
- [ ] Optimize WebSocket connection management
- [ ] Implement message batching
- [ ] Use operational transformation or CRDT for conflict resolution
- [ ] Implement optimistic updates
- [ ] Optimize presence indicators
- [ ] Implement efficient diffing algorithms
- [ ] Use pagination/virtualization for message history
- [ ] Optimize notification delivery
- [ ] Implement connection recovery strategies
- [ ] Optimize typing indicators

## Media & Gaming
- [ ] Implement asset preloading strategies
- [ ] Use sprite sheets for graphics
- [ ] Optimize texture sizes and formats
- [ ] Implement LOD (Level of Detail) systems
- [ ] Use object pooling to reduce garbage collection
- [ ] Optimize physics calculations
- [ ] Implement frame rate limiting
- [ ] Use OffscreenCanvas for background rendering
- [ ] Optimize audio loading and playback
- [ ] Implement progressive asset loading

## Content-Heavy Sites (News, Blogs)
- [ ] Implement infinite scroll efficiently
- [ ] Optimize typography loading (font subsetting)
- [ ] Implement article preloading based on scroll position
- [ ] Optimize ad loading (lazy load, async)
- [ ] Implement AMP or similar for mobile
- [ ] Optimize social sharing widgets
- [ ] Implement paywall efficiently
- [ ] Optimize comment section loading
- [ ] Use CDN for static content delivery
- [ ] Implement article recommendations efficiently

## Dashboard & Data Visualization
- [ ] Implement data streaming for large datasets
- [ ] Use canvas/WebGL for complex visualizations
- [ ] Implement chart lazy loading
- [ ] Optimize data aggregation on client
- [ ] Use web workers for data processing
- [ ] Implement virtual scrolling for data grids
- [ ] Optimize real-time data updates
- [ ] Implement efficient filtering without re-rendering
- [ ] Use memoization for expensive calculations
- [ ] Implement progressive data loading

---

# 📐 PERFORMANCE BUDGETS & METRICS

## Setting Performance Budgets
- [ ] Define bundle size budgets (JS, CSS)
- [ ] Set LCP budget (<2.5s)
- [ ] Set INP budget (<200ms)
- [ ] Set CLS budget (<0.1)
- [ ] Define image size budgets
- [ ] Set total page weight budget
- [ ] Define request count budget
- [ ] Set time to interactive budget
- [ ] Define custom metric budgets for your app

## Tracking & Enforcement
- [ ] Implement automated bundle size checks in CI/CD
- [ ] Set up performance budget alerts
- [ ] Track budget compliance over time
- [ ] Fail builds that exceed budgets
- [ ] Document budget exceptions
- [ ] Review budgets quarterly
- [ ] Communicate budget violations to team

## Key Metrics to Track
- [ ] Largest Contentful Paint (LCP)
- [ ] Interaction to Next Paint (INP)
- [ ] Cumulative Layout Shift (CLS)
- [ ] First Contentful Paint (FCP)
- [ ] Time to First Byte (TTFB)
- [ ] Speed Index
- [ ] Total Blocking Time (TBT)
- [ ] Time to Interactive (TTI)
- [ ] First Input Delay (FID) - legacy metric
- [ ] Custom business metrics (conversion time, checkout time, etc.)

---

# 🎓 Resources & Tools

## Testing & Audit Tools
- **Lighthouse**: Automated audits for performance, accessibility, SEO
- **WebPageTest**: Detailed performance testing with network simulation
- **Chrome DevTools**: Performance panel, Coverage, Network waterfall
- **Firefox DevTools**: Performance profiling, Network monitor
- **PageSpeed Insights**: Google's performance testing with field data
- **Calibre**: Continuous performance monitoring
- **SpeedCurve**: Performance monitoring and benchmarking
- **DebugBear**: Web performance and Core Web Vitals monitoring
- **Yellow Lab Tools**: Automated quality testing

## Performance Monitoring (RUM)
- **Web Vitals Extension**: Chrome extension for Core Web Vitals
- **Google Search Console**: Core Web Vitals report
- **New Relic**: Application performance monitoring
- **Datadog RUM**: Real user monitoring
- **Sentry Performance**: Error tracking with performance monitoring
- **Dynatrace**: Full-stack monitoring
- **AppDynamics**: Application performance management
- **Cloudflare Web Analytics**: Privacy-focused analytics

## Bundle Analysis
- **webpack-bundle-analyzer**: Visualize webpack bundle composition
- **source-map-explorer**: Analyze bundle size with source maps
- **bundlephobia**: Check npm package sizes
- **Import Cost**: VSCode extension showing import sizes
- **Bundle Buddy**: Understand JavaScript chunk dependencies

## Image Optimization
- **Squoosh**: Image compression and format conversion
- **ImageOptim**: Mac app for image optimization
- **TinyPNG/TinyJPG**: PNG and JPEG compression
- **Cloudinary**: Image CDN with optimization
- **Imgix**: Real-time image processing CDN
- **Sharp**: High-performance Node.js image processing

## Learning Resources
- **web.dev**: Google's web development best practices
- **MDN Performance**: Mozilla's performance documentation
- **HTTP Archive**: Web technology trends and statistics
- **Performance.now()**: Performance-focused conference talks
- **PerfPlanet**: Performance optimization blog aggregator
- **Smashing Magazine**: Web design and development articles

## Key Concepts & Models
- **Core Web Vitals**: LCP, INP, CLS
- **RAIL Model**: Response, Animation, Idle, Load
- **PRPL Pattern**: Push, Render, Pre-cache, Lazy-load
- **Progressive Enhancement**: Build for baseline, enhance for capability
- **Critical Rendering Path**: Understanding browser rendering

## Standards & Specifications
- **W3C Performance APIs**: Navigation Timing, Resource Timing, User Timing
- **Web Performance Working Group**: Latest performance standards
- **Performance Timeline**: Unified interface for performance metrics
- **Server Timing**: Expose server performance metrics

---

**Remember**: Performance is a feature, not an afterthought. Measure, optimize, and iterate continuously!

---

## 💡 Quick Reference: Common Performance Wins

**Easiest wins** (implement first):
1. Enable compression (gzip/Brotli)
2. Optimize and compress images
3. Minify CSS and JavaScript
4. Add proper cache headers
5. Use a CDN

**Medium effort, high impact**:
1. Implement code splitting
2. Lazy load images and components
3. Remove unused code
4. Optimize fonts
5. Reduce third-party scripts

**Advanced optimizations**:
1. Server-side rendering or static generation
2. Implement partial hydration
3. Edge computing for dynamic content
4. Advanced caching strategies
5. Progressive web app features

---

## Site audit: cedriclee.design

_Last updated: April 2026. This section tracks how the portfolio repo maps to the checklist above._

### Build & JavaScript

| Item | Status |
|------|--------|
| Route-based code splitting (`React.lazy` for inner pages, case study, cursor) | Done |
| Vendor chunk split (React, GSAP) in Vite | Done |
| Tree-shaking / production minify (Vite defaults) | Done |
| `DisbursementsInteractive` loaded only via shared `lazy()` + `Suspense` (no static import from `InnerPage`) | Done |
| Disbursements prototype (`DisbPrototypeApp`) lazy inside `DisbursementsCaseStudy` | Done |
| Heavy `src/prototypes/disb` dependencies still live in root `package.json` | Acceptable for now; split workspace or separate Vite entry if the main bundle grows |

### Runtime & interaction

| Item | Status |
|------|--------|
| Passive `scroll` listener + `requestAnimationFrame` coalescing + state updates only when values change | Done |
| Event listener cleanup on work rows / hooks | Done |
| `scrollbar-gutter: stable` (layout shift when scrollbars appear) | Done |

### Fonts & CSS

| Item | Status |
|------|--------|
| `preconnect` to Google Fonts and Fontshare | Done |
| Non-blocking font CSS (`preload` as style + `onload` → stylesheet, `noscript` fallback) | Done |
| `display=swap` on font requests | Done |
| Home work thumbnails: `aspect-ratio` on `.ed-work-media` | Done |

### Images & media

| Item | Status |
|------|--------|
| `loading="lazy"` / `decoding="async"` on article and carousel images | Done |
| Draft writing image: smaller PNG (`cedric-photo-400.png`), intrinsic `width`/`height`, WebP via `<picture>` + `npm run generate-images` | Done |
| Removed unused global `preload` of `cedric-photo-400.png` from `index.html` (was not tied to LCP on most routes) | Done |
| Editorial writing layout embed iframes: explicit `width` / `height` on `<iframe>` | Done |

### Third-party & analytics

| Item | Status |
|------|--------|
| `@vercel/analytics` (lightweight) | In use |
| Social / maps facades | N/A on current pages |

### Production & monitoring (hosting / process)

| Item | Status |
|------|--------|
| Compression (Brotli/gzip), HTTP/2+, CDN, cache headers | Rely on Vercel defaults; confirm in Network panel after deploy |
| Core Web Vitals RUM, Lighthouse in CI, performance budgets | Recommended next step; not wired in this repo yet |
| Quarterly third-party script review | Process |

### Quick commands

- Production build: `npm run build`
- Profile output sizes: inspect `dist/assets/` after build
- Regenerate profile WebP: `npm run generate-images` (writes `public/cedric-photo-400.webp`)
