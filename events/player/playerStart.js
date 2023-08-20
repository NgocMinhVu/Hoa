module.exports = {
    name: 'playerStart',
    async execute(queue, track) {
        // TODO: add 1 credit to the person who requests the song
        await queue.metadata.channel.send(`${track.title}`);
    }
};
