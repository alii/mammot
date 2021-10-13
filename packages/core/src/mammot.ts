import {
	Client as DiscordClient,
	ClientOptions,
	Snowflake,
	ClientUser,
	ApplicationCommandDataResolvable,
	ApplicationCommandOptionData,
} from 'discord.js';
import {inspect} from 'util';
import {OptionMetadata} from '.';
import {Command, ConstructableCommand} from './command';
import {MammotError} from './errots';
import {readCommand} from './reflection';

export interface MammotOptions extends ClientOptions {
	developmentGuild: Snowflake;
	ready(user: ClientUser): Promise<void> | void;
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
					const [name, cmd] = entry;
					const {command, ...rest} = cmd;
					return [name, rest] as const;
				}),
			),
			true,
			10,
		);

		console.log(result);
	}

	public readonly commands: Map<string, ParsedCommand> = new Map();

	public readonly client: DiscordClient<true>;
	private readonly developmentGuild;

	private constructor(options: MammotOptions, isDev: boolean) {
		const {developmentGuild, ready, ...rest} = options;
		this.client = new DiscordClient(rest);

		this.developmentGuild = developmentGuild;

		const mapped = [...this.commands.values()].map(command => {
			const options = command.options.map(option => {
				const value: ApplicationCommandOptionData = {
					...option.config,
					name: option.name,
				};

				return value;
			});

			const result: ApplicationCommandDataResolvable = {
				options,
				name: command.name,
				description: command.description,
			};

			return result;
		});

		this.client.once('ready', async () => {
			await this.client.application.commands.set(mapped);

			// Alert user that we are ready
			await ready(this.client.user);
		});
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

	public async login(token?: string) {
		this.client.on('interaction', interaction => {
			if (!interaction.isCommand()) {
				return;
			}

			const found = this.commands.get(interaction.commandName);

			if (!found) {
				return;
			}

			const {command, options} = found;

			try {
				void command.run(
					interaction,
					...Command.resolveMetadata(interaction, options),
				);
			} catch (error: unknown) {
				const message =
					error instanceof MammotError
						? error.message
						: 'Something went wrong!';

				void interaction.reply({
					ephemeral: true,
					content: message,
				});
			}
		});

		return this.client.login(token);
	}
}
