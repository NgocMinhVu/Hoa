module.exports = {
    name: 'playerSkip',
    async execute(queue, track) {
        queue.metadata.send(`Skipping **${track.title}** due to an issue!`);
    }
};
