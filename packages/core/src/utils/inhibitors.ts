import {Inhibitor} from '../types/inhibitors';

export function channel(id: string): Inhibitor {
	return interaction => interaction.channel?.id === id;
}
