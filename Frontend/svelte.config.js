import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter()
	},
	methodOverride: {
		allowed: ['PUT', 'PATCH', 'DELETE']
	}
};

export default config;
