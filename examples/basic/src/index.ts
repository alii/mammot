import 'dotenv/config';
import {
	Command,
	config,
	Mammot,
	option,
	forced,
	Mentionable,
} from '@mammot/core';
import {CommandInteraction, Intents, User} from 'discord.js';

const mammot = Mammot.client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS,
	],

	developmentGuild: process.env.DEVELOPMENT_GUILD_ID!,

	async onError(interaction, error) {
		mammot.warn(error);
		return Promise.resolve('Something went wrong!');
	},

	onReady(user) {
		mammot.success(`Logged into client as ${user.username}`);
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
