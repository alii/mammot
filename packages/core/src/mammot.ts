import {Client as DiscordClient, ClientOptions} from 'discord.js';
import {OptionMetadata} from '.';
import {Command, ConstructableCommand} from './command';
import {readCommand} from './reflection';

interface ParsedCommand {
	name: string;
	command: Command;
	options: OptionMetadata[];
}

/**
 * The client for the bot.
 */
export class Mammot<Ready extends boolean = boolean> {
	public static client(options: ClientOptions) {
		return new Mammot<true>(options);
	}

	public readonly commands: Map<string, ParsedCommand> = new Map();

	public readonly on;
	public readonly off;

	private readonly _client: DiscordClient<Ready>;

	private constructor(options: ClientOptions) {
		this._client = new DiscordClient<Ready>(options);
		this.on = this._client.on;
		this.off = this._client.off;
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
			const {name, options} = readCommand(command);

			this.commands.set(name, {
				name,
				options,
				command,
			});
		}

		return this;
	}

	/**
	 * Gets the client.
	 */
	public get client() {
		return this._client;
	}

	public async login(token?: string) {
		this.on('interaction', interaction => {
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
			} catch {
				// Lol
			}
		});

		return this._client.login(token);
	}
}
