import 'dotenv/config';
import {Mammot, Command, option, data} from '@mammot/core';
import {CommandInteraction, VoiceChannel, User} from 'discord.js';

const mammot = Mammot.client({
	intents: [],
	developmentGuild: '1234567890',
	ready(user) {
		console.log('Ready as', user.username);
	},
});

@data('ratio', 'Command will ratio somebody')
class MyCommand extends Command {
	public async run(
		interaction: CommandInteraction,

		@option('channel')
		channel: VoiceChannel,

		@option('user')
		user: User,

		@option('age', {type: 'INTEGER'})
		age: number,
	) {
		console.log({channel, user, age});
		await interaction.reply('pog');
	}
}

void mammot.addCommands([MyCommand]);

console.log(mammot.commands);
