import {CommandInteraction} from 'discord.js';
import {GetAbstractConstructorArgs, OptionMetadata} from './types';
import {Mammot} from './mammot';

export abstract class Command {
	protected readonly mammot: Mammot;

	public constructor(mammot: Mammot) {
		this.mammot = mammot;
	}

	public resolveMetadata(
		interaction: CommandInteraction,
		metadatum: OptionMetadata[],
	) {
		if (metadatum.length + 1 !== this.run.length) {
			throw new Error(
				`You have too many arguments in the ${
					this.constructor.name
				} command. Found ${
					this.run.length
				} arguments defined in the .run method but expected ${
					metadatum.length + 1
				} (${metadatum.length} options).`,
			);
		}

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

				case 'ROLE': {
					results.push(interaction.options.getRole(...args));
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

		// Map null values to undefined to make optional
		// values undefined rather than null to maintain
		// type-safety
		return results.map(value => {
			if (value === null) {
				return undefined;
			}

			return value;
		});
	}

	public abstract run(
		interaction: CommandInteraction,
		...args: unknown[]
	): Promise<void>;
}

export type ConstructableCommand = new (
	...args: GetAbstractConstructorArgs<typeof Command>
) => Command;
