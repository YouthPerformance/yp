export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.BwmfcQv5.js",app:"_app/immutable/entry/app.C0pb0I8Z.js",imports:["_app/immutable/entry/start.BwmfcQv5.js","_app/immutable/chunks/CumJ52HM.js","_app/immutable/chunks/D_JzRG0x.js","_app/immutable/chunks/Bx1MBOAJ.js","_app/immutable/entry/app.C0pb0I8Z.js","_app/immutable/chunks/D_JzRG0x.js","_app/immutable/chunks/CdyOn7Ui.js","_app/immutable/chunks/Db4TDr3E.js","_app/immutable/chunks/B-Tn0Iuz.js","_app/immutable/chunks/Bx1MBOAJ.js","_app/immutable/chunks/Dou0k9GB.js","_app/immutable/chunks/NYLeIirC.js","_app/immutable/chunks/DlVJ0LMv.js","_app/immutable/chunks/CUZPBNU_.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('../output/server/nodes/0.js')),
			__memo(() => import('../output/server/nodes/1.js')),
			__memo(() => import('../output/server/nodes/2.js')),
			__memo(() => import('../output/server/nodes/3.js')),
			__memo(() => import('../output/server/nodes/4.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/capture",
				pattern: /^\/capture\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/result/[jumpId]",
				pattern: /^\/result\/([^/]+?)\/?$/,
				params: [{"name":"jumpId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
