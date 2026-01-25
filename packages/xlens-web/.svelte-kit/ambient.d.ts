
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```sh
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const VITE_CONVEX_URL: string;
	export const VERCEL_OIDC_TOKEN: string;
	export const NVM_INC: string;
	export const MANPATH: string;
	export const npm_package_scripts_test_e2e: string;
	export const GHOSTTY_RESOURCES_DIR: string;
	export const NoDefaultCurrentDirectoryInExePath: string;
	export const TERM_PROGRAM: string;
	export const CLAUDE_CODE_ENTRYPOINT: string;
	export const npm_package_dependencies_convex: string;
	export const NODE: string;
	export const NVM_CD_FLAGS: string;
	export const GEM_HOME: string;
	export const npm_package_devDependencies_typescript: string;
	export const INIT_CWD: string;
	export const TERM: string;
	export const SHELL: string;
	export const npm_package_devDependencies_vite: string;
	export const TMPDIR: string;
	export const HOMEBREW_REPOSITORY: string;
	export const npm_package_dependencies_mp4_muxer: string;
	export const CONDA_SHLVL: string;
	export const npm_package_scripts_lint: string;
	export const TERM_PROGRAM_VERSION: string;
	export const npm_package_scripts_dev: string;
	export const VIPSHOME: string;
	export const npm_package_private: string;
	export const npm_package_devDependencies__sveltejs_kit: string;
	export const npm_config_registry: string;
	export const ZSH: string;
	export const GIT_EDITOR: string;
	export const USER: string;
	export const NVM_DIR: string;
	export const LS_COLORS: string;
	export const npm_package_scripts_check_watch: string;
	export const COMMAND_MODE: string;
	export const CONDA_EXE: string;
	export const PNPM_SCRIPT_SRC_DIR: string;
	export const SSH_AUTH_SOCK: string;
	export const __CF_USER_TEXT_ENCODING: string;
	export const npm_package_devDependencies_postcss: string;
	export const npm_execpath: string;
	export const PAGER: string;
	export const npm_package_devDependencies_svelte: string;
	export const TMUX: string;
	export const _CE_CONDA: string;
	export const LSCOLORS: string;
	export const npm_config_frozen_lockfile: string;
	export const PATH: string;
	export const npm_package_scripts_lint_fix: string;
	export const MONO_MANAGED_WATCHER: string;
	export const npm_package_scripts_typecheck: string;
	export const MONO_GC_PARAMS: string;
	export const GHOSTTY_SHELL_FEATURES: string;
	export const npm_package_dependencies_tus_js_client: string;
	export const __CFBundleIdentifier: string;
	export const PWD: string;
	export const npm_package_devDependencies_tailwindcss: string;
	export const npm_command: string;
	export const ELEVEN_API_KEY: string;
	export const npm_package_scripts_preview: string;
	export const OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE: string;
	export const npm_package_devDependencies_jsdom: string;
	export const npm_lifecycle_event: string;
	export const LANG: string;
	export const npm_package_name: string;
	export const npm_package_devDependencies__sveltejs_vite_plugin_svelte: string;
	export const NODE_PATH: string;
	export const npm_package_scripts_build: string;
	export const XPC_FLAGS: string;
	export const TMUX_PANE: string;
	export const npm_package_devDependencies_vitest: string;
	export const npm_package_devDependencies__types_dom_mediacapture_transform: string;
	export const npm_package_dependencies_idb_keyval: string;
	export const npm_config_manage_package_manager_versions: string;
	export const npm_config_node_gyp: string;
	export const _CE_M: string;
	export const XPC_SERVICE_NAME: string;
	export const npm_package_version: string;
	export const npm_package_devDependencies_autoprefixer: string;
	export const npm_package_devDependencies_svelte_check: string;
	export const SHLVL: string;
	export const HOME: string;
	export const npm_package_type: string;
	export const TERMINFO: string;
	export const npm_package_scripts_test: string;
	export const npm_package_devDependencies__sveltejs_adapter_vercel: string;
	export const HOMEBREW_PREFIX: string;
	export const LOGNAME: string;
	export const LESS: string;
	export const CONDA_PYTHON_EXE: string;
	export const npm_package_devDependencies__sveltejs_adapter_cloudflare: string;
	export const npm_lifecycle_script: string;
	export const XDG_DATA_DIRS: string;
	export const GHOSTTY_BIN_DIR: string;
	export const COREPACK_ENABLE_AUTO_PIN: string;
	export const NVM_BIN: string;
	export const BUN_INSTALL: string;
	export const npm_config_user_agent: string;
	export const INFOPATH: string;
	export const HOMEBREW_CELLAR: string;
	export const npm_package_devDependencies__playwright_test: string;
	export const OSLogRateLimit: string;
	export const CLAUDECODE: string;
	export const npm_package_scripts_check: string;
	export const COLORTERM: string;
	export const npm_package_scripts_test_unit: string;
	export const npm_node_execpath: string;
	export const NODE_ENV: string;
}

/**
 * Similar to [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		VITE_CONVEX_URL: string;
		VERCEL_OIDC_TOKEN: string;
		NVM_INC: string;
		MANPATH: string;
		npm_package_scripts_test_e2e: string;
		GHOSTTY_RESOURCES_DIR: string;
		NoDefaultCurrentDirectoryInExePath: string;
		TERM_PROGRAM: string;
		CLAUDE_CODE_ENTRYPOINT: string;
		npm_package_dependencies_convex: string;
		NODE: string;
		NVM_CD_FLAGS: string;
		GEM_HOME: string;
		npm_package_devDependencies_typescript: string;
		INIT_CWD: string;
		TERM: string;
		SHELL: string;
		npm_package_devDependencies_vite: string;
		TMPDIR: string;
		HOMEBREW_REPOSITORY: string;
		npm_package_dependencies_mp4_muxer: string;
		CONDA_SHLVL: string;
		npm_package_scripts_lint: string;
		TERM_PROGRAM_VERSION: string;
		npm_package_scripts_dev: string;
		VIPSHOME: string;
		npm_package_private: string;
		npm_package_devDependencies__sveltejs_kit: string;
		npm_config_registry: string;
		ZSH: string;
		GIT_EDITOR: string;
		USER: string;
		NVM_DIR: string;
		LS_COLORS: string;
		npm_package_scripts_check_watch: string;
		COMMAND_MODE: string;
		CONDA_EXE: string;
		PNPM_SCRIPT_SRC_DIR: string;
		SSH_AUTH_SOCK: string;
		__CF_USER_TEXT_ENCODING: string;
		npm_package_devDependencies_postcss: string;
		npm_execpath: string;
		PAGER: string;
		npm_package_devDependencies_svelte: string;
		TMUX: string;
		_CE_CONDA: string;
		LSCOLORS: string;
		npm_config_frozen_lockfile: string;
		PATH: string;
		npm_package_scripts_lint_fix: string;
		MONO_MANAGED_WATCHER: string;
		npm_package_scripts_typecheck: string;
		MONO_GC_PARAMS: string;
		GHOSTTY_SHELL_FEATURES: string;
		npm_package_dependencies_tus_js_client: string;
		__CFBundleIdentifier: string;
		PWD: string;
		npm_package_devDependencies_tailwindcss: string;
		npm_command: string;
		ELEVEN_API_KEY: string;
		npm_package_scripts_preview: string;
		OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE: string;
		npm_package_devDependencies_jsdom: string;
		npm_lifecycle_event: string;
		LANG: string;
		npm_package_name: string;
		npm_package_devDependencies__sveltejs_vite_plugin_svelte: string;
		NODE_PATH: string;
		npm_package_scripts_build: string;
		XPC_FLAGS: string;
		TMUX_PANE: string;
		npm_package_devDependencies_vitest: string;
		npm_package_devDependencies__types_dom_mediacapture_transform: string;
		npm_package_dependencies_idb_keyval: string;
		npm_config_manage_package_manager_versions: string;
		npm_config_node_gyp: string;
		_CE_M: string;
		XPC_SERVICE_NAME: string;
		npm_package_version: string;
		npm_package_devDependencies_autoprefixer: string;
		npm_package_devDependencies_svelte_check: string;
		SHLVL: string;
		HOME: string;
		npm_package_type: string;
		TERMINFO: string;
		npm_package_scripts_test: string;
		npm_package_devDependencies__sveltejs_adapter_vercel: string;
		HOMEBREW_PREFIX: string;
		LOGNAME: string;
		LESS: string;
		CONDA_PYTHON_EXE: string;
		npm_package_devDependencies__sveltejs_adapter_cloudflare: string;
		npm_lifecycle_script: string;
		XDG_DATA_DIRS: string;
		GHOSTTY_BIN_DIR: string;
		COREPACK_ENABLE_AUTO_PIN: string;
		NVM_BIN: string;
		BUN_INSTALL: string;
		npm_config_user_agent: string;
		INFOPATH: string;
		HOMEBREW_CELLAR: string;
		npm_package_devDependencies__playwright_test: string;
		OSLogRateLimit: string;
		CLAUDECODE: string;
		npm_package_scripts_check: string;
		COLORTERM: string;
		npm_package_scripts_test_unit: string;
		npm_node_execpath: string;
		NODE_ENV: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
