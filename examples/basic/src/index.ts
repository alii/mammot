import 'dotenv/config';
import {Command, config, Mammot, MammotError, option} from '@mammot/core';
import {CommandInteraction, Intents, Role, User} from 'discord.js';
import {green} from 'colorette';

const mammot = Mammot.client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS,
	],
	developmentGuild: process.env.DEVELOPMENT_GUILD_ID!,
	onReady(user) {
		console.log(green('ready -'), `Logged into client as ${user.username}`);
	},
});

@config('ratio', {description: 'Command will ratio somebody'})
class Ratio extends Command {
	public async run(
		interaction: CommandInteraction,

		// Required arguments go before optional arguments
		@option('user', {description: 'The user', required: true})
		user: User,

		@option('role', {description: 'dsadas'})
		role?: Role,

		@option('amount', {
			description: 'Amount of times to ratio',
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
			content: `Other data: ${amount ?? 'no amount'}, ${
				role?.name ?? 'no role'
			}`,
		});
	}
}

void mammot.addCommands([Ratio]).login(process.env.DISCORD_TOKEN);
