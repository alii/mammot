import {CommandInteraction} from 'discord.js';
import {Client} from './client';
import {GetConstructorArgs} from './utils';

export abstract class Command {
	protected readonly client: Client;

	public constructor(client: Client) {
		this.client = client;
	}

	public abstract run(
		interaction: CommandInteraction,
		...args: unknown[]
	): Promise<void>;
}

export type ConstructableCommand = new (
	...args: GetConstructorArgs<typeof Command>
) => Command;
