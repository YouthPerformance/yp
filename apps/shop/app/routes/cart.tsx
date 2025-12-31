import type {ActionFunctionArgs, LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Form, Link} from '@remix-run/react';
import {CartForm, Money} from '@shopify/hydrogen';

export async function loader({context}: LoaderFunctionArgs) {
  // Cart loading would use context.cart
  return {cart: null};
}

export async function action({request, context}: ActionFunctionArgs) {
  const formData = await request.formData();
  const merchandiseId = formData.get('merchandiseId');
  const quantity = Number(formData.get('quantity') || 1);

  // Cart operations would go here
  // await context.cart.addLines([{merchandiseId, quantity}]);

  return {success: true};
}

export default function Cart() {
  const {cart} = useLoaderData<typeof loader>();

  // Empty cart state
  if (!cart || !cart?.lines?.nodes?.length) {
    return (
      <main className="min-h-screen pt-24 px-6">
        <div className="max-w-4xl mx-auto text-center py-20">
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

  return (
    <main className="min-h-screen pt-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-5xl tracking-wider mb-12 text-center">
          YOUR CART
        </h1>

        {/* Cart Items */}
        <div className="space-y-6 mb-12">
          {cart.lines.nodes.map((line: any) => (
            <div
              key={line.id}
              className="flex gap-6 p-4 bg-surface rounded-xl border border-white/5"
            >
              {line.merchandise.image && (
                <img
                  src={line.merchandise.image.url}
                  alt={line.merchandise.image.altText || ''}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h3 className="font-display text-xl">
                  {line.merchandise.product.title}
                </h3>
                <p className="text-gray-400">Qty: {line.quantity}</p>
              </div>
              <div className="text-cyan font-mono">
                <Money data={line.cost.totalAmount} />
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="bg-surface rounded-xl p-6 border border-white/5">
          <div className="flex justify-between text-lg mb-6">
            <span>Subtotal</span>
            <span className="text-cyan font-mono">
              <Money data={cart.cost.subtotalAmount} />
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
