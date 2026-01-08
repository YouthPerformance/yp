import {useState, useCallback} from 'react';
import {Link} from '@remix-run/react';

interface ProductImage {
  url: string;
  altText?: string | null;
}

interface ProductCardProps {
  id: string;
  title: string;
  handle: string;
  price: string;
  featuredImage?: ProductImage | null;
  secondaryImage?: ProductImage | null;
  badge?: string;
  onQuickView?: (product: {
    id: string;
    title: string;
    price: string;
    image?: string;
    handle: string;
  }) => void;
}

export function ProductCard({
  id,
  title,
  handle,
  price,
  featuredImage,
  secondaryImage,
  badge,
  onQuickView,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleQuickView = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onQuickView?.({
        id,
        title,
        price,
        image: featuredImage?.url,
        handle,
      });
    },
    [id, title, price, featuredImage, handle, onQuickView],
  );

  return (
    <Link
      to={`/products/${handle}`}
      className="product-card product-card--shine group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div className="product-card__image">
        {/* Badge */}
        {badge && <span className="product-card__badge">{badge}</span>}

        {/* Primary Image */}
        {featuredImage && (
          <img
            src={featuredImage.url}
            alt={featuredImage.altText || title}
            className="transition-all duration-500"
            style={{
              opacity: isHovered && secondaryImage ? 0 : 1,
              transform: isHovered && secondaryImage ? 'scale(0.95)' : 'scale(1)',
            }}
          />
        )}

        {/* Secondary Image (shown on hover) */}
        {secondaryImage && (
          <img
            src={secondaryImage.url}
            alt={secondaryImage.altText || `${title} - alternate view`}
            className="product-card__image-secondary"
            style={{
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'scale(1)' : 'scale(1.05)',
            }}
          />
        )}

        {/* Quick View Button */}
        {onQuickView && (
          <button
            onClick={handleQuickView}
            className="product-card__quick-view"
            aria-label={`Quick view ${title}`}
          >
            Quick View
          </button>
        )}
      </div>

      {/* Product Info */}
      <div className="product-card__info">
        <p className="product-card__label">YP Gear</p>
        <h3 className="product-card__name">{title}</h3>
        <p className="product-card__price">${price}</p>
      </div>
    </Link>
  );
}

/**
 * Quick View Modal Component
 * Opens when Quick View button is clicked on product card
 */
interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    title: string;
    price: string;
    image?: string;
    handle: string;
  } | null;
}

export function QuickViewModal({isOpen, onClose, product}: QuickViewModalProps) {
  if (!product) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`quick-view-overlay ${isOpen ? 'is-open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className={`quick-view-modal ${isOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-view-title"
      >
        {/* Close Button */}
        <button
          className="quick-view-modal__close"
          onClick={onClose}
          aria-label="Close quick view"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M1 1L13 13M13 1L1 13" />
          </svg>
        </button>

        {/* Content */}
        <div className="quick-view-modal__content">
          {/* Image */}
          <div className="quick-view-modal__image">
            {product.image && (
              <img src={product.image} alt={product.title} />
            )}
          </div>

          {/* Info */}
          <div className="quick-view-modal__info">
            <p className="product-card__label">YP Gear</p>
            <h2 id="quick-view-title" className="quick-view-modal__title">
              {product.title}
            </h2>
            <p className="quick-view-modal__price">${product.price}</p>

            {/* Actions */}
            <div className="flex flex-col gap-3 mt-4">
              <Link
                to={`/products/${product.handle}`}
                className="btn-primary text-center"
                onClick={onClose}
              >
                View Full Details
              </Link>
              <button className="btn-secondary" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
