const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    load_speed_rating: {
        type: String, 
        required: true,
        enum: ['LT', 'P', 'C', 'D', 'Z', 'T']
    },
    discription: {type: String, required: true},
});

CategorySchema.virtual('url').get(function () {
    return `/catalog/category/${this._id}`
});

module.exports = mongoose.model('Category', CategorySchema);