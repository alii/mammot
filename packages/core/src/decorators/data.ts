import {Except} from 'type-fest';
import {Command} from '../command';
import {addCommandData} from '../reflection';
import {CommandMetadata} from '../types';

export function data(
	name: string,
	description: string,
	config: Partial<Except<CommandMetadata, 'name' | 'description'>> = {},
): ClassDecorator {
	return target => {
		const isCommand = target.prototype instanceof Command;

		if (!isCommand) {
			throw new TypeError(
				'You can only use @name() on a class that extends Command!',
			);
		}

		addCommandData(target, {
			name,
			description,
			...config,
		});
	};
}
