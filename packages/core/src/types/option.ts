import {ApplicationCommandOptionData} from 'discord.js';
import {Except} from 'type-fest';

export type OptionMetadataTypes = Exclude<
	Extract<ApplicationCommandOptionData['type'], string>,
	`SUB_${string}`
>;

export interface OptionMetadata {
	name: string;
	index: number;
	required?: boolean;

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

export type OptionConfig = Except<
	Except<ApplicationCommandOptionData, 'name'> & Pick<OptionMetadata, 'force'>,
	'type'
> & {type?: OptionMetadataTypes};
