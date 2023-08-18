module.exports = {
    name: 'playerStart',
    async execute(queue, track) {
        queue.metadata.send(`Started playing: **{track.title}**`);
    }
};
