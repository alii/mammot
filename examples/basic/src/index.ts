import {Mammot, Command, option} from '@mammot/core';
import {CommandInteraction, VoiceChannel} from 'discord.js';
import {setTimeout} from 'timers/promises';

const mammot = Mammot.client({
	intents: [],
});

class MyCommand extends Command {
	public async run(
		interaction: CommandInteraction,
		@option() name: string,
		@option() age: VoiceChannel,
	): Promise<void> {
		await setTimeout(3000);
		console.log({name, age});
	}
}

void mammot.addCommands([MyCommand]);
