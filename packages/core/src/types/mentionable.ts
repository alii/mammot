import {CommandInteraction} from 'discord.js';

/**
 * Mentionable type. Requires force mode to be enabled on the decorator
 */
export type Mentionable = NonNullable<
	ReturnType<CommandInteraction['options']['getMentionable']>
>;
