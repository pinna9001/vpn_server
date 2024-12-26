import { REST, Routes, Client, Events, SlashCommandBuilder, GatewayIntentBits, Collection, CommandInteraction } from "discord.js";

import fetch from "node-fetch";

const { DISCORD_TOKEN, DISCORD_CLIENT_ID, DISCORD_USER_ID, VPN_MANAGEMENT_SERVER } = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID || !DISCORD_USER_ID || !VPN_MANAGEMENT_SERVER ) {
	throw new Error("Missing environment variables");
}

const client = new Client({ intents: 8 });

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`)
	
	client.users.fetch(DISCORD_USER_ID).then((user) =>  {
		user.send("VPN Manager ready");
	}); 
});

client.login(DISCORD_TOKEN);

const commands = [
	{
		data: new SlashCommandBuilder()
			.setName("start")
			.setDescription("Start VPN Server"),
		async execute(interaction: CommandInteraction) {
			const response = await fetch(VPN_MANAGEMENT_SERVER + "/start")
			if (response.status === 200) {	
				return interaction.reply("Started VPN Server")
			} else {
				return interaction.reply("Couldn't start VPN server")
			}
		}
	},
	{
		data: new SlashCommandBuilder()
			.setName("stop")
			.setDescription("Stop VPN Server"),
		async execute(interaction: CommandInteraction) {
			const response = await fetch(VPN_MANAGEMENT_SERVER + "/stop")
			if (response.status === 200) {	
				return interaction.reply("Stopped VPN Server")
			} else {
				return interaction.reply("Couldn't stop VPN server")
			}
		}
	},
	{
		data: new SlashCommandBuilder()
			.setName("status")
			.setDescription("VPN Server Status"),
		async execute(interaction: CommandInteraction) {
			const response = await fetch(VPN_MANAGEMENT_SERVER + "/status")
			if (response.status === 200) {	
				const data = await response.json();
				return interaction.reply(data)
			} else {
				return interaction.reply("Couldn't get VPN server status.")
			}
		}	
	}
]

const commandMap = new Collection<string, typeof commands[0]>();
commands.forEach(command => {
	commandMap.set(command.data.name, command)
});
const commandsData = Object.values(commands).map((command) => command.data);

const rest = new REST().setToken(DISCORD_TOKEN);
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationCommands(DISCORD_CLIENT_ID),
			{ body: commandsData },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.log(error);
	}
})();

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	
	const command = commandMap.get(interaction.commandName);
	
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return
	}

	try {
		await command.execute(interaction);
	} catch(error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true});
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true});
		}
	}
});
