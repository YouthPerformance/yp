

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/capture/_page.svelte.js')).default;
export const universal = {
  "ssr": false,
  "prerender": false
};
export const universal_id = "src/routes/capture/+page.ts";
export const imports = ["_app/immutable/nodes/3.BulHo0gl.js","_app/immutable/chunks/B-Tn0Iuz.js","_app/immutable/chunks/D_JzRG0x.js","_app/immutable/chunks/Bx1MBOAJ.js","_app/immutable/chunks/CdyOn7Ui.js","_app/immutable/chunks/Db4TDr3E.js","_app/immutable/chunks/Dou0k9GB.js","_app/immutable/chunks/NYLeIirC.js","_app/immutable/chunks/C6h3zICr.js","_app/immutable/chunks/DlVJ0LMv.js","_app/immutable/chunks/CumJ52HM.js"];
export const stylesheets = [];
export const fonts = [];
