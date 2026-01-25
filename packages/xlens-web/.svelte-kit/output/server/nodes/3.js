

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/capture/_page.svelte.js')).default;
export const universal = {
  "ssr": false,
  "prerender": false
};
export const universal_id = "src/routes/capture/+page.ts";
export const imports = ["_app/immutable/nodes/3.mcCo4d36.js","_app/immutable/chunks/iRdQ0xtj.js","_app/immutable/chunks/CapEeF5M.js","_app/immutable/chunks/DZ-iLIYQ.js","_app/immutable/chunks/BvqUIVqr.js","_app/immutable/chunks/Bvma8HCH.js","_app/immutable/chunks/CqVPvQJw.js","_app/immutable/chunks/-xEu4ZCt.js","_app/immutable/chunks/CRBBPxwk.js","_app/immutable/chunks/D4Jhb63t.js","_app/immutable/chunks/CS0qxZ5J.js","_app/immutable/chunks/C52gXIN9.js"];
export const stylesheets = [];
export const fonts = [];
