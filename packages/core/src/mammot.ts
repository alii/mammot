import {Client as DiscordClient, ClientOptions} from 'discord.js';
import {Command, ConstructableCommand} from './command';
import {MetadataKey} from './reflection';

/**
 * The client for the bot.
 */
export class Mammot<Ready extends boolean = boolean> {
	public static client(options: ClientOptions) {
		return new Mammot<true>(options);
	}

	public readonly commands: Command[] = [];

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
		this.commands.push(...mapped);

		for (const command of mapped) {
			const metadata = Reflect.getMetadata(
				MetadataKey.OPTION,
				command,
			) as unknown;

			console.log(metadata);
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
		return this._client.login(token);
	}
}
