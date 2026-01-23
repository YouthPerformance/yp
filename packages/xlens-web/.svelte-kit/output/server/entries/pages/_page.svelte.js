import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../chunks/state.svelte.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(`<div class="flex flex-col items-center justify-center min-h-screen p-6 text-center"><div class="max-w-md"><div class="mb-8"><h1 class="text-4xl font-bold text-yp-primary">xLENS</h1> <p class="text-white/60 mt-2">Verified Jump Capture</p></div> <h2 class="text-2xl font-semibold mb-4">Prove Your Jump</h2> <p class="text-white/70 mb-8">Record your vertical jump with cryptographic verification. No apps to download.</p> <button class="btn-primary w-full text-lg">Start Jump Test</button> <div class="mt-12 text-sm text-white/50 space-y-2"><p>📱 Works on iOS Safari and Chrome</p> <p>🔒 Cryptographically verified</p> <p>⚡ No app download required</p></div></div></div>`);
  });
}
export {
  _page as default
};
