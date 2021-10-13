import {
	Client as DiscordClient,
	ClientOptions,
	Snowflake,
	ClientUser,
} from 'discord.js';
import {inspect} from 'util';
import {OptionMetadata} from './decorators';
import {Command, ConstructableCommand} from './command';
import {MammotError} from './errors';
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

	private readonly developmentGuildId: Snowflake;
	private readonly options;

	private constructor(options: MammotOptions, private readonly isDev: boolean) {
		const {developmentGuild, ready, ...rest} = options;

		this.options = options;
		this.client = new DiscordClient(rest);
		this.developmentGuildId = developmentGuild;
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
		const mapped = [...this.commands.values()].map(command => {
			const options = command.options.map(option => ({
				...option.config,
				name: option.name,
			}));

			return {
				options,
				name: command.name,
				description: command.description,
			};
		});

		this.client.on('interactionCreate', interaction => {
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

		this.client.once('ready', async () => {
			if (this.isDev) {
				await this.client.application.commands.set(
					mapped,
					this.developmentGuildId,
				);
			} else {
				await this.client.application.commands.set(mapped);
			}

			// Alert user that we are ready
			await this.options.ready(this.client.user);
		});

		return this.client.login(token);
	}
}
