import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Wavyarnold — Latest from the Studio | Newark Hip-Hop Blog',
  description:
    'Behind the songs, Newark music scene, and updates from Wavyarnold. Hip-hop artists from Newark NJ.',
  keywords: ['newark nj music scene', 'hip hop artists from newark', 'wavyarnold blog', 'newark rap scene 2026'],
  alternates: { canonical: 'https://wavyarnold.com/blog' },
}

const posts = [
  {
    slug: 'behind-the-song-placeholder',
    title: 'Behind the Song: [Track Title]',
    excerpt:
      'The song started with a feeling, not a concept. Here\'s where it actually came from.',
    date: '2026-03-01',
    category: 'Behind the Songs',
  },
  {
    slug: 'newark-music-scene-2026',
    title: 'What the Newark Music Scene Looks Like Right Now',
    excerpt:
      'Newark doesn\'t get enough credit. Here\'s what\'s actually happening in the city.',
    date: '2026-02-15',
    category: 'Newark Music',
  },
  {
    slug: 'building-independently',
    title: 'Building a Music Career in Newark Without Shortcuts',
    excerpt:
      'There\'s no blueprint. This is just what\'s working and what isn\'t.',
    date: '2026-02-01',
    category: 'Updates',
  },
]

const categories = ['Behind the Songs', 'Newark Music', 'Updates']

export default function BlogPage() {
  const [featured, ...rest] = posts

  return (
    <>
      {/* ── Page header ───────────────────────────────────────── */}
      <section className="grain-overlay bg-midnight page-content pt-20 pb-24" aria-labelledby="blog-h1">
        <div className="max-w-screen-xl mx-auto px-6">
          <p className="section-label text-amber mb-4">Writing</p>
          <h1 id="blog-h1" className="display-heading text-cream text-5xl md:text-7xl lg:text-8xl">
            Latest from<br />the Studio
          </h1>
        </div>
      </section>

      {/* ── Featured Post ─────────────────────────────────────── */}
      <section className="bg-cream py-20" aria-labelledby="featured-post-heading">
        <div className="max-w-screen-xl mx-auto px-6">
          <h2 id="featured-post-heading" className="display-heading text-midnight text-3xl md:text-5xl mb-10">
            Featured Post
          </h2>

          <Link href={`/blog/${featured.slug}`} className="group block border border-iron/10 hover:border-iron/30 transition-colors">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="bg-iron aspect-video md:aspect-auto flex items-center justify-center min-h-[280px]">
                <span className="text-cream/10 text-sm uppercase tracking-widest">Image</span>
              </div>
              <div className="p-10 md:p-14 flex flex-col justify-between">
                <div>
                  <p className="section-label text-amber mb-3">{featured.category}</p>
                  <h3 className="display-heading text-midnight text-2xl md:text-3xl mb-4 group-hover:text-amber transition-colors leading-tight">
                    {featured.title}
                  </h3>
                  <p className="text-iron text-sm leading-relaxed">{featured.excerpt}</p>
                </div>
                <div className="mt-8 flex items-center justify-between">
                  <time className="text-iron-light text-xs" dateTime={featured.date}>
                    {new Date(featured.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </time>
                  <span className="text-amber text-xs uppercase tracking-widest">Read →</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ── Recent Posts ──────────────────────────────────────── */}
      <section className="bg-cream-dark py-20" aria-labelledby="recent-posts-heading">
        <div className="max-w-screen-xl mx-auto px-6">
          <h2 id="recent-posts-heading" className="display-heading text-midnight text-3xl md:text-4xl mb-10">
            Recent Posts
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block bg-cream border border-iron/10 hover:border-iron/30 transition-colors"
              >
                <div className="aspect-video bg-iron flex items-center justify-center">
                  <span className="text-cream/10 text-xs uppercase tracking-widest">Image</span>
                </div>
                <div className="p-8">
                  <p className="section-label text-amber mb-2">{post.category}</p>
                  <h3 className="display-heading text-midnight text-lg mb-3 group-hover:text-amber transition-colors leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-iron text-sm leading-relaxed">{post.excerpt}</p>
                  <time className="block text-iron-light text-xs mt-4" dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </time>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Topics ────────────────────────────────────────────── */}
      <section className="bg-midnight py-20 grain-overlay" aria-labelledby="topics-heading">
        <div className="max-w-screen-xl mx-auto px-6">
          <h2 id="topics-heading" className="display-heading text-cream text-3xl md:text-4xl mb-10">
            Topics
          </h2>
          <div className="flex flex-wrap gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                className="btn-outline border-cream text-cream hover:bg-cream hover:text-midnight text-xs"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="bg-amber py-16">
        <div className="max-w-screen-xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="font-display font-bold text-midnight text-xl md:text-2xl">
            New posts, new music. One list.
          </p>
          <Link href="/join" className="btn-primary">Join the List</Link>
        </div>
      </section>
    </>
  )
}
