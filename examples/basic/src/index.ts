import {Mammot, Command, option} from '@mammot/core';
import {CommandInteraction, VoiceChannel, User} from 'discord.js';
import {setTimeout} from 'timers/promises';

const mammot = Mammot.client({
	intents: [],
});

class MyCommand extends Command {
	public async run(
		interaction: CommandInteraction,
		@option('channel') channel: VoiceChannel,
		@option('user') user: User,
		@option('age', {type: 'INTEGER'})
		age: number,
	): Promise<void> {
		await setTimeout(3000);
		console.log({channel, user, age});
	}
}

void mammot.addCommands([MyCommand]);
