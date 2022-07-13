//Importing Packages
const { Client, Collection } = require("discord.js")
const fs = require("fs")
const { QuickDB } = require("quick.db")
const config = require("./config.json")
const { REST } = require("@discordjs/rest")

// Add properties to env
for(const i in config){
    process.env[i] = config[i]
}

const commands = []

// Create the bot, api client and commands collection
const client = new Client({ intents: process.env.intents })
const api = new REST().setToken(process.env.token)
const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"))
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"))
client.commands = new Collection()
client.cooldown = new Collection()


// Add commands and events
for(const file of eventFiles){
    const event = require(file);
    client.on(event.name, event.execute.bind(null, client))
}

for(const file of commandFiles){
    const command = require(file)
    commands.push(command.data)
    commands.set(command.data.name, command)
}

// Register application commands
(async() => {
    await api.put(`https://discord.com/api/${process.env.version}/applications/${process.env.id}/commands`)
    console.log(`Successfully registered application commands.`)
})

// Finally, start the bot and export all of the neccessary objects
client.login(process.env.token)
exports.client = client;
exports.db = new QuickDB();