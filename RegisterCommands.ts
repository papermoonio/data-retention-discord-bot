import { SlashCommandBuilder, Routes, PermissionFlagsBits } from 'discord.js';
import { REST } from '@discordjs/rest';
import { token, appId, serverId } from './index';


export enum COMMANDS {
    Delete = 'delete',
    IntervalDelete = 'intervaldel',
    List = 'list',
    Stop = 'stop',
    Shutdown = 'shutdown',
    Spam = 'spam',
    BatchDelete = 'batchdelete'
}

export enum OPTIONS {
    Channel = 'channel',
    Days = 'days',
    OlderBounds = 'olderbounds',
    YoungerBounds = 'youngerbounds',
    Batch = 'batch'
}

// Commands
export async function RegisterCommands() {
    const commands = [
        new SlashCommandBuilder().setName(COMMANDS.Delete)
            .setDescription('Deletes old messages')
            .addChannelOption(option => option
                .setName(OPTIONS.Channel)
                .setDescription('Channel to delete in.')
                .setRequired(true)
            )
            .addIntegerOption(option => option
                .setName(OPTIONS.Days)
                .setDescription('How old messages must be before deleting them.')
                .setRequired(true)
            )
            .setDefaultMemberPermissions(0),
        new SlashCommandBuilder().setName(COMMANDS.IntervalDelete)
            .setDescription('Deletes within a specified interval')
            .addIntegerOption(option => option
                .setName(OPTIONS.OlderBounds)
                .setDescription('The older (smaller number) timestamp bounds to delete within.')
                .setRequired(true)
            )
            .addIntegerOption(option => option
                .setName(OPTIONS.YoungerBounds)
                .setDescription('The younger (larger number) timestamp bounds to delete within.')
                .setRequired(true)
            )
            .addChannelOption(option => option
                .setName(OPTIONS.Channel)
                .setDescription('Channel to delete in.')
                .setRequired(true)
            )
            .setDefaultMemberPermissions(0),
        new SlashCommandBuilder().setName(COMMANDS.BatchDelete)
            .setDescription('Begins a batch of deletion routines.')
            .addStringOption(option => option
                .setName(OPTIONS.Batch)
                .setDescription('In the format: [[DAYS,"CHANNEL_ID"],[DAYS,"CHANNEL_ID"]...]')
                .setRequired(true)
            )
            .setDefaultMemberPermissions(0),
        new SlashCommandBuilder().setName(COMMANDS.List)
            .setDescription("Lists all active deletion routines.")
            .setDefaultMemberPermissions(0),
        new SlashCommandBuilder().setName(COMMANDS.Stop)
            .setDescription('Stops deletion')
            .addChannelOption(option => option
                .setName(OPTIONS.Channel)
                .setDescription('Channel to stop deletion in.')
                .setRequired(true)
            )
            .setDefaultMemberPermissions(0),
        new SlashCommandBuilder().setName(COMMANDS.Shutdown)
            .setDescription('Terminates the bot.').setDefaultMemberPermissions(0),
        new SlashCommandBuilder().setName(COMMANDS.Spam)
            .setDescription("🤡").setDefaultMemberPermissions(0),
    ]
        .map(command => command.toJSON());

    const rest = new REST({ version: '10' }).setToken(token);

    await rest.put(Routes.applicationGuildCommands(appId, serverId), { body: commands });
    console.log("Added commands.");
}
