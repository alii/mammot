import {Command} from './command';
import {OptionMetadata} from './decorators';

export enum MetadataKey {
	OPTION = 'discord:reflect:option',
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
