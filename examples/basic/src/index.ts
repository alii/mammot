import 'dotenv/config';
import {Mammot, Command, option, name} from '@mammot/core';
import {CommandInteraction, VoiceChannel, User} from 'discord.js';

const mammot = Mammot.client({
	intents: [],
});

@name('ratio')
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
