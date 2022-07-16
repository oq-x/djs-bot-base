const { CommandInteraction, Client, Collection } = require("discord.js")
const ms = require("ms")

module.exports = {
    name: "interactionCreate",
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction){
        const { default: prettyMilliseconds } = await import("pretty-ms")
        if(interaction.isCommand()){
            const command = client.commands.get(interaction.commandName)
            if(!interaction.guild || !interaction.member) return await interaction.reply({ content: "This command must be executed in a guild.", ephemeral: true })
            if(!command) return await interaction.reply({ content: "Unknown command.", ephemeral: true })
            const missingPermissions = []
            for(const permission of command.permissions){
                if(!interaction.member.permissions.has(permission)) missingPermissions.push(permission)
            }
            if(missingPermissions.length) return await interaction.reply({ content: `You do not have enough permissions to use this command. Missing permissions: ${missingPermissions.map(perm => `\`${perm}\``).join(", ")}`, ephemeral: true })

            if(!client.cooldowns.has(command.data.name)){
                client.cooldowns.set(command.data.name, new Collection())
            }
            const currentTime = Date.now()
    
            let timestamps = client.cooldowns.get(command.name)
            const cooldownAmount = ms(command.cooldown)
            if(timestamps.has(message.author.id)){
                const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount
    
                if(currentTime < expirationTime){
                    const timeLeft = prettyMilliseconds(expirationTime - currentTime, { compact: true, verbose: true })
    
                    return await interaction.reply({ content: `Please wait ${timeLeft} before running this command again.`, ephemeral: true })
                }
            }

            try {
                await command.execute(interaction)
                timestamps.set(interaction.user.id, currentTime)
            } catch(content) {
                console.log(content)
                await interaction.reply({ content, ephemeral: true })
            }

        }
    }
}
