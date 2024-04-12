const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TireSchema = new Schema({
    manufacturer: {type: Schema.ObjectId, ref: 'Manufacturer', required: true},
    model: {type: String, required: true},
    info: {type: String, required: true},
    sku: {type: String, required: true},
    category: {type: Schema.ObjectId, ref: 'Category', required: true},
    stock: {type: Number, required: true},
    price: {type: Number, required: true},
});

TireSchema.virtual('url').get(function () {
    return `/catalog/tire/${this._id}`
});

module.exports = mongoose.model('Tire', TireSchema);