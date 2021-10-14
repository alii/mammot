import {ApplicationCommandOptionData} from 'discord.js';
import {Except} from 'type-fest';
import {OptionMetadata} from './OptionMetadata';

export type OptionConfig = Except<
	Except<ApplicationCommandOptionData, 'name'> & Pick<OptionMetadata, 'force'>,
	'type'
> & {type?: ApplicationCommandOptionData['type']};
