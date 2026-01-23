import { $ as store_get, a0 as unsubscribe_stores } from "../../../../chunks/index.js";
import { g as getContext } from "../../../../chunks/context.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/state.svelte.js";
const getStores = () => {
  const stores$1 = getContext("__svelte__");
  return {
    /** @type {typeof page} */
    page: {
      subscribe: stores$1.page.subscribe
    },
    /** @type {typeof navigating} */
    navigating: {
      subscribe: stores$1.navigating.subscribe
    },
    /** @type {typeof updated} */
    updated: stores$1.updated
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    store_get($$store_subs ??= {}, "$page", page).params.jumpId;
    $$renderer2.push(`<div class="min-h-screen bg-yp-dark p-6"><div class="max-w-md mx-auto"><div class="flex items-center justify-between mb-8"><button aria-label="Go back" class="p-2 -ml-2 text-white/60 hover:text-white"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg></button> <h1 class="text-xl font-semibold">Jump Result</h1> <div class="w-10"></div></div> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex flex-col items-center justify-center py-20"><div class="w-12 h-12 border-2 border-yp-primary/30 border-t-yp-primary rounded-full animate-spin"></div> <p class="mt-4 text-white/60">Loading result...</p></div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
