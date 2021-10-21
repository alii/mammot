import {Inhibitor} from '../types/inhibitors';
import {GuildMember} from 'discord.js';

export function user(id: string | string[]): Inhibitor {
	return interaction => {
		if (Array.isArray(id)) {
			return id.includes(interaction.user.id);
		}

		if (typeof id === 'string') {
			return interaction.user.id === id;
		}

		return false;
	};
}

export function channel(id: string): Inhibitor {
	return interaction => interaction.channel?.id === id;
}

export function role(id: string): Inhibitor {
	return interaction => {
		if (interaction.member instanceof GuildMember) {
			return Boolean(interaction.member.roles.cache.has(id));
		}

		return false;
	};
}

export function guildOnly(): Inhibitor {
	return interaction => interaction.channel?.type === 'GUILD_TEXT';
}

export function dmOnly(): Inhibitor {
	return interaction => interaction.channel?.type === 'DM';
}
