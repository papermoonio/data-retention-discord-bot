import { Client, GatewayIntentBits, SlashCommandBuilder, Routes, Message, Collection } from 'discord.js';
import * as dotenv from 'dotenv';
import { REST } from '@discordjs/rest';

// Get data from environment variables
dotenv.config();
const token = process.env.DISCORD_TOKEN as string;
const appId = process.env.APPLICATION_ID as string;
const serverId = process.env.SERVER_ID as string;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

// Login to Discord with your client's token
client.login(token);

// Commands
// TODO: add permissions to commands
async function RegisterCommands() {
    const commands = [
        new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
        new SlashCommandBuilder().setName('delete').setDescription('Deletes stuff'),
        new SlashCommandBuilder().setName('shutdown').setDescription('Terminates the bot.')
    ]
        .map(command => command.toJSON());

    const rest = new REST({ version: '10' }).setToken(token);

    await rest.put(Routes.applicationGuildCommands(appId, serverId), { body: commands });
    console.log("Added commands.");
}

// On Start
client.once('ready', () => console.log('Ready!'));

// On Interaction (interpret commands)
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'ping') {
        await interaction.reply('Pong!');
    }
    else if (commandName == 'delete') {
        let msgPtr: Message | undefined = await interaction.channel?.messages.fetch({ limit: 1 })
            .then(messagePage => (messagePage.size === 1 ? messagePage.at(0) : undefined));
        if(msgPtr == undefined) {
            await interaction.reply(`No messages found!`);
            return;
        }
        const allMsgs: Message[] = [msgPtr];

        // Query until there are no more messages
        while(msgPtr != undefined) {
            const msgQuery: Collection<string, Message<boolean>> | undefined = 
                await interaction.channel?.messages.fetch({ limit: 100, before: msgPtr.id });
            msgQuery?.forEach(m => { 
                // TODO: add message if it's old enough
                allMsgs.push(m);
            });

            // Update our message pointer to be last message in page of messages
            if(msgQuery) msgPtr = 0 < msgQuery.size ? msgQuery.at(msgQuery.size - 1) : undefined;
            else msgPtr = undefined;
        }

        console.log(allMsgs.length + 'messages found');
        // if (allMsgs.length > 0) await interaction.channel?.messages.delete(allMsgs[0]);
        await interaction.reply(`Messages Found: ${allMsgs.length}`);
    }
    else if (commandName == 'shutdown') {
        await interaction.reply("Shutting down...");
        client.destroy();
    }
});

RegisterCommands();