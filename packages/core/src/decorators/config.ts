import {Except} from 'type-fest';
import {Command} from '../command';
import {addCommandData} from '../reflection';
import {CommandMetadata} from '../types';

/**
 * Provides metadata for a command's config
 * @param name Name of this command
 * @param config Config for the command
 * @returns A class decorator
 */
export function config(
	name: string,
	config: Except<CommandMetadata, 'name'>,
): ClassDecorator {
	return target => {
		const isCommand = target.prototype instanceof Command;

		if (!isCommand) {
			throw new TypeError(
				'You can only use @name() on a class that extends Command!',
			);
		}

		const metadata: CommandMetadata = {
			name,
			...config,
		};

		addCommandData(target, metadata);
	};
}
