import { Link } from "@remix-run/react";

interface ShopAllButtonProps {
  href?: string;
  size?: number;
  text?: string;
  className?: string;
}

/**
 * Rotating Shop All Button
 * Circular text that spins on hover, inspired by Shopify Supply
 */
export function ShopAllButton({
  href = "/products",
  size = 100,
  text = "SHOP ALL",
  className = "",
}: ShopAllButtonProps) {
  // Create repeated text for the circle
  const repeatedText = `${text} • `.repeat(4);

  return (
    <Link
      to={href}
      className={`shop-all-button group ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Rotating Text Ring */}
      <svg viewBox="0 0 100 100" className="shop-all-button__ring" aria-hidden="true">
        <defs>
          <path id="circlePath" d="M 50,50 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" />
        </defs>
        <text fill="currentColor" fontSize="10" fontFamily="var(--font-mono)" letterSpacing="3">
          <textPath href="#circlePath">{repeatedText}</textPath>
        </text>
      </svg>

      {/* Center Arrow */}
      <span className="shop-all-button__center" aria-hidden="true">
        ↗
      </span>

      {/* Screen Reader Text */}
      <span className="sr-only">{text}</span>
    </Link>
  );
}

/**
 * Compact rotating button variant
 * Smaller size for inline use
 */
export function ShopAllButtonCompact({
  href = "/products",
  text = "VIEW ALL",
  className = "",
}: Omit<ShopAllButtonProps, "size">) {
  return <ShopAllButton href={href} size={80} text={text} className={className} />;
}

/**
 * Large rotating button variant
 * For hero sections or feature areas
 */
export function ShopAllButtonLarge({
  href = "/products",
  text = "SHOP NOW",
  className = "",
}: Omit<ShopAllButtonProps, "size">) {
  return <ShopAllButton href={href} size={140} text={text} className={className} />;
}
