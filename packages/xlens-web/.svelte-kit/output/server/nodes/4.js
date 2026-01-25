

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/result/_jumpId_/_page.svelte.js')).default;
export const universal = {
  "ssr": false,
  "prerender": false
};
export const universal_id = "src/routes/result/[jumpId]/+page.ts";
export const imports = ["_app/immutable/nodes/4.DdiyoCjt.js","_app/immutable/chunks/iRdQ0xtj.js","_app/immutable/chunks/CapEeF5M.js","_app/immutable/chunks/DZ-iLIYQ.js","_app/immutable/chunks/BvqUIVqr.js","_app/immutable/chunks/Bvma8HCH.js","_app/immutable/chunks/CqVPvQJw.js","_app/immutable/chunks/-xEu4ZCt.js","_app/immutable/chunks/oWoCID4_.js","_app/immutable/chunks/CRBBPxwk.js","_app/immutable/chunks/DyTlRFN8.js","_app/immutable/chunks/CS0qxZ5J.js"];
export const stylesheets = [];
export const fonts = [];
