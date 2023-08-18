module.exports = {
    name: 'emptyQueue',
    async execute(queue) {
        queue.metadata.send('Queue finished!');
    }
};
