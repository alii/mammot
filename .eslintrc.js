module.exports = {
	extends: [
		'marine',
		'marine/node',
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'xo',
		'xo-typescript',
		'xo-react',
		'marine/react',
	],
	rules: {
		'@typescript-eslint/no-implied-eval': 'off',
		'operator-linebreak': 'off',
		'@typescript-eslint/indent': 'off',
	},
};
