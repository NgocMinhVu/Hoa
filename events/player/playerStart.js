const { addBalance } = require('../../credit/currency');

module.exports = {
    name: 'playerStart',
    async execute(queue, track) {
        addBalance(track.raw.requestedBy.id, 1);
    }
};
