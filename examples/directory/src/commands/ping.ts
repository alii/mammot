import {Command, config} from '@mammot/core';
import {CommandInteraction} from 'discord.js';

@config('ping', {
	description: 'ping pong!',
})
export default class Ping extends Command {
	public async run(interaction: CommandInteraction) {
		await interaction.reply({
			content: ':ninja:',
			ephemeral: true,
		});
	}
}
