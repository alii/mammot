import 'dotenv/config';
import {Mammot, Command, option} from '@mammot/core';
import {CommandInteraction, VoiceChannel, User} from 'discord.js';

const mammot = Mammot.client({
	intents: [],
});

class MyCommand extends Command {
	public async run(
		interaction: CommandInteraction,
		@option('channel') channel: VoiceChannel,
		@option('user') user: User,
		@option('age', {type: 'INTEGER'}) age: number,
	): Promise<void> {
		console.log({channel, user, age});
		await interaction.reply('pog');
	}
}

void mammot.addCommands([MyCommand]);
