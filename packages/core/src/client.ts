import {Client as DiscordClient, ClientOptions} from 'discord.js';
import {Command, ConstructableCommand} from './command';
import {MetadataKey} from './reflection';

/**
 * The client for the bot.
 */
export class Client {
	public readonly commands: Command[] = [];
	private readonly _client: DiscordClient<true>;

	public constructor(options: ClientOptions) {
		this._client = new DiscordClient(options);
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
}
