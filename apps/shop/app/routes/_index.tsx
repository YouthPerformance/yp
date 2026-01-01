import type {LoaderFunctionArgs, MetaFunction} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [
    {title: 'YP Shop | Premium Training Gear'},
    {description: 'Premium training gear for young athletes. NeoBall silent basketball, training equipment, and more.'},
  ];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;

  // Fetch featured products
  const {products} = await storefront.query(FEATURED_PRODUCTS_QUERY);

  return {
    products: products.nodes,
  };
}

export default function Homepage() {
  const {products} = useLoaderData<typeof loader>();

  return (
    <main className="min-h-screen relative z-10">
      {/* Scroll Progress Bar */}
      <div className="scroll-progress" />

      {/* Grid Overlay */}
      <div className="grid-overlay" />

      {/* Hero Section - Layered Images with Blend Effects */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Layered Background Images - Cinematic Stack */}
        <div className="absolute inset-0">
          {/* Layer 1: 4.jpg - Dark base */}
          <img
            src="/images/4.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: 1 }}
          />
          {/* Layer 2: 9.jpg - Lighten blend */}
          <img
            src="/images/9.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover mix-blend-lighten"
            style={{ opacity: 0.8 }}
          />
          {/* Layer 3: 11.png - Screen for glow */}
          <img
            src="/images/11.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover mix-blend-screen"
            style={{ opacity: 0.5 }}
          />
          {/* Layer 4: 13.png - Screen */}
          <img
            src="/images/13.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover mix-blend-screen"
            style={{ opacity: 0.4 }}
          />
          {/* Layer 5: 18.png - Lighten */}
          <img
            src="/images/18.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover mix-blend-lighten"
            style={{ opacity: 0.6 }}
          />
          {/* Layer 6: 14.png - Screen */}
          <img
            src="/images/14.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover mix-blend-screen"
            style={{ opacity: 0.35 }}
          />
          {/* Layer 7: 12.png - Lighten */}
          <img
            src="/images/12.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover mix-blend-lighten"
            style={{ opacity: 0.5 }}
          />
          {/* Layer 8: 6.jpg - Screen highlight */}
          <img
            src="/images/6.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover mix-blend-screen"
            style={{ opacity: 0.3 }}
          />
          {/* Layer 9: 16.png - Top glow */}
          <img
            src="/images/16.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover mix-blend-screen"
            style={{ opacity: 0.25 }}
          />
        </div>

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl" style={{zIndex: 10}}>
          {/* Status Badge */}
          <div className="nav-status justify-center mb-8 animate-slide-up" style={{animationDelay: '0s'}}>
            <div className="nav-dot" />
            <span>Drop 001: Live Now</span>
          </div>

          <h1 className="hero-title mb-6 animate-slide-up" style={{animationDelay: '0.1s'}}>
            <span className="block">LOCK IN.</span>
            <span className="block text-cyan">LEVEL UP.</span>
          </h1>

          <p className="text-xl text-muted mb-8 max-w-2xl mx-auto animate-slide-up" style={{animationDelay: '0.2s'}}>
            High-performance gear built for athletes who train while others sleep.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up" style={{animationDelay: '0.3s'}}>
            <Link to="/products" className="btn-primary">
              SHOP NOW
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <a href="https://neoball.co" className="btn-secondary">
              EXPLORE NEOBALL
            </a>
          </div>

          {/* Trust Badges */}
          <div className="trust-badges justify-center flex-wrap animate-slide-up" style={{animationDelay: '0.4s'}}>
            <span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              90-Day Guarantee
            </span>
            <span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
              </svg>
              Free Shipping
            </span>
            <span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Secure Checkout
            </span>
          </div>
        </div>

        {/* Scroll Hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hero-subtitle animate-float">
          Scroll to explore
        </div>
      </section>

      {/* Featured Products - Premium Cards */}
      <section className="py-24 px-6 scroll-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="hero-subtitle mb-4">Featured Drop</p>
            <h2 className="performance-title text-center">
              GEAR THAT <span className="text-cyan">PERFORMS</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-cards">
            {products.map((product: any, index: number) => (
              <Link
                key={product.id}
                to={`/products/${product.handle}`}
                className="product-card group"
              >
                <div className="product-card__image">
                  {product.featuredImage && (
                    <img
                      src={product.featuredImage.url}
                      alt={product.featuredImage.altText || product.title}
                    />
                  )}
                  {index === 0 && (
                    <div className="product-card__badge">Featured</div>
                  )}
                </div>
                <div className="product-card__info">
                  <p className="product-card__label">YP Gear</p>
                  <h3 className="product-card__name">{product.title}</h3>
                  <p className="product-card__price">
                    ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(0)}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/products" className="btn-secondary">
              View All Products
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* NeoBall Feature Section */}
      <section className="py-24 px-6 bg-surface relative overflow-hidden scroll-fade-in">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan/5 to-transparent" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Product Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-cyan/20 blur-[100px] rounded-full" />
              <div className="relative glass-card p-8">
                <img
                  src="/images/neoball-hero.png"
                  alt="NeoBall Silent Basketball"
                  className="w-full aspect-square object-contain animate-float"
                  onError={(e) => {
                    e.currentTarget.src = 'https://cdn.shopify.com/s/files/1/placeholder.png';
                  }}
                />
                <div className="product-card__badge">Batch 001</div>
              </div>
            </div>

            {/* Product Info */}
            <div>
              <p className="hero-subtitle mb-4">The World's Best</p>
              <h2 className="performance-title mb-2">
                <span className="text-cyan">NEOBALL</span>
              </h2>
              <p className="font-display text-3xl text-dim mb-6">SILENT BASKETBALL</p>

              <p className="text-lg text-muted mb-8 leading-relaxed">
                The world's first regulation-weight silent basketball.
                Train at midnight without waking the neighbors.
                Same protocol used by KD, Kyrie & 47 NBA players.
              </p>

              <div className="flex items-baseline gap-4 mb-8">
                <span className="font-display text-5xl text-white">$168</span>
                <span className="text-xl text-dim line-through">$645 value</span>
              </div>

              <a href="https://neoball.co" className="btn-primary w-full sm:w-auto">
                GET THE D1 BLUEPRINT
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>

              <div className="trust-badges mt-8">
                <span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  90-Day Guarantee
                </span>
                <span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                  </svg>
                  Free Shipping
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* YP Academy CTA */}
      <section className="py-24 px-6 scroll-fade-in">
        <div className="max-w-4xl mx-auto text-center">
          <p className="hero-subtitle mb-4">Complete The System</p>
          <h2 className="performance-title text-center">
            TRAIN WITH <span className="text-neon-green">YP ACADEMY</span>
          </h2>
          <p className="text-xl text-muted mb-8 max-w-2xl mx-auto">
            The gear is just the start. Get the full training system with AskYP AI Coach,
            Training Packs, and The Pack community.
          </p>
          <a
            href="https://app.youthperformance.com"
            className="btn-secondary"
          >
            Explore YP Academy
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-glow bg-wolf-black">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <div className="font-display text-2xl">
              <span className="text-cyan">YP</span> SHOP
            </div>
            <div className="flex gap-6 text-sm text-muted">
              <a href="https://app.youthperformance.com" className="hover:text-white transition-colors">YP Academy</a>
              <a href="https://neoball.co" className="hover:text-white transition-colors">NeoBall</a>
              <a href="mailto:shop@youthperformance.com" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-glow">
            <div className="flex gap-6 text-sm text-dim">
              <Link to="/legal/terms" className="hover:text-cyan transition-colors">Terms</Link>
              <Link to="/legal/privacy" className="hover:text-cyan transition-colors">Privacy</Link>
            </div>
            <div className="text-sm text-dim">
              &copy; {new Date().getFullYear()} Youth Performance
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

const FEATURED_PRODUCTS_QUERY = `#graphql
  query FeaturedProducts {
    products(first: 6, sortKey: BEST_SELLING) {
      nodes {
        id
        title
        handle
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        featuredImage {
          url
          altText
        }
      }
    }
  }
`;
