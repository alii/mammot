export enum ApiErrors {
	UNKNOWN = 'something_went_wrong',
	NO_PERMISSION = 'no_permission',
	NO_COMMANDS_AFTER_LOGIN = 'no_commands_after_login',
	INCORRECT_CHANNEL = 'incorrect_channel',
	INCORRECT_ROLE = 'incorrect_role',
	GUILD_ONLY = 'guild_only',
	DM_ONLY = 'dm_only',
}

interface ErrorShape {
	message: string;
}

export const apiErrorMap: Record<ApiErrors, ErrorShape> = {
	[ApiErrors.UNKNOWN]: {
		message: 'Something went wrong! Oops..',
	},
	[ApiErrors.NO_PERMISSION]: {
		message: 'You do not have permission to run this command!',
	},
	[ApiErrors.NO_COMMANDS_AFTER_LOGIN]: {
		message: 'Cannot add commands after login',
	},
	[ApiErrors.INCORRECT_CHANNEL]: {
		message: "You can't run that command in this channel!",
	},
	[ApiErrors.INCORRECT_ROLE]: {
		message: "You don't have the proper role to run this command!",
	},
	[ApiErrors.GUILD_ONLY]: {
		message: 'That command can only be ran in guilds!',
	},
	[ApiErrors.DM_ONLY]: {
		message: 'That command can only be ran in DMs!',
	},
};
