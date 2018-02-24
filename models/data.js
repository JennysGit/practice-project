
const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    title: String,
    subtitle: String,
    image: String,
    steps: Array,
    ingredients: Array,
    common: Object,
    guide: Object,
    suits: Array,
    restraints: Array,
    tags: Array,
});

module.exports = mongoose.model('DATA', Schema);