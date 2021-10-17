import {
	Command,
	config,
	MammotError,
	option,
	forced,
	Mentionable,
} from '@mammot/core';
import {CommandInteraction, User} from 'discord.js';

const codeblock = (v: string) => `\`\`\`${v}\`\`\``;

@config('ratio', {description: 'Command will ratio somebody'})
export default class Ratio extends Command {
	public async run(
		interaction: CommandInteraction,

		// Required arguments go before optional arguments
		@option('user', {
			description: 'The user to ratio',
			required: true,
		})
		user: User,

		@forced('mention', {
			description: 'Just a placeholder value',
			type: 'MENTIONABLE',
			required: true,
		})
		mention: Mentionable,

		// Optional values can safely use the ? operator in `param?: type`
		@option('amount', {
			description: 'Another placeholder value',
			type: 'INTEGER',
		})
		amount?: number,
	) {
		if (Math.random() > 0.8) {
			// Demonstration of throwing errors
			// this error will be displayed to the user as it is as MammotError.
			// errors that are *not* MammotError will not have their message
			// displayed to the user.
			throw new MammotError('Something went wrong! Oops..');
		}

		await interaction.channel?.send(`<@${user.id}> get ratioeddd`);

		await interaction.reply({
			ephemeral: true,
			content: codeblock(JSON.stringify({amount, mention}, null, 2)),
		});
	}
}
