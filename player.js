const { Player } = require('discord-player');
const {
    SpotifyExtractor,
    SoundCloudExtractor
} = require('@discord-player/extractor');

// entrypoint for discord-player based application
const player = new Player(client);

// load all extractors from the @discord-player/extractor package
await player.extractors.loadDefault();

player.on('trackStart', (queue, track) => {
    queue.metadata.send(
        `🎶 | Started playing: **${track.title}** in **${queue.connection.channel.name}**!`
    );
});

player.on('trackAdd', (queue, track) => {
    queue.metadata.send(`🎶 | Track **${track.title}** queued!`);
});

player.on('botDisconnect', (queue) => {
    queue.metadata.send(
        '❌ | I was manually disconnected from the voice channel, clearing queue!'
    );
});

player.on('channelEmpty', (queue) => {
    queue.metadata.send('❌ | Nobody is in the voice channel, leaving...');
});

player.on('queueEnd', (queue) => {
    queue.metadata.send('✅ | Queue finished!');
});

module.exports = { player };
