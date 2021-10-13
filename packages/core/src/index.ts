import { Client as DiscordClient, ClientOptions } from "discord.js";

export class Client {
	private readonly _client: DiscordClient;

	constructor(options: ClientOptions) {
		this._client = new DiscordClient(options);
	}

	public get client() {
		return this._client;
	}
}
