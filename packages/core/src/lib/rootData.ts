import {readFileSync} from 'fs';
import {dirname, join} from 'path';

export const rootData = () => {
	const cwd = process.cwd();
	/* eslint-disable @typescript-eslint/no-unsafe-argument */
	/* eslint-disable @typescript-eslint/no-unsafe-assignment */
	const file = JSON.parse(readFileSync(join(cwd, 'package.json'), 'utf8'));
	return dirname(join(cwd, file.main));
};
