import {
	Client as DiscordClient,
	ClientOptions,
	ClientUser,
	CommandInteraction,
	Snowflake,
} from 'discord.js';
import {inspect} from 'util';
import {OptionMetadata} from './types';
import {Command, ConstructableCommand} from './command';
import {MammotError} from './errors';
import {readCommand} from './reflection';
import {StandardEmbed} from './structs/standard-embed';

export interface MammotOptions extends ClientOptions {
	developmentGuild: Snowflake;

	onReady?(user: ClientUser): Promise<void> | void;

	/**
	 * Method that returns either a string to reply to the interaction as, or null meaning that
	 * the error message was handled in this method
	 * @param interaction The command interaction
	 * @param error The error that was thrown
	 */
	onError?(
		interaction: CommandInteraction,
		error: unknown,
	): Promise<string | null>;
}

interface ParsedCommand {
	name: string;
	description: string;
	command: Command;
	options: OptionMetadata[];
}

/**
 * The client for the bot.
 */
export class Mammot {
	public static client(options: MammotOptions & {dev?: boolean}) {
		const {dev = process.env.NODE_ENV === 'development', ...rest} = options;
		return new Mammot(rest, dev);
	}

	public static debugCommands(commands: Mammot['commands']) {
		const result = inspect(
			new Map(
				[...commands.entries()].map(entry => {
					const [name, {command, ...rest}] = entry;
					return [name, rest] as const;
				}),
			),
			true,
			10,
			true,
		);

		console.log(result);
	}

	public readonly commands: Map<string, ParsedCommand> = new Map();
	public readonly client: DiscordClient<true>;
	private readonly options;

	private constructor(options: MammotOptions, private readonly isDev: boolean) {
		this.options = options;
		this.client = new DiscordClient(options);
	}

	/**
	 * Registers a command.
	 * @param commands Commands to register.
	 * @returns The client.
	 */
	public addCommands<
		// Guarantee at least one item in array with these generics
		V extends ConstructableCommand,
		T extends readonly [V, ...V[]],
	>(commands: T) {
		const mapped = commands.map(Cmd => new Cmd(this));

		for (const command of mapped) {
			const {name, description, options} = readCommand(command);

			this.commands.set(name, {
				description,
				name,
				options,
				command,
			});
		}

		return this;
	}

	/**
	 * Load all interactions & login to client.
	 * @param token Token of your Bot to login with.
	 * @returns The token of the bot account used.
	 */
	public async login(token?: string) {
		const mapped = [...this.commands.values()].map(command => {
			const options = command.options.reverse().map(option => ({
				...option.config,
				name: option.name,
			}));

			return {
				options,
				name: command.name,
				description: command.description,
			};
		});

		this.client.on('interactionCreate', async interaction => {
			if (!interaction.isCommand()) {
				return;
			}

			const found = this.commands.get(interaction.commandName);

			if (!found) {
				return;
			}

			const {command, options} = found;

			try {
				await command.run(
					interaction,
					...Command.resolveMetadata(interaction, options),
				);
			} catch (error: unknown) {
				let message;

				if (this.options.onError) {
					const value = await this.options.onError(interaction, error);

					if (value) {
						message = value;
					} else {
						return;
					}
				} else if (error instanceof MammotError) {
					message = error.message;
				}

				message ??= 'Something went wrong.';

				if (!(error instanceof MammotError)) {
					console.warn(error);
				}

				const embed = await new StandardEmbed(interaction.user).build();
				embed.setDescription(message);

				void interaction.reply({
					ephemeral: true,
					embeds: [embed],
				});
			}
		});

		this.client.once('ready', async () => {
			if (this.isDev) {
				await this.client.application.commands.set(
					mapped,
					this.options.developmentGuild,
				);
			} else {
				await this.client.application.commands.set(mapped);
			}

			// Alert user that we are ready
			await this.options.onReady?.(this.client.user);
		});

		return this.client.login(token);
	}
}
