import {Mammot, Command, option} from '@mammot/core';
import {CommandInteraction, VoiceChannel, User} from 'discord.js';
import {setTimeout} from 'timers/promises';

const mammot = Mammot.client({
	intents: [],
});

class MyCommand extends Command {
	public async run(
		interaction: CommandInteraction,
		@option() name: string,
		@option() channel: VoiceChannel,
		@option() user: User,
	): Promise<void> {
		await setTimeout(3000);
		console.log({name, channel, user});
	}
}

void mammot.addCommands([MyCommand]);
