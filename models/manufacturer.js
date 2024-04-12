const mongoose = require('mongoose');
const Schema = mongoose.Schema

const ManufacturerSchema = new Schema({
    name: {type: String, required: true},
    location: {type: String, required: true},
});

ManufacturerSchema.virtual('url').get(function () {
    return `/catalog/manufacturer/${this._id}`
});

ManufacturerSchema.virtual('isMadeInUSA').get(function () {
    return this.location === 'USA'
});

module.exports = mongoose.model('Manufacturer', ManufacturerSchema);