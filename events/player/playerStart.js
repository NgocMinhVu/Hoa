const { addBalance } = require('../../credit/credit.js');

module.exports = {
    name: 'playerStart',
    async execute(queue, track) {
        addBalance(track.raw.requestedBy.id, 1);
    }
};
