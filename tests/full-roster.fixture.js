// Explicit six-chip scenario for legacy scoring/inventory coverage.
// Actual runs use the unmodified createState() and start with one Basic.
const game = require('../script.js');
module.exports = {...game, createState() {
    const state = game.createState();
    state.chips = game.CHIP_TYPES.map(game.createChip);
    state.nextChipId = 6;
    state.target = 100;
    return state;
}};
