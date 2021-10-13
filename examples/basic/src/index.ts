import {Client, Command, option} from '@reflect/core';
import {CommandInteraction} from 'discord.js';
import {setTimeout} from 'timers/promises';

const client = new Client({
	intents: [],
});

class MyCommand extends Command {
	public async run(
		interaction: CommandInteraction,
		@option({description: 'nuts'}) name: string,
		@option() age: number,
	): Promise<void> {
		await setTimeout(3000);
		console.log({name, age});
	}
}

client.addCommands([MyCommand]);
