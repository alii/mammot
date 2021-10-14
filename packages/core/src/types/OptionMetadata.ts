import {ApplicationCommandOptionData} from 'discord.js';
import {Except} from 'type-fest';

export interface OptionMetadata {
	name: string;
	index: number;
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
	config: Except<ApplicationCommandOptionData, 'name'>;
}
