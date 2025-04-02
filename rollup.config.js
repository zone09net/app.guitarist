export default [
	{
		input: './.dist/app.guitarist/src/app.guitarist.js',
		output: {
			module: 'es',
			file: './.rollup/app.guitarist.js',
			paths: {
				'@zone09.net/foundation': './lib.foundation.js',
				'@zone09.net/paperless': './lib.paperless.js',
				'@zone09.net/hac': './lib.hac.js',
				'@extlib/matter': './extlib/matter-0.20.0.min.js',
				'@extlib/poly-decomp': './extlib/poly-decomp-0.2.1.min.js',
				'@extlib/intersects': './extlib/intersects-2.7.1.min.js',
				'@extlib/tone': './extlib/tone-14.8.49.min.js'
			 }
		},
	},
]
