import {MessageEmbed, MessageEmbedOptions, User} from 'discord.js';

export class StandardEmbed extends MessageEmbed {
	public constructor(
		private readonly user: User,
		data?: MessageEmbed | MessageEmbedOptions,
	) {
		super(data);
	}

	public async build() {
		const hex = '#2f3136';
		await this.user.fetch(true);

		this.setTimestamp()
			.setColor(hex)
			.setAuthor(
				this.user.tag,
				this.user.avatarURL({size: 512}) ?? this.user.defaultAvatarURL,
			);

		return this;
	}
}
