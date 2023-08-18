module.exports = {
    name: 'emptyChannel',
    async execute(queue) {
        queue.metadata.send(
            'Leaving because no voice chat activity for the past 5 minutes.'
        );
    }
};
