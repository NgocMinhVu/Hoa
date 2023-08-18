module.exports = {
    name: 'audioTrackAdd',
    async execute(queue, track) {
        queue.metadata.send(`Track **${track.title}** queued`);
    }
};
