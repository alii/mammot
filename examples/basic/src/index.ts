import 'dotenv/config';
import {
	Command,
	config,
	Mammot,
	MammotError,
	option,
	forced,
	Mentionable,
	ApiErrors,
} from '@mammot/core';
import {CommandInteraction, Intents, User} from 'discord.js';
import {green} from 'colorette';

const mammot = Mammot.client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS,
	],

	developmentGuild: process.env.DEVELOPMENT_GUILD_ID!,

	async onError(interaction, error) {
		console.warn(error);
		return Promise.resolve('Something went wrong!');
	},

	onReady(user) {
		console.log(green('ready -'), `Logged into client as ${user.username}`);
	},
});

const codeblock = (v: string) => `\`\`\`${v}\`\`\``;

@config('ratio', {description: 'Command will ratio somebody'})
class Ratio extends Command {
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
			throw new MammotError(ApiErrors.UNKNOWN);
		}

		await interaction.channel?.send(`<@${user.id}> get ratioeddd`);

		await interaction.reply({
			ephemeral: true,
			content: codeblock(JSON.stringify({amount, mention}, null, 2)),
		});
	}
}

@config('ping', {
	description: 'ping pong!',
})
class Ping extends Command {
	public async run(interaction: CommandInteraction) {
		await interaction.reply({
			content: ':ninja:',
			ephemeral: true,
		});
	}
}

void mammot.addCommands([Ratio, Ping]).login(process.env.DISCORD_TOKEN);
