import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		alias: {
			$components: 'src/lib/components',
			$types: 'src/lib/types',
			$data: 'src/lib/data',
			$utils: 'src/lib/utils',
			$stores: 'src/lib/stores'
		}
	}
};

export default config;
