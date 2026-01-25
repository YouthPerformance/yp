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
		client: {start:"_app/immutable/entry/start.B3nc1Jhj.js",app:"_app/immutable/entry/app.DyCNg5-s.js",imports:["_app/immutable/entry/start.B3nc1Jhj.js","_app/immutable/chunks/CS0qxZ5J.js","_app/immutable/chunks/CapEeF5M.js","_app/immutable/chunks/DZ-iLIYQ.js","_app/immutable/entry/app.DyCNg5-s.js","_app/immutable/chunks/CapEeF5M.js","_app/immutable/chunks/BvqUIVqr.js","_app/immutable/chunks/Bvma8HCH.js","_app/immutable/chunks/iRdQ0xtj.js","_app/immutable/chunks/DZ-iLIYQ.js","_app/immutable/chunks/CqVPvQJw.js","_app/immutable/chunks/-xEu4ZCt.js","_app/immutable/chunks/D4Jhb63t.js","_app/immutable/chunks/DyTlRFN8.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('../output/server/nodes/0.js')),
			__memo(() => import('../output/server/nodes/1.js')),
			__memo(() => import('../output/server/nodes/2.js')),
			__memo(() => import('../output/server/nodes/3.js')),
			__memo(() => import('../output/server/nodes/4.js')),
			__memo(() => import('../output/server/nodes/5.js'))
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
			},
			{
				id: "/setup",
				pattern: /^\/setup\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
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
