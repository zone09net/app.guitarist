export default [
	{
		input: './.dist/app.guitarist/src/app.guitarist.js',
		output: {
			format: 'es',
			file: './.rollup/app.guitarist.js',
			paths: {
				'@zone09.net/foundation': './lib.foundation.js',
				'@zone09.net/paperless': './lib.paperless.js',
				'@zone09.net/hac': './lib.hac.js',
				'@extlib/tone': './extlib/./extlib/tone-14.8.49.min.js',
			 }
		},
	},
]
