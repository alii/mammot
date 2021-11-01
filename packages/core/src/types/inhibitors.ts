import {CommandInteraction, PermissionString} from 'discord.js';

/**
 * Inhibitor or permission flag type to prevent execution if a condition is not met
 */
export type Inhibitor =
	| PermissionString
	| ((interaction: CommandInteraction) => Promise<void> | void);
