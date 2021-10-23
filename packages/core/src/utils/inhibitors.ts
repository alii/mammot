import {Inhibitor} from '../types/inhibitors';
import {MammotError} from '../errors';
import {GuildMember} from 'discord.js';
import {ApiErrors} from '../types/errors';

<<<<<<< HEAD
export const adminOnly: Inhibitor = (interaction: CommandInteraction) =>
	String(interaction.memberPermissions?.has('ADMINISTRATOR')).toLowerCase() ===
	'true';
=======
export function user(id: string | string[]): Inhibitor {
	return interaction => {
		if (Array.isArray(id)) {
			if (!id.includes(interaction.user.id)) {
				throw new MammotError(ApiErrors.NO_PERMISSION);
			}
		}

		if (typeof id === 'string') {
			if (!(interaction.user.id === id)) {
				throw new MammotError(ApiErrors.NO_PERMISSION);
			}
		}
	};
}

export function channel(id: string): Inhibitor {
	return interaction => {
		if (!(interaction.channel?.id === id)) {
			throw new MammotError(ApiErrors.INCORRECT_CHANNEL);
		}
	};
}

export function role(id: string): Inhibitor {
	return interaction => {
		if (interaction.member instanceof GuildMember) {
			if (!interaction.member.roles.cache.has(id)) {
				throw new MammotError(ApiErrors.INCORRECT_ROLE);
			}
		}
	};
}

export function guildOnly(): Inhibitor {
	return interaction => {
		if (!(interaction.channel?.type === 'GUILD_TEXT')) {
			throw new MammotError(ApiErrors.GUILD_ONLY);
		}
	};
}

export function dmOnly(): Inhibitor {
	return interaction => {
		if (interaction.channel?.type !== undefined) {
			throw new MammotError(ApiErrors.DM_ONLY);
		}
	};
}
>>>>>>> master
