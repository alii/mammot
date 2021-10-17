
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {readFileSync} from 'fs';
import {dirname, join} from 'path';

export const rootData = () => {
	const cwd = process.cwd();
	const file = JSON.parse(readFileSync(join(cwd, 'package.json'), 'utf8'));
	return dirname(join(cwd, file.main));
};
