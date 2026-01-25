import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../chunks/state.svelte.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(`<div class="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-gradient-to-b from-gray-900 to-black"><div class="max-w-md"><div class="mb-8"><h1 class="text-5xl font-bold text-yp-primary">xLENS</h1> <p class="text-white/60 mt-2">AI-Verified Jump Measurement</p></div> <h2 class="text-2xl font-semibold mb-4">Measure Your Vertical</h2> <p class="text-white/70 mb-8">Record your jump with your phone. Get an accurate measurement powered by AI analysis.</p> <div class="mb-8 text-left space-y-3"><div class="flex items-center gap-3 text-white/80"><div class="w-8 h-8 rounded-full bg-yp-primary/20 flex items-center justify-center flex-shrink-0"><span class="text-yp-primary font-bold text-sm">1</span></div> <span>Enter your height for calibration</span></div> <div class="flex items-center gap-3 text-white/80"><div class="w-8 h-8 rounded-full bg-yp-primary/20 flex items-center justify-center flex-shrink-0"><span class="text-yp-primary font-bold text-sm">2</span></div> <span>Set up your camera 8-10 feet away</span></div> <div class="flex items-center gap-3 text-white/80"><div class="w-8 h-8 rounded-full bg-yp-primary/20 flex items-center justify-center flex-shrink-0"><span class="text-yp-primary font-bold text-sm">3</span></div> <span>Record your jump and get results</span></div></div> <button class="btn-primary w-full text-lg py-4 svelte-1uha8ag">Start Jump Test</button> <div class="mt-10 text-sm text-white/40 space-y-2"><p>Works on iOS Safari and Android Chrome</p> <p>Powered by Gemini AI Vision</p></div></div></div>`);
  });
}
export {
  _page as default
};
