import 'dotenv/config';
import {Mammot, Command, option, data} from '@mammot/core';
import {CommandInteraction, Role, User} from 'discord.js';

const mammot = Mammot.client({
	intents: [],
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
		console.log({role, user, age});
		await interaction.reply('pog');
	}
}

void mammot.addCommands([MyCommand]).login(process.env.DISCORD_TOKEN);

Mammot.debugCommands(mammot.commands);
