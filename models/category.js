const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    tire_class: { type: String, required: true, },
    season: { type: String, required: true, enum: ['All Season', 'Winter']},
    description: {type: String, required: false},
});

CategorySchema.virtual('')

CategorySchema.virtual('url').get(function () {
    return `/catalog/category/${this._id}`
});

module.exports = mongoose.model('Category', CategorySchema);