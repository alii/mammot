import {CommandInteraction} from 'discord.js';
import {Mammot} from './mammot';
import {GetAbstractConstructorArgs} from './utils';

export abstract class Command {
	protected readonly mammot: Mammot;

	public constructor(mammot: Mammot) {
		this.mammot = mammot;
	}

	public abstract run(
		interaction: CommandInteraction,
		...args: unknown[]
	): Promise<void>;
}

export type ConstructableCommand = new (
	...args: GetAbstractConstructorArgs<typeof Command>
) => Command;
