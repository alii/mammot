import 'dotenv/config';
import {Mammot} from '@mammot/core';
import {Intents} from 'discord.js';
import {green} from 'colorette';

const mammot = Mammot.client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS,
	],

	developmentGuild: process.env.DEVELOPMENT_GUILD_ID!,

	async onError(interaction, error) {
		console.warn(error);
		return Promise.resolve('Something went wrong!');
	},

	onReady(user) {
		console.log(green('ready -'), `Logged into client as ${user.username}`);
	},
});

void mammot.load('./commands').login(process.env.DISCORD_TOKEN);
