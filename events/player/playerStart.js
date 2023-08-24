const { addBalance } = require('../../credit/credit.js');

module.exports = {
    name: 'playerStart',
    async execute(queue, track) {
        addBalance(track.requestedBy.id, 1);
    }
};
