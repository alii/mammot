import {
	ApplicationCommandOptionData,
	GuildChannel,
	GuildMember,
	User,
} from 'discord.js';
import {Except} from 'type-fest';
import {Command} from './command';
import {addOption, getParamType, setName} from './reflection';

type OptionMetadataTypes = Extract<
	ApplicationCommandOptionData['type'],
	string
>;

export interface OptionConfig {
	required: boolean;
	description: string;
	type: OptionMetadataTypes;

	/**
	 * Some types like MENTIONABLE cannot be inferred
	 * however they will throw a TypeError mismatch when used.
	 *
	 * By enabling this flag, you will be able to force these
	 * option types and not have the error thrown.
	 *
	 * @warning
	 */
	force?: boolean;
}

export interface OptionMetadata {
	name: string;
	index: number;
	// Mark .type as required
	config: Partial<OptionConfig> & Pick<OptionConfig, 'type'>;
}

/**
 * A wrapper for @option that enables force mode on a type
 * @param name The name of the option
 * @param config The config for this option
 * @returns A property decorator
 */
export function forced(
	name: string,
	config: Except<Partial<OptionConfig>, 'force'> = {},
) {
	return option(name, {
		...config,
		force: true,
	});
}

/**
 * Build an option decorator
 * @param name The name of the option
 * @param config The config for this option
 * @returns A property decorator
 */
export function option(
	name: string,
	config: Partial<OptionConfig> = {},
): ParameterDecorator {
	return (target, property, index) => {
		if (property !== 'run') {
			throw new Error(
				`The @option() decorator can only be used on the .run method. You used it on ${property.toString()}`,
			);
		}

		if (!(target instanceof Command)) {
			throw new Error(
				`You can only use @option() on a class extending Command! You used ${target.constructor.name}`,
			);
		}

		const type = getParamType(target, index);

		let chosenType: OptionMetadataTypes;

		switch (true) {
			case type === String: {
				chosenType = 'STRING';
				break;
			}

			case type === Boolean: {
				chosenType = 'BOOLEAN';
				break;
			}

			case type === Number: {
				if (!config.type) {
					throw new TypeError(
						'You must specify a type for numbers in the config!',
					);
				}

				if (!['NUMBER', 'INTEGER'].includes(config.type)) {
					throw new TypeError(
						`Number type must be either NUMBER or INTEGER. Received ${config.type}`,
					);
				}

				chosenType = config.type;
				break;
			}

			case type === User || type === GuildMember: {
				chosenType = 'USER';
				break;
			}

			// Catchall case for all types of guild channel
			case type instanceof GuildChannel.constructor: {
				chosenType = 'CHANNEL';
				break;
			}

			default: {
				throw new TypeError('Unsupported data type.');
			}
		}

		if (config.type && chosenType !== config.type && !config.force) {
			throw new TypeError(
				`Type mismatch. Found ${config.type} in the config, but inferred ${chosenType}! Enable force mode in if this was a mistake.`,
			);
		}

		addOption(target, {
			name,
			index,
			config: {
				...config,
				type: chosenType,
			},
		});
	};
}

export function name(val: string): ClassDecorator {
	return target => {
		const isCommand = target.prototype instanceof Command;

		if (!isCommand) {
			throw new TypeError(
				'You can only use @name() on a class that extends Command!',
			);
		}

		setName(target, val);
	};
}
