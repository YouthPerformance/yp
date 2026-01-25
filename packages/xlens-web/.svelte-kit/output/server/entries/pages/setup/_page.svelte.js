import { a1 as ensure_array_like, a2 as attr_class, a3 as attr, a4 as stringify } from "../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import { e as escape_html } from "../../../chunks/context.js";
function feetInchesToTotalInches(feet, inches) {
  return feet * 12 + inches;
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let heightFeet = 5;
    let heightInches = 10;
    let currentStep = "height";
    let totalHeightInches = feetInchesToTotalInches(heightFeet, heightInches);
    let heightCm = Math.round(totalHeightInches * 2.54);
    const heightPresets = [
      { label: `5'0"`, feet: 5, inches: 0 },
      { label: `5'6"`, feet: 5, inches: 6 },
      { label: `5'10"`, feet: 5, inches: 10 },
      { label: `6'0"`, feet: 6, inches: 0 },
      { label: `6'4"`, feet: 6, inches: 4 }
    ];
    $$renderer2.push(`<div class="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col"><div class="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0"><button class="p-2 text-white/60 hover:text-white"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg></button> <h1 class="text-lg font-semibold">Setup</h1> <div class="w-10"></div></div> <div class="flex justify-center gap-2 py-4"><!--[-->`);
    const each_array = ensure_array_like(["height", "setup", "ready"]);
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      let step = each_array[i];
      const stepIndex = ["height", "setup", "ready"].indexOf(currentStep);
      const isActive = currentStep === step;
      const isPast = stepIndex > i;
      const isFuture = !isActive && stepIndex < i + 1;
      $$renderer2.push(`<div${attr_class(`w-3 h-3 rounded-full transition-colors ${stringify(isActive || isPast ? "bg-yp-primary" : "")} ${stringify(isFuture ? "bg-white/20" : "")}`)}></div>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="flex-1 overflow-y-auto p-6 pb-24"><div class="max-w-md mx-auto">`);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="text-center mb-8"><h2 class="text-2xl font-bold mb-2">What's Your Height?</h2> <p class="text-white/60">We use this to calibrate the measurement</p></div> <div class="text-center mb-8"><div class="text-6xl font-bold text-yp-primary">${escape_html(heightFeet)}'${escape_html(heightInches)}"</div> <div class="text-white/50 mt-2">${escape_html(heightCm)} cm</div></div> <div class="flex flex-wrap justify-center gap-2 mb-8"><!--[-->`);
      const each_array_1 = ensure_array_like(heightPresets);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let preset = each_array_1[$$index_1];
        const isSelected = heightFeet === preset.feet && heightInches === preset.inches;
        $$renderer2.push(`<button${attr_class(`px-4 py-2 rounded-full border transition-colors ${stringify(isSelected ? "border-yp-primary bg-yp-primary/20" : "border-white/20")}`)}>${escape_html(preset.label)}</button>`);
      }
      $$renderer2.push(`<!--]--></div> <div class="space-y-6"><div><label class="block text-sm text-white/60 mb-2">Feet</label> <input type="range"${attr("value", heightFeet)} min="4" max="7" step="1" class="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-yp-primary"/> <div class="flex justify-between text-xs text-white/40 mt-1"><span>4'</span> <span>5'</span> <span>6'</span> <span>7'</span></div></div> <div><label class="block text-sm text-white/60 mb-2">Inches</label> <input type="range"${attr("value", heightInches)} min="0" max="11" step="1" class="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-yp-primary"/> <div class="flex justify-between text-xs text-white/40 mt-1"><span>0"</span> <span>3"</span> <span>6"</span> <span>9"</span> <span>11"</span></div></div></div>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black to-transparent"><div class="max-w-md mx-auto">`);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<button class="btn-primary w-full text-lg svelte-g40i6i">Continue</button>`);
    }
    $$renderer2.push(`<!--]--></div></div></div>`);
  });
}
export {
  _page as default
};
