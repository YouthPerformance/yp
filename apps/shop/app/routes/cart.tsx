import type {ActionFunctionArgs, LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, useFetcher, Link} from '@remix-run/react';
import {CartForm, Money, Image} from '@shopify/hydrogen';
import {json} from '@shopify/remix-oxygen';

// Cart action types
type CartAction =
  | 'ADD_TO_CART'
  | 'REMOVE_FROM_CART'
  | 'UPDATE_QUANTITY'
  | 'APPLY_DISCOUNT'
  | 'REMOVE_DISCOUNT';

export async function loader({context}: LoaderFunctionArgs) {
  const {cart, session} = context;

  // Get the cart - this returns the cart or null if no cart exists
  const cartData = await cart.get();

  return json(
    {cart: cartData},
    {
      headers: {
        'Set-Cookie': await session.commit(),
      },
    }
  );
}

export async function action({request, context}: ActionFunctionArgs) {
  const {cart, session} = context;
  const formData = await request.formData();

  const action = formData.get('action') as CartAction;

  let result;
  let errors: string[] = [];

  try {
    switch (action) {
      case 'ADD_TO_CART': {
        const merchandiseId = formData.get('merchandiseId') as string;
        const quantity = Number(formData.get('quantity') || 1);

        if (!merchandiseId) {
          errors.push('Missing product variant ID');
          break;
        }

        result = await cart.addLines([
          {
            merchandiseId,
            quantity,
          },
        ]);
        break;
      }

      case 'REMOVE_FROM_CART': {
        const lineId = formData.get('lineId') as string;

        if (!lineId) {
          errors.push('Missing line item ID');
          break;
        }

        result = await cart.removeLines([lineId]);
        break;
      }

      case 'UPDATE_QUANTITY': {
        const lineId = formData.get('lineId') as string;
        const quantity = Number(formData.get('quantity') || 1);

        if (!lineId) {
          errors.push('Missing line item ID');
          break;
        }

        // If quantity is 0 or less, remove the item
        if (quantity <= 0) {
          result = await cart.removeLines([lineId]);
        } else {
          result = await cart.updateLines([
            {
              id: lineId,
              quantity,
            },
          ]);
        }
        break;
      }

      case 'APPLY_DISCOUNT': {
        const discountCode = formData.get('discountCode') as string;

        if (!discountCode) {
          errors.push('Missing discount code');
          break;
        }

        result = await cart.updateDiscountCodes([discountCode]);
        break;
      }

      case 'REMOVE_DISCOUNT': {
        result = await cart.updateDiscountCodes([]);
        break;
      }

      default:
        errors.push(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('Cart action error:', error);
    errors.push(error instanceof Error ? error.message : 'An error occurred');
  }

  // Check for cart errors from Shopify
  if (result?.errors?.length) {
    errors.push(...result.errors.map((e: any) => e.message || String(e)));
  }

  return json(
    {
      success: errors.length === 0,
      errors,
      cart: result?.cart,
    },
    {
      headers: {
        'Set-Cookie': await session.commit(),
      },
    }
  );
}

export default function Cart() {
  const {cart} = useLoaderData<typeof loader>();

  // Empty cart state
  if (!cart || !cart?.lines?.nodes?.length) {
    return (
      <main className="min-h-screen pt-24 px-6">
        <div className="max-w-4xl mx-auto text-center py-20">
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-surface flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 className="font-display text-5xl tracking-wider mb-6">
            YOUR CART
          </h1>
          <p className="text-gray-400 text-lg mb-8">Your cart is empty</p>
          <Link
            to="/collections/all"
            className="inline-block px-8 py-4 bg-neon-green text-wolf-black font-bold text-lg rounded-lg glow-green hover:scale-105 transition-transform"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      </main>
    );
  }

  const totalQuantity = cart.totalQuantity || cart.lines.nodes.reduce((acc: number, line: any) => acc + line.quantity, 0);

  return (
    <main className="min-h-screen pt-24 px-6 pb-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-5xl tracking-wider mb-4 text-center">
          YOUR CART
        </h1>
        <p className="text-gray-400 text-center mb-12">
          {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
        </p>

        {/* Cart Items */}
        <div className="space-y-4 mb-12">
          {cart.lines.nodes.map((line: any) => (
            <CartLineItem key={line.id} line={line} />
          ))}
        </div>

        {/* Discount Code */}
        <DiscountForm discountCodes={cart.discountCodes} />

        {/* Cart Summary */}
        <div className="bg-surface rounded-xl p-6 border border-white/5">
          {/* Discount display */}
          {cart.discountCodes?.filter((code: any) => code.applicable).length > 0 && (
            <div className="flex justify-between text-sm mb-4 text-green-400">
              <span>Discount applied</span>
              <span>{cart.discountCodes.filter((code: any) => code.applicable).map((code: any) => code.code).join(', ')}</span>
            </div>
          )}

          <div className="flex justify-between text-lg mb-2">
            <span className="text-gray-400">Subtotal</span>
            <span className="text-white font-mono">
              <Money data={cart.cost.subtotalAmount} />
            </span>
          </div>

          {cart.cost.totalTaxAmount && (
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Taxes</span>
              <span className="text-gray-300 font-mono">
                <Money data={cart.cost.totalTaxAmount} />
              </span>
            </div>
          )}

          <div className="flex justify-between text-xl font-bold mb-6 pt-4 border-t border-white/10">
            <span>Total</span>
            <span className="text-cyan font-mono">
              <Money data={cart.cost.totalAmount} />
            </span>
          </div>

          <a
            href={cart.checkoutUrl}
            className="block w-full py-4 bg-neon-green text-wolf-black font-bold text-lg rounded-lg text-center glow-green hover:scale-[1.02] transition-transform"
          >
            CHECKOUT
          </a>

          <Link
            to="/collections/all"
            className="block w-full py-4 mt-4 border border-white/20 text-white font-bold text-lg rounded-lg text-center hover:border-cyan transition-colors"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    </main>
  );
}

function CartLineItem({line}: {line: any}) {
  const fetcher = useFetcher();
  const isRemoving = fetcher.state !== 'idle' && fetcher.formData?.get('action') === 'REMOVE_FROM_CART';
  const isUpdating = fetcher.state !== 'idle' && fetcher.formData?.get('action') === 'UPDATE_QUANTITY';

  const {merchandise, quantity, cost} = line;
  const {product, image, selectedOptions} = merchandise;

  return (
    <div
      className={`flex gap-4 sm:gap-6 p-4 bg-surface rounded-xl border border-white/5 transition-opacity ${
        isRemoving ? 'opacity-50' : ''
      }`}
    >
      {/* Product Image */}
      <Link to={`/products/${product.handle}`} className="shrink-0">
        {image ? (
          <Image
            data={image}
            alt={image.altText || product.title}
            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
            width={96}
            height={96}
          />
        ) : (
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-800 rounded-lg flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <Link to={`/products/${product.handle}`}>
          <h3 className="font-display text-lg sm:text-xl hover:text-cyan transition-colors truncate">
            {product.title}
          </h3>
        </Link>

        {/* Selected Options */}
        {selectedOptions && selectedOptions.length > 0 && (
          <p className="text-gray-500 text-sm mt-1">
            {selectedOptions
              .filter((option: any) => option.value !== 'Default Title')
              .map((option: any) => option.value)
              .join(' / ')}
          </p>
        )}

        {/* Quantity Controls */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center border border-white/20 rounded-lg overflow-hidden">
            <fetcher.Form method="post" action="/cart">
              <input type="hidden" name="action" value="UPDATE_QUANTITY" />
              <input type="hidden" name="lineId" value={line.id} />
              <input type="hidden" name="quantity" value={quantity - 1} />
              <button
                type="submit"
                disabled={isUpdating || quantity <= 1}
                className="px-3 py-1.5 text-gray-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Decrease quantity"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
            </fetcher.Form>

            <span className="px-3 py-1.5 text-white font-mono min-w-[40px] text-center">
              {isUpdating ? '...' : quantity}
            </span>

            <fetcher.Form method="post" action="/cart">
              <input type="hidden" name="action" value="UPDATE_QUANTITY" />
              <input type="hidden" name="lineId" value={line.id} />
              <input type="hidden" name="quantity" value={quantity + 1} />
              <button
                type="submit"
                disabled={isUpdating}
                className="px-3 py-1.5 text-gray-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
                aria-label="Increase quantity"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </fetcher.Form>
          </div>

          {/* Remove Button */}
          <fetcher.Form method="post" action="/cart">
            <input type="hidden" name="action" value="REMOVE_FROM_CART" />
            <input type="hidden" name="lineId" value={line.id} />
            <button
              type="submit"
              disabled={isRemoving}
              className="text-gray-500 hover:text-red-400 transition-colors disabled:opacity-50"
              aria-label="Remove item"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </fetcher.Form>
        </div>
      </div>

      {/* Price */}
      <div className="text-right shrink-0">
        <div className="text-cyan font-mono font-bold">
          <Money data={cost.totalAmount} />
        </div>
        {quantity > 1 && (
          <div className="text-gray-500 text-sm font-mono mt-1">
            <Money data={cost.amountPerQuantity} /> each
          </div>
        )}
      </div>
    </div>
  );
}

function DiscountForm({discountCodes}: {discountCodes?: any[]}) {
  const fetcher = useFetcher<{success?: boolean; errors?: string[]}>();
  const isApplying = fetcher.state !== 'idle';
  const hasDiscount = discountCodes?.some((code: any) => code.applicable);

  if (hasDiscount) {
    return (
      <div className="mb-6 p-4 bg-surface rounded-xl border border-green-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span className="text-green-400 font-medium">
              {discountCodes?.filter((c: any) => c.applicable).map((c: any) => c.code).join(', ')}
            </span>
          </div>
          <fetcher.Form method="post" action="/cart">
            <input type="hidden" name="action" value="REMOVE_DISCOUNT" />
            <button
              type="submit"
              className="text-gray-500 hover:text-red-400 transition-colors text-sm"
            >
              Remove
            </button>
          </fetcher.Form>
        </div>
      </div>
    );
  }

  return (
    <fetcher.Form method="post" action="/cart" className="mb-6">
      <input type="hidden" name="action" value="APPLY_DISCOUNT" />
      <div className="flex gap-2">
        <input
          type="text"
          name="discountCode"
          placeholder="Discount code"
          className="flex-1 px-4 py-3 bg-surface border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan transition-colors"
        />
        <button
          type="submit"
          disabled={isApplying}
          className="px-6 py-3 bg-white/5 border border-white/20 text-white font-medium rounded-lg hover:border-cyan transition-colors disabled:opacity-50"
        >
          {isApplying ? 'Applying...' : 'Apply'}
        </button>
      </div>
      {fetcher.data?.errors && fetcher.data.errors.length > 0 && (
        <p className="text-red-400 text-sm mt-2">{fetcher.data.errors.join(', ')}</p>
      )}
    </fetcher.Form>
  );
}
