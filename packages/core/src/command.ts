import {CommandInteraction} from 'discord.js';
import {OptionMetadata} from '.';
import {Mammot} from './mammot';
import {GetAbstractConstructorArgs} from './utils';

export abstract class Command {
	public static resolveMetadata(
		interaction: CommandInteraction,
		metadatum: OptionMetadata[],
	) {
		const results: unknown[] = [];

		for (const metadata of metadatum) {
			const args = [metadata.name, metadata.config.required ?? false] as const;

			switch (metadata.config.type) {
				case 'STRING': {
					results.push(interaction.options.getString(...args));
					break;
				}

				case 'BOOLEAN': {
					results.push(interaction.options.getBoolean(...args));
					break;
				}

				case 'CHANNEL': {
					results.push(interaction.options.getChannel(...args));
					break;
				}

				case 'USER': {
					results.push(interaction.options.getUser(...args));
					break;
				}

				case 'MENTIONABLE': {
					results.push(interaction.options.getMentionable(...args));
					break;
				}

				case 'INTEGER': {
					results.push(interaction.options.getInteger(...args));
					break;
				}

				case 'NUMBER': {
					results.push(interaction.options.getNumber(...args));
					break;
				}

				default: {
					throw new Error('Unsupported metadata type');
				}
			}
		}

		return results;
	}

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
