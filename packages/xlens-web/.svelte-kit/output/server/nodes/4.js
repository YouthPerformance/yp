

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/result/_jumpId_/_page.svelte.js')).default;
export const universal = {
  "ssr": false,
  "prerender": false
};
export const universal_id = "src/routes/result/[jumpId]/+page.ts";
export const imports = ["_app/immutable/nodes/4.CM5ctyRO.js","_app/immutable/chunks/B-Tn0Iuz.js","_app/immutable/chunks/D_JzRG0x.js","_app/immutable/chunks/Bx1MBOAJ.js","_app/immutable/chunks/CdyOn7Ui.js","_app/immutable/chunks/Db4TDr3E.js","_app/immutable/chunks/Dou0k9GB.js","_app/immutable/chunks/NYLeIirC.js","_app/immutable/chunks/C6h3zICr.js","_app/immutable/chunks/CUZPBNU_.js","_app/immutable/chunks/CumJ52HM.js"];
export const stylesheets = [];
export const fonts = [];
