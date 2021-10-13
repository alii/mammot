module.exports = {
	extends: [
		'marine/node',
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'xo',
		'xo-typescript',
	],
	rules: {
		'@typescript-eslint/no-implied-eval': 'off',
		'operator-linebreak': 'off',
		'@typescript-eslint/indent': 'off',
	},
};
