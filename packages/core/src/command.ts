/* eslint-disable no-await-in-loop */
import {CommandInteraction, Role} from 'discord.js';
import {GetAbstractConstructorArgs, OptionMetadata} from './types';
import {Mammot} from './mammot';

export abstract class Command {
	protected readonly mammot: Mammot;

	public constructor(mammot: Mammot) {
		this.mammot = mammot;
	}

	public async resolveOptions(
		interaction: CommandInteraction,
		metadatum: OptionMetadata[],
	) {
		// Technically, this shouldn't happen as this check
		// runs in mammot.ts too
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
					const channel = interaction.options.getChannel(...args);

					const fetched = channel
						? await interaction.client.channels.fetch(channel.id)
						: null;

					results.push(fetched);
					break;
				}

				case 'USER': {
					results.push(interaction.options.getUser(...args));
					break;
				}

				case 'ROLE': {
					const role = interaction.options.getRole(...args);

					const fetched =
						role instanceof Role
							? role
							: role
							? interaction.guildId
								? await interaction.client.guilds
										.fetch(interaction.guildId)
										.then(async guild => guild.roles.fetch(role.id))
								: null
							: null;

					results.push(fetched);

					break;
				}

				case 'MENTIONABLE': {
					const mention = interaction.options.getMentionable(...args);

					if (!mention) {
						results.push(mention);
						break;
					}

					if ('hoist' in mention && interaction.guild) {
						const role = await interaction.guild.roles.fetch(mention.id);
						results.push(role);
					} else if ('id' in mention) {
						const user = await interaction.client.users.fetch(mention.id);
						results.push(user);
					} else {
						results.push(null);
					}

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
