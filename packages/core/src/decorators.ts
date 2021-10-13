import {
	ApplicationCommandOptionData,
	GuildChannel,
	GuildMember,
	User,
} from 'discord.js';
import {Command} from './command';
import {addOption, getParamType} from './reflection';

export interface OptionConfig {
	required: boolean;
	description: string;
	type: OptionMetadataTypes;
}

type OptionMetadataTypes = Extract<
	ApplicationCommandOptionData['type'],
	string
>;

export interface OptionMetadata {
	name: string;
	index: number;
	// Mark .type as required
	config: Partial<OptionConfig> & Pick<OptionConfig, 'type'>;
}

/**
 * Build an option decorator
 * @param required If this option is required or not
 * @returns A decorator function that can be used to decorate an argument on the run method
 */
export function option(
	name: string,
	config: Partial<OptionConfig> = {},
): ParameterDecorator {
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

		let result: OptionMetadata['config']['type'];

		switch (true) {
			case type === String: {
				result = 'STRING';
				break;
			}

			case type === Boolean: {
				result = 'BOOLEAN';
				break;
			}

			case type === Number: {
				if (!config.type) {
					throw new Error('You must specify a type for numbers in the config!');
				}

				if (!['NUMBER', 'INTEGER'].includes(config.type)) {
					throw new Error(
						`Number type must be either \`NUMBER\` or \`INTEGER\`. Received ${config.type}`,
					);
				}

				result = config.type;
				break;
			}

			case type === User || type === GuildMember: {
				result = 'USER';
				break;
			}

			// Catchall case for all types of guild channel
			case type instanceof GuildChannel.constructor: {
				result = 'CHANNEL';
				break;
			}

			default: {
				throw new Error('Unsupported data type.');
			}
		}

		addOption(target, {
			name,
			config: {
				...config,
				type: result,
			},
			index,
		});
	};
}
