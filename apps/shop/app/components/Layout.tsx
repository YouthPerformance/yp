import {Link} from '@remix-run/react';
import type {ReactNode} from 'react';
import {Header} from '@yp/ui';

interface LayoutProps {
  children: ReactNode;
  cartCount?: number;
}

export function Layout({children, cartCount = 0}: LayoutProps) {
  return (
    <div className="min-h-screen bg-wolf-black text-white">
      <Header
        logoHref="/"
        cartCount={cartCount}
        links={[
          { label: "ACADEMY", href: "http://localhost:3003" },
          { label: "SHOP", href: "/" },
          { label: "NEOBALL", href: "http://localhost:3002" },
        ]}
      />
      <main style={{paddingTop: '64px'}}>{children}</main>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-surface border-t border-white/5 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-display text-xl mb-4">
            <span className="text-neon-green">YP</span> SHOP
          </h3>
          <p className="text-gray-400 text-sm">
            Premium training gear for young athletes who refuse to settle.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <Link to="/collections/all" className="hover:text-white">
                All Products
              </Link>
            </li>
            <li>
              <Link to="/products/neoball" className="hover:text-white">
                NeoBall
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Links</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <a
                href="https://youthperformance.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                YP Academy
              </a>
            </li>
            <li>
              <a
                href="https://neoball.co"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                NeoBall.co
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Follow</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <a href="#" className="hover:text-white">
                Instagram
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                TikTok
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Youth Performance. All rights reserved.
      </div>
    </footer>
  );
}
