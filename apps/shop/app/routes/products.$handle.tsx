import { useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import { Image, Money } from "@shopify/hydrogen";
import type { LoaderFunctionArgs, MetaFunction } from "@shopify/remix-oxygen";
import { useEffect, useRef, useState } from "react";
import type { ProductQuery } from "storefrontapi.generated";

// Extract the variant type from the generated types
type ProductVariant = NonNullable<ProductQuery["product"]>["variants"]["nodes"][number];

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `${data?.product.title || "Product"} | YP Shop` },
    { description: data?.product.description || "" },
  ];
};

export async function loader({ params, context }: LoaderFunctionArgs) {
  const { handle } = params;
  const { storefront } = context;

  if (!handle) {
    throw new Response("Product handle is required", { status: 400 });
  }

  const { product } = await storefront.query(PRODUCT_QUERY, {
    variables: { handle },
  });

  if (!product) {
    throw new Response("Not found", { status: 404 });
  }

  return { product };
}

// FAQ Item Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left group"
      >
        <span className="text-white font-medium pr-4">{question}</span>
        <span
          className={`text-cyan transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
        >
          +
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 pb-5" : "max-h-0"
        }`}
      >
        <p
          className="text-gray-400 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: answer }}
        />
      </div>
    </div>
  );
}

// Audio Visualization Component
function SilenceIndicator() {
  return (
    <div className="flex flex-col items-center gap-3 mt-6 p-5 bg-white/[0.02] border border-white/[0.06] rounded-2xl w-fit mx-auto">
      <div className="flex items-center gap-4">
        {/* Loud bars */}
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-[9px] tracking-widest uppercase text-gray-500">
            Regular
          </span>
          <div className="flex items-center gap-[3px] h-8">
            {[12, 24, 18, 28, 14].map((h, i) => (
              <div
                key={i}
                className="w-[3px] rounded-sm animate-pulse"
                style={{
                  height: h,
                  background: "linear-gradient(to top, #ff4444, #ff8844)",
                  animationDelay: `${i * 0.05}s`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="w-px h-12 bg-white/15" />

        {/* Quiet bars */}
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-[9px] tracking-widest uppercase text-gray-500">
            Neoball
          </span>
          <div className="flex items-center gap-[3px] h-8">
            {[4, 4, 4, 4, 4].map((_, i) => (
              <div key={i} className="w-[3px] h-1 rounded-sm bg-cyan opacity-80" />
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] tracking-widest uppercase text-white/50">
          Noise Level
        </span>
        <span className="font-mono text-sm font-bold text-cyan tracking-wide">35dB</span>
      </div>
    </div>
  );
}

export default function Product() {
  const { product } = useLoaderData<typeof loader>();
  const { title, description, featuredImage, variants, handle } = product;

  // Check if this is the NeoBall product for special styling
  const isNeoBall =
    handle?.toLowerCase().includes("neoball") ||
    handle?.toLowerCase() === "n" ||
    title?.toLowerCase().includes("neoball");

  // Initialize with the first variant
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(variants.nodes[0]);

  // Cart fetcher for add to cart
  const fetcher = useFetcher<{ success?: boolean; errors?: string[] }>();
  const navigate = useNavigate();

  // Sticky bar visibility
  const [showStickyBar, setShowStickyBar] = useState(false);
  const buyBoxRef = useRef<HTMLDivElement>(null);

  // Determine loading and success states
  const isAddingToCart = fetcher.state !== "idle";
  const addToCartSuccess = fetcher.data?.success === true;

  // Show success toast
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (addToCartSuccess) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [addToCartSuccess]);

  // Sticky bar observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBar(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-100px 0px 0px 0px" },
    );

    if (buyBoxRef.current) {
      observer.observe(buyBoxRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Check availability of selected variant
  const isAvailable = selectedVariant?.availableForSale ?? false;

  // FAQ Data for NeoBall
  const faqData = [
    {
      question: "Is it actually silent? (My neighbors hate me)",
      answer:
        "Yes. We use <strong>GhostCore open-cell technology</strong>. It dissipates sound waves as heat rather than noise. It registers at ~35dB (whisper volume) compared to ~85dB for a standard leather ball.",
    },
    {
      question: "Does it feel like a cheap foam toy?",
      answer:
        "No. Cheap foam is light (200g). The Neoball is <strong>Regulation Weight (600g for Size 7)</strong>. It is engineered to mimic the exact energy return of an inflated ball. Your muscle memory will transfer 1:1 to the court.",
    },
    {
      question: "How do I access the Training App?",
      answer:
        "Inside your Founders Box, you will find a <strong>Laser-Etched Black Card</strong>. Scan the QR code on the back to instantly unlock your Lifetime Membership. No monthly fees.",
    },
    {
      question: "What's the difference between Size 6 and Size 7?",
      answer:
        "<strong>Size 7</strong> is the official men's regulation size (29.5\" circumference). <strong>Size 6</strong> is the women's/youth regulation size (28.5\" circumference). Both have the same premium construction and silent technology.",
    },
    {
      question: "Can I use it outside?",
      answer:
        "Yes, but we recommend <strong>indoor use for maximum durability</strong>. The surface is designed for hardwood, tile, and smooth garage floors. Outdoor concrete will wear it faster, but it can handle light outdoor sessions.",
    },
  ];

  return (
    <>
      <main className="min-h-screen pt-20 pb-32">
        {/* Hero Product Section */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Gallery */}
            <div className="relative lg:sticky lg:top-24 lg:self-start">
              <div className="aspect-square bg-panel rounded-2xl border border-white/[0.08] overflow-hidden relative group">
                {featuredImage && (
                  <Image
                    data={featuredImage}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                )}

                {/* Badge */}
                {isNeoBall && (
                  <div className="absolute top-4 left-4 bg-white text-wolf-black font-mono text-[10px] font-bold px-3 py-1.5 rounded tracking-widest uppercase">
                    Founders Edition
                  </div>
                )}

                {/* Out of stock overlay */}
                {!isAvailable && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-xl font-display tracking-wider text-gray-300">
                      SOLD OUT
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              {/* Partner Badge */}
              {isNeoBall && (
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className="bg-cyan text-wolf-black font-mono text-[10px] font-bold px-2 py-1 uppercase rounded">
                    D1 Partner
                  </span>
                  <span className="font-mono text-[11px] text-gray-500 uppercase tracking-widest">
                    James Harden Signature
                  </span>
                </div>
              )}

              {/* Title */}
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-wider mb-2 leading-[0.95]">
                <span className="bg-gradient-to-br from-gray-400 via-white to-gray-400 bg-clip-text text-transparent">
                  {title}
                </span>
              </h1>

              {/* Rating */}
              {isNeoBall && (
                <div className="flex items-center gap-3 mb-6 flex-wrap">
                  <span className="text-yellow-400 text-sm">★★★★★</span>
                  <span className="text-gray-500 text-sm">482 reviews</span>
                  <span className="text-green-400 text-[10px] font-bold bg-green-400/10 px-2 py-1 rounded">
                    VERIFIED
                  </span>
                </div>
              )}

              {/* Tagline */}
              <p className="text-gray-400 text-base mb-6 leading-relaxed">
                {description ||
                  "The world's best silent basketball. GhostCore technology - 98% energy return, 35dB quieter. Play anytime, anywhere."}
              </p>

              {/* Silence Indicator */}
              {isNeoBall && <SilenceIndicator />}

              {/* Variant selector */}
              {variants.nodes.length > 1 && (
                <div className="mt-8 mb-6">
                  <h3 className="font-mono text-[11px] font-bold tracking-widest uppercase text-gray-500 mb-3">
                    {variants.nodes[0]?.selectedOptions?.[0]?.name || "Size"}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {variants.nodes.map((variant: ProductVariant) => {
                      const isSelected = variant.id === selectedVariant.id;
                      const variantAvailable = variant.availableForSale;

                      return (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => setSelectedVariant(variant)}
                          disabled={!variantAvailable}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            isSelected
                              ? "border-white bg-white text-wolf-black"
                              : variantAvailable
                                ? "border-white/10 bg-panel hover:border-white/30 text-white"
                                : "border-white/5 bg-panel/50 text-gray-600 cursor-not-allowed"
                          }`}
                        >
                          <span
                            className={`font-display text-xl ${isSelected ? "text-wolf-black" : ""}`}
                          >
                            {variant.title}
                          </span>
                          {variant.title === "Size 7" && (
                            <span
                              className={`block text-[11px] font-bold mt-1 ${isSelected ? "text-wolf-black/60" : "text-gray-500"}`}
                            >
                              MEN'S REGULATION
                            </span>
                          )}
                          {variant.title === "Size 6" && (
                            <span
                              className={`block text-[11px] font-bold mt-1 ${isSelected ? "text-wolf-black/60" : "text-gray-500"}`}
                            >
                              WOMEN'S / YOUTH
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* D1 Blueprint Buy Box */}
              <div
                ref={buyBoxRef}
                className="relative p-[2px] bg-gradient-to-br from-cyan to-blue-600 rounded-2xl shadow-[0_0_30px_rgba(0,246,224,0.4)] mt-4"
              >
                {/* Badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-wolf-black border border-cyan text-cyan font-mono text-[10px] font-bold px-4 py-1.5 rounded-full tracking-widest uppercase whitespace-nowrap shadow-[0_0_15px_rgba(0,246,224,0.4)] z-10">
                  Founders Edition
                </div>

                <div className="bg-surface/95 backdrop-blur-sm rounded-[14px] p-6 pt-8 border border-cyan/20">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-5 pb-4 border-b border-white/10">
                    <div>
                      <h3 className="font-display text-2xl italic text-cyan">D1 Blueprint</h3>
                      <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">
                        $50 Value Included
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-3xl font-bold text-white">
                        <Money data={selectedVariant.price} />
                      </div>
                      <span className="text-[10px] text-gray-500">was $139.99</span>
                    </div>
                  </div>

                  {/* Stock indicator */}
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="font-mono text-[11px] text-red-400 tracking-wide">
                      Only 47 left
                    </span>
                    <span className="font-mono text-[10px] text-cyan uppercase tracking-widest font-bold ml-auto">
                      Selling Fast
                    </span>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {[
                      {
                        icon: "🏀",
                        title: "Silent GhostCore Ball",
                        desc: "Regulation weight, 35dB quiet",
                      },
                      {
                        icon: "📱",
                        title: "YP Academy Lifetime Access",
                        desc: "D1 training programs included",
                      },
                      {
                        icon: "🎯",
                        title: "10-Day Foundations Program",
                        desc: "Guided handle transformation",
                      },
                    ].map((feature, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <div className="w-9 h-9 bg-white/[0.08] rounded-lg flex items-center justify-center text-sm flex-shrink-0">
                          {feature.icon}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{feature.title}</p>
                          <p className="text-[11px] text-gray-500">{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add to Cart */}
                  <fetcher.Form method="post" action="/cart">
                    <input type="hidden" name="action" value="ADD_TO_CART" />
                    <input type="hidden" name="merchandiseId" value={selectedVariant.id} />
                    <input type="hidden" name="quantity" value="1" />

                    <button
                      type="submit"
                      disabled={!isAvailable || isAddingToCart}
                      className={`w-full py-4 font-display text-xl tracking-wider rounded-xl transition-all ${
                        isAvailable
                          ? "bg-cyan text-wolf-black shadow-[0_0_20px_rgba(0,246,224,0.4)] hover:bg-white hover:scale-[1.02]"
                          : "bg-gray-700 text-gray-400 cursor-not-allowed"
                      } ${isAddingToCart ? "opacity-80" : ""}`}
                    >
                      {isAddingToCart ? "ADDING..." : isAvailable ? "ADD TO CART" : "SOLD OUT"}
                    </button>
                  </fetcher.Form>

                  {/* View Cart after success */}
                  {showSuccess && (
                    <button
                      onClick={() => navigate("/cart")}
                      className="w-full py-3 mt-3 border border-green-500/30 text-green-400 font-bold rounded-xl hover:bg-green-500/10 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      ADDED! VIEW CART
                    </button>
                  )}

                  {/* Error */}
                  {fetcher.data?.errors && fetcher.data.errors.length > 0 && (
                    <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <p className="text-red-400 text-sm">{fetcher.data.errors.join(", ")}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Guarantee Box */}
              {isNeoBall && (
                <div className="mt-4 p-4 bg-panel border border-white/[0.08] rounded-xl text-center">
                  <p className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                    <span className="text-cyan mr-1">✓</span>
                    Foundations 10 Guarantee
                  </p>
                  <p className="text-xs text-gray-400">
                    Complete the program. If your handle isn't tighter,{" "}
                    <strong className="text-white">keep the ball + full refund</strong>.
                  </p>
                </div>
              )}

              {/* Trust chips */}
              {isNeoBall && (
                <div className="flex gap-2 justify-center mt-4 flex-wrap">
                  {["Free Shipping", "30-Day Returns", "Lifetime Warranty"].map((chip) => (
                    <span
                      key={chip}
                      className="font-mono text-[10px] tracking-widest uppercase text-white/70 px-3 py-2 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-sm"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Comparison Section - NeoBall only */}
        {isNeoBall && (
          <section className="py-20 px-6 bg-wolf-black">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-display text-4xl text-center mb-8">TOY VS. TOOL</h2>
              <div className="overflow-hidden rounded-2xl border border-white/[0.08]">
                <table className="w-full border-collapse">
                  <thead className="bg-panel">
                    <tr>
                      <th className="p-4 text-left font-mono text-[11px] font-bold tracking-widest uppercase text-gray-500">
                        Feature
                      </th>
                      <th className="p-4 text-left font-mono text-[11px] font-bold tracking-widest uppercase text-white">
                        Neoball
                      </th>
                      <th className="p-4 text-left font-mono text-[11px] font-bold tracking-widest uppercase text-gray-500">
                        Cheap Foam
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Bounce Height", "98% Return", "Dead / Low"],
                      ["Weight", "Regulation (22oz)", "Light (8oz)"],
                      ["Sound Level", "35 Decibels", "Varies"],
                      ["App Access", "INCLUDED", "None"],
                    ].map(([feature, neo, foam], i) => (
                      <tr key={i} className="border-t border-white/[0.08] bg-black/30">
                        <td className="p-4 text-sm text-gray-500">{feature}</td>
                        <td className="p-4 text-sm text-cyan font-bold">{neo}</td>
                        <td className="p-4 text-sm text-gray-500 opacity-50">{foam}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Guarantee Section - NeoBall only */}
        {isNeoBall && (
          <section className="py-20 px-6 bg-surface border-t border-white/[0.08] relative overflow-hidden">
            {/* Background text */}
            <div className="absolute -right-10 top-0 font-display text-[150px] sm:text-[250px] text-white/[0.02] leading-none pointer-events-none select-none">
              100%
            </div>

            <div className="max-w-3xl mx-auto relative z-10 text-center">
              <div className="w-20 h-20 bg-cyan/10 border border-cyan rounded-full flex items-center justify-center text-3xl mx-auto mb-8 shadow-[0_0_30px_rgba(0,246,224,0.4)]">
                🤝
              </div>

              <h2 className="font-display text-4xl sm:text-5xl mb-6">
                THE <span className="text-cyan">"FOUNDATIONS 10"</span> PROMISE
              </h2>

              <p className="text-lg text-gray-400 max-w-xl mx-auto mb-12 leading-relaxed">
                We don't want your money if we don't change your game.
                <br />
                But we don't accept returns from people who didn't do the work.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-black/40 border border-white/[0.08] rounded-2xl p-8 text-left">
                {[
                  {
                    step: "01",
                    title: "LOCK IN.",
                    desc: 'Complete the 10-Day "Foundations" Program inside the YP App using your new Stealth Ball.',
                  },
                  {
                    step: "02",
                    title: "LEVEL UP.",
                    desc: "If your handle isn't tighter, send us your completion log.",
                  },
                  {
                    step: "03",
                    title: "OR CASH OUT.",
                    desc: "We credit you 100% of the purchase price. You keep the ball. No shipping back.",
                  },
                ].map((item, i) => (
                  <div key={i} className="px-4">
                    <span className="font-mono text-[10px] font-bold text-cyan uppercase tracking-widest">
                      Step {item.step}
                    </span>
                    <h3 className="font-display text-2xl mt-2 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12">
                <p className="font-display text-2xl text-gray-500 italic tracking-widest">
                  James & Mike
                </p>
                <p className="font-mono text-[10px] text-gray-600 uppercase tracking-widest mt-2">
                  Founders, YouthPerformance
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Protocol Specs FAQ - NeoBall only */}
        {isNeoBall && (
          <section className="py-20 px-6 bg-wolf-black">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-display text-4xl text-center mb-12">PROTOCOL SPECS</h2>
              <div className="bg-panel border border-white/[0.08] rounded-2xl p-6 sm:p-8">
                {faqData.map((item, i) => (
                  <FAQItem key={i} question={item.question} answer={item.answer} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Sticky Buy Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-wolf-black/95 backdrop-blur-lg border-t border-white/[0.08] p-4 transition-transform duration-400 ${
          showStickyBar ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:block">
            <p className="font-display text-xl">
              {title} <span className="text-cyan">Founders</span>
            </p>
            <p className="font-mono text-[10px] text-gray-500 tracking-wide">
              Free Shipping • Lifetime Warranty
            </p>
          </div>

          <div className="flex items-center gap-4 flex-1 sm:flex-none justify-end">
            <span className="hidden sm:block font-mono text-2xl font-bold">
              <Money data={selectedVariant.price} />
            </span>

            <fetcher.Form method="post" action="/cart" className="flex-1 sm:flex-none">
              <input type="hidden" name="action" value="ADD_TO_CART" />
              <input type="hidden" name="merchandiseId" value={selectedVariant.id} />
              <input type="hidden" name="quantity" value="1" />

              <button
                type="submit"
                disabled={!isAvailable || isAddingToCart}
                className={`w-full sm:w-auto px-8 py-3 font-display text-lg tracking-wider rounded-xl transition-all ${
                  isAvailable
                    ? "bg-cyan text-wolf-black shadow-[0_0_20px_rgba(0,246,224,0.4)] hover:bg-white"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isAddingToCart ? "ADDING..." : isAvailable ? "ADD TO CART" : "SOLD OUT"}
              </button>
            </fetcher.Form>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed bottom-24 right-6 z-50 animate-slide-up">
          <div className="flex items-center gap-3 px-6 py-4 bg-green-500/10 border border-green-500/30 rounded-xl backdrop-blur-sm">
            <svg
              className="w-6 h-6 text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <div>
              <p className="text-green-400 font-medium">Added to cart!</p>
              <p className="text-green-400/70 text-sm">{title}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const PRODUCT_QUERY = `#graphql
  query Product($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      featuredImage {
        id
        url
        altText
        width
        height
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 100) {
        nodes {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
`;
