import {ApplicationCommandOptionData} from 'discord.js';

export type OptionMetadataTypes = Exclude<
	Extract<ApplicationCommandOptionData['type'], string>,
	`SUB_${string}`
>;
