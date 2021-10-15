import {CommandInteraction} from 'discord.js';
import {Inhibitor} from '../types/inhibitors';

export const adminOnly: Inhibitor = (interaction: CommandInteraction) => String(interaction.memberPermissions?.has('ADMINISTRATOR')).toLowerCase() === 'true';
