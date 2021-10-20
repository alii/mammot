import {Inhibitor} from '../types/inhibitors';
import {GuildMember} from 'discord.js';
export function channel(id: string): Inhibitor {
	return interaction => interaction.channel?.id === id;
}

export function role(id: string): Inhibitor {
	return interaction => {
		if (interaction.member instanceof GuildMember) {
			return Boolean(interaction.member.roles.cache.get(id));
		}

		return false;
	};
}
