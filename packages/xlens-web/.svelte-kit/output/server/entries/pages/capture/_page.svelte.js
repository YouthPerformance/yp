import { a as ssr_context, e as escape_html } from "../../../chunks/context.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import "mp4-muxer";
import "tus-js-client";
function onDestroy(fn) {
  /** @type {SSRContext} */
  ssr_context.r.on_destroy(fn);
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let clientState = "idle";
    let debugInfo = "";
    onDestroy(() => {
    });
    $$renderer2.push(`<div class="relative min-h-screen bg-black"><video autoplay playsinline muted class="absolute inset-0 w-full h-full object-cover video-preview"></video>  <div class="absolute inset-0 flex flex-col"><div class="flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent"><button aria-label="Go back" class="p-2 text-white/80 hover:text-white"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg></button> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="flex-1 flex flex-col items-center justify-center">`);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="text-center"><button class="w-32 h-32 rounded-full bg-yp-primary flex flex-col items-center justify-center transition-transform active:scale-95 shadow-lg shadow-yp-primary/30 mb-4"><svg class="w-12 h-12 text-white mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg> <span class="text-white font-semibold text-sm">Start</span></button> <p class="text-white/60 text-sm">Tap to enable camera</p></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
      {
        $$renderer2.push("<!--[!-->");
        {
          $$renderer2.push("<!--[!-->");
          {
            $$renderer2.push("<!--[!-->");
            {
              $$renderer2.push("<!--[!-->");
              {
                $$renderer2.push("<!--[!-->");
                {
                  $$renderer2.push("<!--[!-->");
                }
                $$renderer2.push(`<!--]-->`);
              }
              $$renderer2.push(`<!--]-->`);
            }
            $$renderer2.push(`<!--]-->`);
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div> <div class="p-6 bg-gradient-to-t from-black/50 to-transparent"><div class="flex items-center justify-center gap-6">`);
    {
      $$renderer2.push("<!--[!-->");
      {
        $$renderer2.push("<!--[!-->");
        if ([
          "checking_compatibility",
          "requesting_permissions",
          "preparing_session",
          "processing",
          "uploading"
        ].includes(clientState)) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center"><div class="w-8 h-8 border-2 border-white/40 border-t-white rounded-full animate-spin"></div></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div> `);
    {
      $$renderer2.push("<!--[!-->");
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--> <div class="mt-4 text-xs text-white/40 font-mono text-center">${escape_html(debugInfo)}</div></div></div></div>`);
  });
}
export {
  _page as default
};
