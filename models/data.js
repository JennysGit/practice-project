
const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    title: String,
    subtitle: String,
    image: String,
    steps: String,
    ingredients: String,
    common: String,
    guide: String,
    suits: String,
    restraints: String,
    tags: String,
});

module.exports = mongoose.model('DATA', Schema);