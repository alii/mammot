module.exports = {
	extends: [
		'marine',
		'marine/node',
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'marine/react',
		'xo',
		'xo-typescript',
		'xo-react',
	],
	rules: {
		'@typescript-eslint/no-implied-eval': 'off',
		'operator-linebreak': 'off',
		'@typescript-eslint/indent': 'off',
		'@typescript-eslint/explicit-member-accessibility': 'off'
	},
};
