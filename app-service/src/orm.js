const mongoose = require('mongoose');

const stateDB = require('./state.model')(mongoose);
const eventDB = require('./event.model')(mongoose);

module.exports = {
    mongoose,
    stateDB,
    eventDB
}