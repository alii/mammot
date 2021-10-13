import {GuildChannel} from 'discord.js';
import {Command} from './command';
import {addOption, getParamType} from './reflection';

export interface OptionConfig {
	required: boolean;
	description: string;
}

export interface OptionMetadata {
	config: Partial<OptionConfig>;
	index: number;
	type: 'STRING' | 'INTEGER' | 'CHANNEl';
}

/**
 *
 * @param required If this option is required or not
 * @returns A decorator function that can be used to decorate an argument on the run method
 */
export function option(config: Partial<OptionConfig> = {}): ParameterDecorator {
	return (target, property, index) => {
		if (property !== 'run') {
			throw new Error(
				`The @option() decorator can only be used on the .run method. You used it on \`${property.toString()}\``,
			);
		}

		if (!(target instanceof Command)) {
			throw new Error(
				`You can only use @option() on a class extending Command! You used \`${target.constructor.name}\``,
			);
		}

		const type = getParamType(target, index);

		let result;
		switch (true) {
			case type === String: {
				result = 'STRING' as const;
				break;
			}

			case type === Number: {
				result = 'INTEGER' as const;
				break;
			}

			case type instanceof GuildChannel.constructor: {
				result = 'CHANNEL' as const;
				break;
			}

			default: {
				throw new Error('Unsupported data type.');
			}
		}

		addOption(target, {
			config,
			index,
			type: result,
		});
	};
}
