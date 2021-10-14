import {Inhibitor} from './inhibitors';

export interface CommandMetadata {
	name: string;
	description: string;
	defaultPermission?: boolean;
	inhibitors?: Inhibitor[];
}
