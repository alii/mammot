import 'dotenv/config';
import {Mammot, Command, option, data} from '@mammot/core';
import {CommandInteraction, Role, User, Intents} from 'discord.js';

const mammot = Mammot.client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS,
	],
	developmentGuild: process.env.DEVELOPMENT_GUILD_ID!,
	ready(user) {
		console.log('Ready as', user.username);
	},
});

@data('ratio', 'Command will ratio somebody')
class MyCommand extends Command {
	public async run(
		interaction: CommandInteraction,

		@option('role', {description: 'dsadas'})
		role: Role,

		@option('user', {description: 'The user'})
		user: User,

		@option('age', {description: 'an age', type: 'INTEGER'})
		age: number,
	) {
		await interaction.reply(JSON.stringify({role, user, age}));
	}
}

void mammot.addCommands([MyCommand]).login(process.env.DISCORD_TOKEN);

Mammot.debugCommands(mammot.commands);
