import { Client, GatewayIntentBits, SlashCommandBuilder, Routes } from 'discord.js';
import * as dotenv from 'dotenv';
import { REST } from '@discordjs/rest';

// Get data from environment variables
dotenv.config();
const token = process.env.DISCORD_TOKEN as string;
const appId = process.env.APPLICATION_ID as string;
const serverId = process.env.SERVER_ID as string;
console.log(token);

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

// Login to Discord with your client's token
client.login(token);

// Commands
async function RegisterCommands() {
    const commands = [
        new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
        new SlashCommandBuilder().setName('delete').setDescription('Deletes stuff'),
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
    else if(commandName == 'delete') {
        // TODO: add pagination https://stackoverflow.com/a/71620968
        const msgs = await interaction.channel?.messages.fetch({ limit: 100 });

        console.log(msgs);
		await interaction.reply('sure thing my man');
    }
});

client.login(token);

RegisterCommands();