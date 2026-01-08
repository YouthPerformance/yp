/**
 * Animated Product Card Component
 * Inspired by Shopify Supply's product grid
 *
 * Features:
 * - Image swap on hover (front/back)
 * - Quick View button appears on hover
 * - Smooth scale transitions
 * - Shine sweep effect option
 */

import { useState } from 'react';

interface ProductCardProps {
  title: string;
  price: string;
  primaryImage: string;
  secondaryImage?: string;
  href: string;
  badge?: string;
  onQuickView?: () => void;
}

export function ProductCardAnimated({
  title,
  price,
  primaryImage,
  secondaryImage,
  href,
  badge,
  onQuickView,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group/product-card relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Link */}
      <a href={href} className="block">
        {/* Image Container */}
        <div className="group/product-image relative aspect-square overflow-hidden bg-neutral-100">
          {/* Badge */}
          {badge && (
            <span className="absolute top-3 left-3 z-10 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
              {badge}
            </span>
          )}

          {/* Primary Image */}
          <img
            src={primaryImage}
            alt={title}
            className={`
              w-full h-full object-cover
              transition-all duration-500 ease-out
              ${isHovered && secondaryImage ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
            `}
          />

          {/* Secondary Image (shown on hover) */}
          {secondaryImage && (
            <img
              src={secondaryImage}
              alt={`${title} - alternate view`}
              className={`
                absolute inset-0 w-full h-full object-cover
                transition-all duration-500 ease-out
                ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}
              `}
            />
          )}

          {/* Quick View Button */}
          {onQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onQuickView();
              }}
              className={`
                absolute bottom-4 left-1/2 -translate-x-1/2
                px-6 py-3
                bg-transparent border border-current
                font-mono text-xs uppercase tracking-widest
                transition-all duration-300 ease-out
                hover:bg-white hover:text-black
                md:block hidden
                ${isHovered
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 translate-y-2 scale-90'
                }
              `}
            >
              Quick View
            </button>
          )}
        </div>

        {/* Product Info */}
        <div className="pt-4 space-y-1">
          <h3 className="text-sm font-medium">{title}</h3>
          <p className="text-sm text-gray-600">{price}</p>
        </div>
      </a>
    </div>
  );
}

/**
 * Rotating Shop All Button Component
 * The circular spinning text badge
 */
export function ShopAllButton({
  href = '/shop',
  size = 100,
}: {
  href?: string;
  size?: number;
}) {
  return (
    <a
      href={href}
      className="group inline-flex items-center justify-center relative"
      style={{ width: size, height: size }}
    >
      {/* Rotating Text Ring */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full animate-[rotate_10s_linear_infinite] group-hover:animate-[rotate_3s_linear_infinite]"
        style={{ animationPlayState: 'paused' }}
        onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = 'running')}
        onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = 'paused')}
      >
        <defs>
          <path
            id="circlePath"
            d="M 50,50 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
          />
        </defs>
        <text
          fill="currentColor"
          fontSize="10"
          fontFamily="monospace"
          letterSpacing="4"
        >
          <textPath href="#circlePath">
            SHOP ALL • SHOP ALL • SHOP ALL •
          </textPath>
        </text>
      </svg>

      {/* Center Arrow */}
      <span className="absolute text-2xl transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
        ↗
      </span>
    </a>
  );
}

/**
 * CSS to include in your global styles:
 *
 * @keyframes rotate {
 *   to { transform: rotate(360deg); }
 * }
 *
 * @keyframes bloop {
 *   0% { transform: scale(0.9); }
 *   40% { transform: scale(1.1); }
 *   100% { transform: scale(1); }
 * }
 *
 * @keyframes shine {
 *   to { left: 125%; }
 * }
 */

// Tailwind config additions for animations:
export const tailwindAnimationConfig = {
  theme: {
    extend: {
      animation: {
        'spin-slow': 'rotate 10s linear infinite',
        'spin-medium': 'rotate 5s linear infinite',
        'spin-fast': 'rotate 2s linear infinite',
        'bloop': 'bloop 0.3s linear',
        'float': 'float 5s ease-in-out infinite',
        'shine': 'shine 1s ease-out',
      },
      keyframes: {
        rotate: {
          to: { transform: 'rotate(360deg)' },
        },
        bloop: {
          '0%': { transform: 'scale(0.9)' },
          '40%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5%)' },
        },
        shine: {
          to: { left: '125%' },
        },
      },
    },
  },
};
