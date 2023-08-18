module.exports = {
    name: 'disconnect',
    async execute(queue) {
        queue.metadate.send('Looks like my job here is done, leaving now!');
    }
};
