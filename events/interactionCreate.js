const { Events, Collection, time } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isAutocomplete()) {
            const command = client.commands.get(interaction.commandName);

            if (!command) {
                console.error(
                    `No command matching ${interaction.commandName} was found.`
                );
                return;
            }

            try {
                await command.autocomplete(interaction);
            } catch (error) {
                console.error(error);
            }
        }

        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);

            if (!command) {
                console.error(
                    `No command matching ${interaction.commandName} was found.`
                );
                return;
            }

            const { cooldowns } = client;

            // check if the command has a cooldown registered in the cooldowns collection
            if (!cooldowns.has(command.data.name)) {
                cooldowns.set(command.data.name, new Collection());
            }

            const now = Date.now();
            // get the timestamps Collection for the command
            const timestamps = cooldowns.get(command.data.name);
            const defaultCooldownDuration = 10;
            const cooldownAmount =
                (command.cooldown ?? defaultCooldownDuration) * 1000;

            // check if user has an active cooldown for the command
            if (timestamps.has(interaction.user.id)) {
                // store the timestamp in miliseconds when the user's cooldown will expire
                const expirationTime =
                    timestamps.get(interaction.user.id) + cooldownAmount;

                if (now < expirationTime) {
                    // convert expirationTime from milliseconds to seconds (Unix timestamp)
                    const expiredTimestamp = Math.round(expirationTime / 1000);
                    // display expiredTimestamp in Relative Time format
                    await interaction.reply({
                        content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`,
                        ephemeral: true
                    });

                    // delete reply after the user's cooldown expires
                    const timeRemaining = expirationTime - now;
                    setTimeout(() => {
                        interaction.deleteReply().catch(console.error);
                    }, timeRemaining);

                    return;
                }
            }

            // if the user is not on cooldown, update the timestamps Collection with the current timestamp
            timestamps.set(interaction.user.id, now);

            // remove the user's timestamp after tne user's cooldown expires
            setTimeout(
                () => timestamps.delete(interaction.user.id),
                cooldownAmount
            );

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`Error executing ${interaction.commandName}`);
                console.error(error);
            }
        } else if (interaction.isModalSubmit()) {
            await interaction.reply({
                content: 'Your submission was received successfully!'
            });
        } else if (interaction.isButton()) {
            // respond to the button
            return;
        } else if (interaction.isStringSelectMenu()) {
            // respond to the select menu
            return;
        }
    }
};
