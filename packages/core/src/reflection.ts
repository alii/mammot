import {Command} from './command';
import {CommandMetadata, OptionMetadata} from './types';

export enum MetadataKey {
	OPTION = 'mammot:option',
	COMMAND = 'mammot:command',
}

export function addOption(command: Command, metadata: OptionMetadata) {
	const existing = Reflect.getMetadata(MetadataKey.OPTION, command) as
		| OptionMetadata[]
		| undefined;

	Reflect.defineMetadata(
		MetadataKey.OPTION,
		[...(existing ?? []), metadata],
		command,
	);
}

export function readCommand(command: Command) {
	const options = Reflect.getMetadata(MetadataKey.OPTION, command) as
		| OptionMetadata[]
		| undefined;

	if (!options) {
		throw new Error('No options metadata found on Command!');
	}

	// Read name from the constructor (read setName comments in this file)
	const meta = Reflect.getMetadata(MetadataKey.COMMAND, command.constructor) as
		| CommandMetadata
		| undefined;

	if (!meta) {
		throw new Error('No name found for command!');
	}

	return {
		options,
		...meta,
	};
}

export function getParamType(command: Command, index: number, prop = 'run') {
	const data = Reflect.getMetadata('design:paramtypes', command, prop) as
		| unknown[]
		| undefined;

	if (!data) {
		throw new Error(`Could not get reflection types for ${Command.name}`);
	}

	return data[index];
}

export function addCommandData(
	// Command here is the constructor `Function` rather than an instance of the class,
	// so we cannot type this any further unfortunately.
	// eslint-disable-next-line @typescript-eslint/ban-types
	command: Function,
	data: CommandMetadata,
) {
	Reflect.defineMetadata(MetadataKey.COMMAND, data, command);
}
